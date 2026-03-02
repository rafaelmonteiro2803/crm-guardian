import React, { useState } from "react";
import { Icons } from "../Icons";

export function AgendarAtendimentoModal({ os, getClienteNome, fmtBRL, onAgendar, onFechar }) {
  const hoje = new Date();
  const localISO = new Date(hoje.getTime() - hoje.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  const [dataAgendamento, setDataAgendamento] = useState(
    os.data_agendamento
      ? new Date(new Date(os.data_agendamento).getTime() - new Date(os.data_agendamento).getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16)
      : localISO
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg border border-gray-200 max-w-sm w-full p-4">
        <div className="flex items-center gap-2 mb-3">
          <Icons.CalendarPlus className="w-4 h-4 text-orange-500" />
          <h3 className="text-sm font-semibold">Agendar Atendimento</h3>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded p-2.5 mb-3 space-y-1">
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Ordem de Serviço</p>
          <div className="flex justify-between text-xs">
            <span className="font-mono text-gray-700">{os.numero_os}</span>
            <span className="font-medium text-green-700">R$ {fmtBRL(os.valor_total)}</span>
          </div>
          <p className="text-[11px] text-gray-600">{os.descricao}</p>
          <p className="text-[11px] text-gray-500">Cliente: {getClienteNome(os.cliente_id)}</p>
        </div>

        <div className="space-y-2">
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Data e Hora do Atendimento *</label>
            <input
              type="datetime-local"
              value={dataAgendamento}
              onChange={(e) => setDataAgendamento(e.target.value)}
              className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"
            />
          </div>
        </div>

        {os.data_agendamento && (
          <p className="text-[11px] text-orange-600 mt-2">
            Agendamento atual: {new Date(os.data_agendamento).toLocaleString("pt-BR")}
          </p>
        )}

        <div className="flex gap-2 mt-4">
          <button
            onClick={onFechar}
            className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-xs hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={() => onAgendar(os.id, dataAgendamento ? new Date(dataAgendamento).toISOString() : null)}
            className="flex-1 px-3 py-1.5 bg-orange-500 text-white rounded text-xs hover:bg-orange-600 inline-flex items-center justify-center gap-1"
          >
            <Icons.CalendarPlus className="w-3 h-3" />
            Agendar
          </button>
        </div>
      </div>
    </div>
  );
}
