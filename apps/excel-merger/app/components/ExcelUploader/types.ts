export interface FileData {
  id: string;
  name: string;
  hash: string;
  headers: string[];
  mapping: Record<string, string | null>;
  preview: any[];
  allData: any[];
}

export interface EditingHeader {
  fileId: string;
  oldName: string;
  value: string;
}
