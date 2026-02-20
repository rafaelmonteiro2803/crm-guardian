import React, { useState } from "react";
import { Icons } from "../components/Icons";
import { AgendarComissaoModal } from "../components/modals/AgendarComissaoModal";

const COLUNAS = [
  { key: "pendente", label: "Pendente de Pagamento", hClass: "bg-gray-100 border-gray-300 text-gray-700" },
  { key: "agendado", label: "Pagamento Agendado", hClass: "bg-yellow-50 border-yellow-300 text-yellow-800" },
  { key: "pago", label: "Pagamento Efetuado", hClass: "bg-green-50 border-green-300 text-green-800" },
];

export function ComissoesPage({
  comissoes, tecnicos, ordensServico,
  getTecnicoNome, getClienteNome, fmtBRL,
  onAgendar, onPagar, onExcluir,
}) {
  const [modalAberto, setModalAberto] = useState(false);
  const [comissaoAgendar, setComissaoAgendar] = useState(null);

  const abrirAgendar = (c) => { setComissaoAgendar(c); setModalAberto(true); };
  const fecharAgendar = () => { setModalAberto(false); setComissaoAgendar(null); };
  const handleAgendar = async (form) => { await onAgendar(comissaoAgendar.id, form, fecharAgendar); };

  const porTecnico = tecnicos
    .map((t) => {
      const abertas = comissoes.filter((c) => c.tecnico_id === t.id && c.status !== "pago");
      return {
        t,
        total: abertas.reduce((s, c) => s + parseFloat(c.valor || 0), 0),
        pendente: abertas.filter((c) => c.status === "pendente").length,
        agendado: abertas.filter((c) => c.status === "agendado").length,
      };
    })
    .filter((x) => x.pendente + x.agendado > 0);

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-gray-700">Gestão de Comissões</h2>

      {/* Cards consolidados por técnico */}
      {porTecnico.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded p-4 text-center text-xs text-gray-400">
          Nenhuma comissão em aberto. Conclua um atendimento com técnico e comissão para gerar cards.
        </div>
      ) : (
        <div>
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Valores em Aberto por Técnico</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {porTecnico.map(({ t, total, pendente, agendado }) => (
              <div key={t.id} className="bg-white border border-blue-200 rounded p-3">
                <p className="text-xs font-semibold text-gray-800 truncate">{t.nome}</p>
                {t.especialidade && <p className="text-[10px] text-gray-400">{t.especialidade}</p>}
                <p className="text-xl font-bold text-blue-700 mt-1">R$ {fmtBRL(total)}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  {pendente > 0 && <span className="text-gray-600">{pendente} pendente{pendente > 1 ? "s" : ""}</span>}
                  {pendente > 0 && agendado > 0 && " · "}
                  {agendado > 0 && <span className="text-yellow-600">{agendado} agendado{agendado > 1 ? "s" : ""}</span>}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kanban de comissões */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {COLUNAS.map((col) => {
          const cards = comissoes.filter((c) => c.status === col.key);
          const totalCol = cards.reduce((s, c) => s + parseFloat(c.valor || 0), 0);
          return (
            <div key={col.key} className="flex-shrink-0 w-64">
              <div className={`rounded p-2.5 mb-2 border ${col.hClass}`}>
                <h3 className="text-xs font-semibold">{col.label}</h3>
                <p className="text-[11px] opacity-75">{cards.length} {cards.length === 1 ? "card" : "cards"} · R$ {fmtBRL(totalCol)}</p>
              </div>
              <div className="space-y-2">
                {cards.length === 0 && (
                  <div className="bg-white border border-dashed border-gray-200 rounded p-4 text-center text-[11px] text-gray-400">Sem comissões</div>
                )}
                {cards.map((c) => {
                  const os = ordensServico.find((o) => o.id === c.ordem_servico_id) || {};
                  return (
                    <div key={c.id} className="bg-white border border-gray-200 rounded p-3 shadow-sm">
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="font-mono text-[10px] text-gray-400 bg-gray-50 px-1 rounded">{os.numero_os || "—"}</span>
                        <span className="text-sm font-bold text-blue-700">R$ {fmtBRL(c.valor)}</span>
                      </div>
                      <p className="text-xs font-semibold text-gray-800">{getTecnicoNome(c.tecnico_id)}</p>
                      <p className="text-[11px] text-gray-500 mb-1">{getClienteNome(os.cliente_id)}</p>
                      {parseFloat(c.percentual || 0) > 0 && <p className="text-[10px] text-gray-400">{c.percentual}% s/ R$ {fmtBRL(os.valor_total)}</p>}
                      {c.data_agendamento && <p className="text-[10px] text-yellow-700 mt-1 font-medium">📅 Agendado: {new Date(c.data_agendamento + "T12:00:00").toLocaleDateString("pt-BR")}</p>}
                      {c.data_pagamento && <p className="text-[10px] text-green-700 mt-1 font-medium">✓ Pago em: {new Date(c.data_pagamento + "T12:00:00").toLocaleDateString("pt-BR")}</p>}
                      {c.observacoes && <p className="text-[10px] text-gray-400 mt-1 italic truncate" title={c.observacoes}>{c.observacoes}</p>}
                      <div className="flex gap-1 mt-2 pt-2 border-t border-gray-100">
                        {c.status === "pendente" && (
                          <button onClick={() => abrirAgendar(c)} className="flex-1 px-1.5 py-1 text-[11px] rounded bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200 font-medium">Agendar</button>
                        )}
                        {c.status === "agendado" && (
                          <button onClick={() => onPagar(c.id)} className="flex-1 px-1.5 py-1 text-[11px] rounded bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 font-medium">Confirmar Pago</button>
                        )}
                        {c.status !== "pago" && (
                          <button onClick={() => onExcluir(c.id)} className="text-gray-300 hover:text-red-500 p-1 rounded hover:bg-red-50"><Icons.Trash className="w-3 h-3" /></button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {modalAberto && comissaoAgendar && (
        <AgendarComissaoModal
          comissao={comissaoAgendar}
          getTecnicoNome={getTecnicoNome}
          fmtBRL={fmtBRL}
          onAgendar={handleAgendar}
          onFechar={fecharAgendar}
        />
      )}
    </div>
  );
}
