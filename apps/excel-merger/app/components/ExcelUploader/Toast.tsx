"use client";

import React, { useEffect } from "react";
import { CheckCircle, AlertTriangle, XCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "warning" | "error" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

const TOAST_CONFIG: Record<
  ToastType,
  { Icon: React.ElementType; bg: string; border: string; text: string; iconColor: string }
> = {
  success: { Icon: CheckCircle,   bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-800", iconColor: "text-emerald-500" },
  warning: { Icon: AlertTriangle, bg: "bg-amber-50",   border: "border-amber-200",   text: "text-amber-800",  iconColor: "text-amber-500" },
  error:   { Icon: XCircle,       bg: "bg-red-50",     border: "border-red-200",     text: "text-red-800",    iconColor: "text-red-500" },
  info:    { Icon: Info,          bg: "bg-blue-50",    border: "border-blue-200",    text: "text-blue-800",   iconColor: "text-blue-500" },
};

function ToastItem({ toast, onRemove }: { toast: ToastMessage; onRemove: (id: string) => void }) {
  const { Icon, bg, border, text, iconColor } = TOAST_CONFIG[toast.type];

  useEffect(() => {
    const t = setTimeout(() => onRemove(toast.id), 3500);
    return () => clearTimeout(t);
  }, [toast.id, onRemove]);

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-2xl border shadow-lg text-sm font-bold max-w-sm w-full animate-in slide-in-from-top-2 ${bg} ${border} ${text}`}
    >
      <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${iconColor}`} />
      <span className="flex-1 leading-relaxed">{toast.message}</span>
      <button onClick={() => onRemove(toast.id)} className="opacity-40 hover:opacity-80 transition-opacity">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function Toast({ toasts, onRemove }: ToastProps) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}
