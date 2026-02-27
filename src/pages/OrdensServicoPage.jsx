import React from "react";
import { DataGrid } from "../components/DataGrid";
import { Icons } from "../components/Icons";
import { EncaminharModal } from "../components/modals/EncaminharModal";
import { EvolucaoModal } from "../components/modals/EvolucaoModal";

export function OrdensServicoPage({
  ordensServico,
  tecnicos,
  getClienteNome,
  getTecnicoNome,
  fmtBRL,
  encaminharParaTecnico,
  concluirOrdemServico,
  excluirOrdemServico,
  salvarEvolucao,
  modalEncaminhar,
  osEncaminhar,
  abrirModalEncaminhar,
  fecharModalEncaminhar,
  modalEvolucao,
  osEvolucao,
  abrirModalEvolucao,
  fecharModalEvolucao,
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">Ordens de Serviço</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white border border-gray-200 rounded p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-700">Aguardando Atendimento</span>
            <Icons.Clock className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-lg font-semibold text-gray-700">
            {ordensServico.filter((o) => o.status === "aguardando_atendimento").length}
          </p>
          <p className="text-[11px] text-gray-500">ordens pendentes</p>
        </div>
        <div className="bg-white border border-blue-200 rounded p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-blue-700">Em Atendimento</span>
            <Icons.ArrowRight className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-lg font-semibold text-blue-700">
            {ordensServico.filter((o) => o.status === "em_atendimento").length}
          </p>
          <p className="text-[11px] text-blue-500">em execução</p>
        </div>
        <div className="bg-white border border-green-200 rounded p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-green-700">Atendimento Concluído</span>
            <Icons.CheckCircle className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-lg font-semibold text-green-700">
            {ordensServico.filter((o) => o.status === "atendimento_concluido").length}
          </p>
          <p className="text-[11px] text-green-500">concluídas</p>
        </div>
      </div>

      <DataGrid
        columns={[
          { key: "numero_os", label: "Nº OS", render: (o) => <span className="font-mono font-medium text-gray-800 text-[11px]">{o.numero_os}</span>, filterValue: (o) => o.numero_os || "" },
          { key: "data_abertura", label: "Abertura", render: (o) => o.data_abertura ? new Date(o.data_abertura).toLocaleDateString("pt-BR") : "-", filterValue: (o) => o.data_abertura ? new Date(o.data_abertura).toLocaleDateString("pt-BR") : "", sortValue: (o) => o.data_abertura },
          { key: "cliente_id", label: "Cliente", render: (o) => <span className="font-medium">{getClienteNome(o.cliente_id)}</span>, filterValue: (o) => getClienteNome(o.cliente_id) },
          { key: "descricao", label: "Descrição", filterValue: (o) => o.descricao || "" },
          { key: "valor_total", label: "Valor", render: (o) => <span className="font-medium text-green-700">R$ {fmtBRL(o.valor_total)}</span>, sortValue: (o) => parseFloat(o.valor_total || 0) },
          { key: "tecnico_id", label: "Técnico", render: (o) => o.tecnico_id ? <span className="text-gray-700">{getTecnicoNome(o.tecnico_id)}</span> : <span className="text-gray-300">-</span>, filterValue: (o) => o.tecnico_id ? getTecnicoNome(o.tecnico_id) : "" },
          { key: "comissao_valor", label: "Comissão", render: (o) => parseFloat(o.comissao_valor || 0) > 0 ? <span className="text-blue-700 font-medium">R$ {fmtBRL(o.comissao_valor)}</span> : <span className="text-gray-300">-</span>, sortValue: (o) => parseFloat(o.comissao_valor || 0) },
          {
            key: "status",
            label: "Status",
            render: (o) => {
              if (o.status === "aguardando_atendimento") return <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] bg-gray-100 text-gray-700"><Icons.Clock className="w-3 h-3" />Aguardando</span>;
              if (o.status === "em_atendimento") return <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] bg-blue-50 text-blue-700"><Icons.ArrowRight className="w-3 h-3" />Em Atendimento</span>;
              return <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] bg-green-50 text-green-700"><Icons.CheckCircle className="w-3 h-3" />Concluído</span>;
            },
            filterValue: (o) => o.status === "aguardando_atendimento" ? "Aguardando" : o.status === "em_atendimento" ? "Em Atendimento" : "Concluído",
          },
        ]}
        data={ordensServico}
        actions={(o) => (
          <div className="flex items-center gap-1">
            <button onClick={() => abrirModalEvolucao(o)} title="Evolução do Atendimento" className="text-purple-600 hover:bg-purple-50 p-1 rounded"><Icons.BookOpen /></button>
            {o.status !== "atendimento_concluido" && (
              <button onClick={() => abrirModalEncaminhar(o)} className="text-blue-600 hover:bg-blue-50 px-1.5 py-0.5 rounded text-[11px] font-medium whitespace-nowrap">Encaminhar</button>
            )}
            {o.status === "em_atendimento" && (
              <button onClick={() => concluirOrdemServico(o.id)} className="text-green-600 hover:bg-green-50 px-1.5 py-0.5 rounded text-[11px] font-medium whitespace-nowrap">Concluir</button>
            )}
            <button onClick={() => excluirOrdemServico(o.id)} className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1 rounded"><Icons.Trash /></button>
          </div>
        )}
        emptyMessage="Nenhuma ordem de serviço. Registre uma venda para gerar automaticamente."
      />

      {modalEvolucao && osEvolucao && (
        <EvolucaoModal
          aberto={modalEvolucao}
          os={osEvolucao}
          onFechar={fecharModalEvolucao}
          onSalvar={salvarEvolucao}
        />
      )}

      {modalEncaminhar && osEncaminhar && (
        <EncaminharModal
          os={osEncaminhar}
          tecnicos={tecnicos}
          getClienteNome={getClienteNome}
          fmtBRL={fmtBRL}
          onEncaminhar={encaminharParaTecnico}
          onFechar={fecharModalEncaminhar}
        />
      )}
    </div>
  );
}
