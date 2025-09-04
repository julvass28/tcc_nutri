import { useEffect } from "react";

export default function ConfirmDialog({
  open,
  title = "Confirmação",
  message = "Tem certeza?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onClose,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="cd-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="cd-card" onClick={(e) => e.stopPropagation()}>
        <h3 className="cd-title">{title}</h3>
        <p className="cd-message">{message}</p>
        <div className="cd-actions">
          <button className="cd-btn outlined" onClick={onClose}>{cancelText}</button>
          <button className="cd-btn danger" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}
