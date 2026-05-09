export type Notice = {
  id: string;
  tag: string;
  tagColor: string;
  tagText: string;
  title: string;
  content: string;
  date: string;
  isPublished: boolean;
  isPinned?: boolean;
  order?: number;
  createdAt: string;
  updatedAt: string;
};

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  type: string;
  message: string;
  status: "new" | "read" | "done";
  createdAt: string;
  updatedAt: string;
};

type CMSData = {
  notices: Notice[];
  inquiries: Inquiry[];
};

type SupabaseNoticeRow = {
  id: string;
  tag: string | null;
  tag_color: string | null;
  tag_text: string | null;
  title: string | null;
  content: string | null;
  date: string | null;
  is_published: boolean | null;
  is_pinned: boolean | null;
  sort_order: number | null;
  created_at: string | null;
  updated_at: string | null;
};

type SupabaseInquiryRow = {
  id: string;
  name: string | null;
  email: string | null;
  type: string | null;
  message: string | null;
  status: "new" | "read" | "done" | null;
  created_at: string | null;
  updated_at: string | null;
};

const defaultData: CMSData = {
  notices: [],
  inquiries: [],
};

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase 환경변수가 없습니다. NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY를 설정해주세요."
    );
  }

  return {
    url: url.replace(/\/$/, ""),
    key,
  };
}

async function supabaseRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { url, key } = getSupabaseConfig();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Supabase 요청 실패 (${response.status}): ${message}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

function toNotice(row: SupabaseNoticeRow): Notice {
  return {
    id: row.id,
    tag: row.tag || "공지",
    tagColor: row.tag_color || "blue",
    tagText: row.tag_text || row.tag || "공지",
    title: row.title || "",
    content: row.content || "",
    date: row.date || todayText(),
    isPublished: Boolean(row.is_published),
    isPinned: Boolean(row.is_pinned),
    order: typeof row.sort_order === "number" ? row.sort_order : 0,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

function toNoticeRow(notice: Notice, index: number): SupabaseNoticeRow {
  const now = new Date().toISOString();

  return {
    id: notice.id,
    tag: notice.tag || "공지",
    tag_color: notice.tagColor || "blue",
    tag_text: notice.tagText || notice.tag || "공지",
    title: notice.title || "",
    content: notice.content || "",
    date: notice.date || todayText(),
    is_published: Boolean(notice.isPublished),
    is_pinned: Boolean(notice.isPinned),
    sort_order: typeof notice.order === "number" ? notice.order : index,
    created_at: notice.createdAt || now,
    updated_at: notice.updatedAt || now,
  };
}

function toInquiry(row: SupabaseInquiryRow): Inquiry {
  return {
    id: row.id,
    name: row.name || "",
    email: row.email || "",
    type: row.type || "문의",
    message: row.message || "",
    status: row.status || "new",
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

function toInquiryRow(inquiry: Inquiry): SupabaseInquiryRow {
  const now = new Date().toISOString();

  return {
    id: inquiry.id,
    name: inquiry.name || "",
    email: inquiry.email || "",
    type: inquiry.type || "문의",
    message: inquiry.message || "",
    status: inquiry.status || "new",
    created_at: inquiry.createdAt || now,
    updated_at: inquiry.updatedAt || now,
  };
}

export async function readCMSData(): Promise<CMSData> {
  const [noticeRows, inquiryRows] = await Promise.all([
    supabaseRequest<SupabaseNoticeRow[]>(
      "notices?select=*&order=is_pinned.desc,sort_order.asc,created_at.desc"
    ),
    supabaseRequest<SupabaseInquiryRow[]>("inquiries?select=*&order=created_at.desc"),
  ]);

  return {
    notices: noticeRows.map(toNotice).sort(sortNotices),
    inquiries: inquiryRows.map(toInquiry),
  };
}

export function sortNotices(a: Notice, b: Notice) {
  if (Boolean(a.isPinned) !== Boolean(b.isPinned)) {
    return a.isPinned ? -1 : 1;
  }
  return (a.order ?? 0) - (b.order ?? 0);
}

export async function writeCMSData(data: CMSData) {
  const notices = [...data.notices].sort(sortNotices).map((notice, index) =>
    toNoticeRow(
      {
        ...notice,
        order: typeof notice.order === "number" ? notice.order : index,
        updatedAt: notice.updatedAt || new Date().toISOString(),
      },
      index
    )
  );
  const inquiries = data.inquiries.map(toInquiryRow);

  await Promise.all([
    syncTable("notices", notices),
    syncTable("inquiries", inquiries),
  ]);
}

async function syncTable(table: "notices" | "inquiries", rows: Array<{ id: string }>) {
  if (rows.length > 0) {
    await supabaseRequest(`${table}?on_conflict=id`, {
      method: "POST",
      headers: {
        Prefer: "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify(rows),
    });
  }

  const existingRows = await supabaseRequest<Array<{ id: string }>>(`${table}?select=id`);
  const keepIds = new Set(rows.map((row) => row.id));
  const deleteIds = existingRows.map((row) => row.id).filter((id) => !keepIds.has(id));

  await Promise.all(
    deleteIds.map((id) =>
      supabaseRequest(`${table}?id=eq.${encodeURIComponent(id)}`, {
        method: "DELETE",
      })
    )
  );
}

export function createId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function todayText() {
  const now = new Date();
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(now)
    .replace(/\. /g, ".")
    .replace(/\.$/, "");
}
