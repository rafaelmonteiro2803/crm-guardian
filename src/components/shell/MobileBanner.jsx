import React from "react";

export function MobileBanner() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 py-3 text-center shadow-md">
      <p className="text-[11px] text-gray-400 mb-1">Você está na versão mobile</p>
      <button
        onClick={() => { sessionStorage.setItem("crm-full-version", "1"); window.location.reload(); }}
        className="text-xs text-blue-600 hover:text-blue-800 font-medium underline underline-offset-2"
      >
        Abrir versão completa →
      </button>
    </div>
  );
}
