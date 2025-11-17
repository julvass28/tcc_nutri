// src/components/ConfirmDialog.jsx
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
    <div className="cd-backdrop" onClick={onClose} role="dialog" aria-modal="true" style={{
      position:"fixed", inset:0, display:"grid", placeItems:"center", zIndex:9000
    }}>
      <div className="cd-card" onClick={(e) => e.stopPropagation()} style={{
        width: 420, maxWidth:"calc(100% - 32px)", borderRadius:12, padding:18, background:"#fff", boxShadow:"0 12px 30px rgba(0,0,0,.12)"
      }}>
        <h3 className="cd-title" style={{margin:0, marginBottom:8}}>{title}</h3>
        <p className="cd-message" style={{marginTop:0, marginBottom:16, color:"#444"}}>{message}</p>
        <div className="cd-actions" style={{display:"flex", justifyContent:"flex-end", gap:8}}>
          <button className="cd-btn outlined" onClick={onClose} style={{padding:"8px 12px", borderRadius:8, border:"1px solid var(--border)", background:"#fff"}}>{cancelText}</button>
          <button className="cd-btn danger" onClick={onConfirm} style={{padding:"8px 12px", borderRadius:8, border:"none", background:"#d9534f", color:"#fff"}}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}
