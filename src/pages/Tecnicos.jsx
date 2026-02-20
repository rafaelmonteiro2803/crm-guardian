import React, { useState } from "react";
import { DataGrid } from "../components/DataGrid";
import { Icons } from "../components/Icons";
import { TecnicoModal } from "../components/modals/TecnicoModal";

export function TecnicosPage({ tecnicos, onSalvar, onExcluir }) {
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(null);

  const abrir = (t = null) => { setEditando(t); setModalAberto(true); };
  const fechar = () => { setModalAberto(false); setEditando(null); };

  const handleSalvar = async (form) => { await onSalvar(form, editando, fechar); };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">Técnicos Responsáveis</h2>
        <button onClick={() => abrir()} className="inline-flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-xs font-medium">
          <Icons.Plus />Novo
        </button>
      </div>
      <DataGrid
        columns={[
          { key: "nome", label: "Nome", render: (t) => <span className="font-medium text-gray-800">{t.nome}</span>, filterValue: (t) => t.nome || "" },
          { key: "especialidade", label: "Especialidade", render: (t) => t.especialidade || <span className="text-gray-300">-</span>, filterValue: (t) => t.especialidade || "" },
          { key: "cpf", label: "CPF", render: (t) => t.cpf || <span className="text-gray-300">-</span>, filterValue: (t) => t.cpf || "" },
          { key: "email", label: "Email", render: (t) => t.email || <span className="text-gray-300">-</span>, filterValue: (t) => t.email || "" },
          { key: "telefone", label: "Telefone", render: (t) => t.telefone || <span className="text-gray-300">-</span>, filterValue: (t) => t.telefone || "" },
          { key: "endereco", label: "Endereço", render: (t) => t.endereco || <span className="text-gray-300">-</span>, filterValue: (t) => t.endereco || "" },
          { key: "ativo", label: "Status", render: (t) => t.ativo ? <span className="px-1.5 py-0.5 rounded text-[11px] bg-green-50 text-green-700">Ativo</span> : <span className="px-1.5 py-0.5 rounded text-[11px] bg-gray-100 text-gray-500">Inativo</span>, filterValue: (t) => t.ativo ? "Ativo" : "Inativo" },
        ]}
        data={tecnicos}
        actions={(t) => (
          <div className="flex items-center gap-1">
            <button onClick={() => abrir(t)} className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1 rounded"><Icons.Edit /></button>
            <button onClick={() => onExcluir(t.id)} className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1 rounded"><Icons.Trash /></button>
          </div>
        )}
        emptyMessage="Nenhum técnico cadastrado."
      />
      {modalAberto && <TecnicoModal editando={editando} onSalvar={handleSalvar} onFechar={fechar} />}
    </div>
  );
}
