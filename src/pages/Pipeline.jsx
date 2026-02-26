import React, { useState } from "react";
import { Icons } from "../components/Icons";
import { OportunidadeModal } from "../components/modals/OportunidadeModal";
import { ESTAGIOS } from "../constants/oportunidades";

export function PipelinePage({
  oportunidades,
  clientes,
  produtos,
  fmtBRL,
  getClienteNome,
  getProdutoNome,
  onSalvar,
  onExcluir,
  onMover,
}) {
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(null);

  const abrir = (op = null) => { setEditando(op); setModalAberto(true); };
  const fechar = () => { setModalAberto(false); setEditando(null); };

  const handleSalvar = async (form) => { await onSalvar(form, editando, fechar); };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">Pipeline</h2>
        <button
          onClick={() => abrir()}
          disabled={!clientes.length}
          className="inline-flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icons.Plus />Nova Oportunidade
        </button>
      </div>

      {!clientes.length ? (
        <div className="bg-white border border-gray-200 rounded p-8 text-center">
          <p className="text-gray-400 text-xs">Cadastre clientes primeiro.</p>
        </div>
      ) : (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {ESTAGIOS.map((est) => {
            const ops = oportunidades.filter((o) => o.estagio === est);
            const tot = ops.reduce((s, o) => s + parseFloat(o.valor || 0), 0);
            return (
              <div key={est} className="flex-shrink-0 w-56">
                <div className={`rounded p-2 mb-2 ${est === "cancelado" ? "bg-red-50 border border-red-200" : "bg-gray-100 border border-gray-200"}`}>
                  <h3 className={`text-xs font-semibold capitalize ${est === "cancelado" ? "text-red-700" : "text-gray-700"}`}>{est}</h3>
                  <p className="text-[11px] text-gray-500">{ops.length} · R$ {fmtBRL(tot)}</p>
                </div>
                <div className="space-y-1.5">
                  {ops.map((op) => (
                    <div key={op.id} className="bg-white border border-gray-200 rounded p-2">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-xs font-semibold text-gray-800 leading-tight">{op.titulo}</h4>
                        <div className="flex gap-0.5 ml-1">
                          <button onClick={() => abrir(op)} className="text-gray-400 hover:text-gray-600 p-0.5">
                            <Icons.Edit className="w-3 h-3" />
                          </button>
                          <button onClick={() => onExcluir(op.id)} className="text-gray-400 hover:text-red-600 p-0.5">
                            <Icons.Trash className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-500">{getClienteNome(op.cliente_id)}</p>
                      {getProdutoNome(op.produto_id) && (
                        <p className="text-[11px] text-gray-400">{getProdutoNome(op.produto_id)}</p>
                      )}
                      <p className="text-sm font-semibold text-green-700 my-1">R$ {fmtBRL(op.valor)}</p>
                      <div className="flex gap-1">
                        {ESTAGIOS.map((e2, idx) => {
                          const at = ESTAGIOS.indexOf(op.estagio);
                          if (idx !== at + 1 && idx !== at - 1) return null;
                          const av = idx === at + 1;
                          return (
                            <button key={e2} onClick={() => onMover(op.id, e2)}
                              className="flex-1 px-1 py-0.5 text-[10px] rounded bg-gray-50 text-gray-600 hover:bg-gray-100">
                              {av ? "→ Avançar" : "← Voltar"}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalAberto && (
        <OportunidadeModal
          editando={editando}
          clientes={clientes}
          produtos={produtos}
          fmtBRL={fmtBRL}
          onSalvar={handleSalvar}
          onFechar={fechar}
        />
      )}
    </div>
  );
}
