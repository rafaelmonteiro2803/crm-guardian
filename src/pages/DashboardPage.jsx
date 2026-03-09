import React, { useState } from "react";
import { Icons } from "../components/Icons";
import { EvolucaoModal } from "../components/modals/EvolucaoModal";

function calcularIndicadores(oportunidades, vendas, titulos) {
  const abertas = oportunidades.filter((o) => !["fechado", "cancelado"].includes(o.estagio));
  const totalOp = abertas.reduce((s, o) => s + parseFloat(o.valor || 0), 0);
  const fechadas = oportunidades.filter((o) => o.estagio === "fechado");
  const taxa = oportunidades.length > 0 ? ((fechadas.length / oportunidades.length) * 100).toFixed(1) : 0;
  const totalV = vendas.reduce((s, v) => s + parseFloat(v.valor || 0), 0);
  const now = new Date();
  const vm = vendas.filter((v) => {
    const d = new Date(v.data_venda);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const totalVM = vm.reduce((s, v) => s + parseFloat(v.valor || 0), 0);
  const pend = titulos.filter((t) => t.status === "pendente");
  const pagos = titulos.filter((t) => t.status === "pago");
  const venc = pend.filter((t) => new Date(t.data_vencimento) < new Date());
  return {
    totalOportunidades: totalOp,
    numOportunidades: abertas.length,
    taxaConversao: taxa,
    totalVendas: totalV,
    numVendas: vendas.length,
    totalVendasMes: totalVM,
    numVendasMes: vm.length,
    totalReceber: pend.reduce((s, t) => s + parseFloat(t.valor || 0), 0),
    totalRecebido: pagos.reduce((s, t) => s + parseFloat(t.valor || 0), 0),
    totalVencido: venc.reduce((s, t) => s + parseFloat(t.valor || 0), 0),
    numPendentes: pend.length,
    numPagos: pagos.length,
    numVencidos: venc.length,
  };
}

function calcularVendasPorMes(vendas) {
  const meses = {};
  const nm = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  vendas.forEach((v) => {
    const d = new Date(v.data_venda);
    const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const l = `${nm[d.getMonth()]}/${d.getFullYear()}`;
    if (!meses[k]) meses[k] = { label: l, total: 0, count: 0 };
    meses[k].total += parseFloat(v.valor || 0);
    meses[k].count += 1;
  });
  return Object.entries(meses)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([, v]) => v);
}

function calcularFaturamentoMensal(vendas, titulos) {
  const meses = {};
  const nm = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  vendas.forEach((v) => {
    const d = new Date(v.data_venda);
    const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const l = `${nm[d.getMonth()]}/${d.getFullYear()}`;
    if (!meses[k]) meses[k] = { label: l, pago: 0, pendente: 0 };
    const tv = titulos.filter((t) => t.venda_id === v.id);
    meses[k].pago += tv
      .filter((t) => t.status === "pago")
      .reduce((s, t) => s + parseFloat(t.valor || 0), 0);
    meses[k].pendente += tv
      .filter((t) => t.status === "pendente")
      .reduce((s, t) => s + parseFloat(t.valor || 0), 0);
  });
  return Object.entries(meses)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([, v]) => v);
}

const PAGE_SIZE = 2;

function Paginacao({ pagina, total, onChange }) {
  const totalPaginas = Math.ceil(total / PAGE_SIZE);
  if (totalPaginas <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
      <button
        onClick={() => onChange(pagina - 1)}
        disabled={pagina === 1}
        className="text-[10px] px-2 py-0.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        ‹ Anterior
      </button>
      <span className="text-[10px] text-gray-400">
        {pagina} / {totalPaginas}
      </span>
      <button
        onClick={() => onChange(pagina + 1)}
        disabled={pagina === totalPaginas}
        className="text-[10px] px-2 py-0.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Próximo ›
      </button>
    </div>
  );
}

export function DashboardPage({ clientes, oportunidades, vendas, titulos, fmtBRL, ordensServico = [], salvarEvolucao }) {
  const ind = calcularIndicadores(oportunidades, vendas, titulos);
  const vendasPorMes = calcularVendasPorMes(vendas);
  const faturamentoMensal = calcularFaturamentoMensal(vendas, titulos);

  const [modalEvolucao, setModalEvolucao] = useState(false);
  const [osEvolucao, setOsEvolucao] = useState(null);
  const [paginaAgenda, setPaginaAgenda] = useState(1);
  const [paginaAtendimentos, setPaginaAtendimentos] = useState(1);

  const agendamentos = (ordensServico || [])
    .filter((os) => os.data_agendamento && os.status !== "atendimento_concluido")
    .sort((a, b) => new Date(a.data_agendamento) - new Date(b.data_agendamento));

  const atendimentosAbertos = (ordensServico || [])
    .filter((os) => os.status !== "atendimento_concluido")
    .sort((a, b) => new Date(a.data_abertura) - new Date(b.data_abertura));

  const agendamentosPagina = agendamentos.slice((paginaAgenda - 1) * PAGE_SIZE, paginaAgenda * PAGE_SIZE);
  const atendimentosPagina = atendimentosAbertos.slice((paginaAtendimentos - 1) * PAGE_SIZE, paginaAtendimentos * PAGE_SIZE);

  const getClienteNomeLocal = (id) => clientes.find((c) => c.id === id)?.nome || "N/A";

  const getServicosNome = (os) => {
    const itens = Array.isArray(os.itens) ? os.itens : [];
    if (itens.length > 0) {
      const nomes = itens.map((i) => i.nome).filter(Boolean).join(", ");
      if (nomes) return nomes;
    }
    return os.descricao || "-";
  };

  const statusLabel = (status) => {
    if (status === "aguardando_atendimento") return { label: "Aguardando", color: "bg-gray-100 text-gray-600" };
    if (status === "em_atendimento") return { label: "Em Atendimento", color: "bg-blue-50 text-blue-700" };
    return { label: status, color: "bg-gray-100 text-gray-600" };
  };

  const abrirEvolucao = (os) => {
    setOsEvolucao(os);
    setModalEvolucao(true);
  };

  const fecharEvolucao = () => {
    setModalEvolucao(false);
    setOsEvolucao(null);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-gray-700">Visão Geral</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Agenda dos Próximos Dias */}
        <div className="bg-white border border-orange-200 rounded p-4">
          <h3 className="text-xs font-medium text-gray-600 mb-3 flex items-center gap-1.5">
            <Icons.Calendar className="w-3.5 h-3.5 text-orange-500" />
            Agenda dos Próximos Dias
          </h3>
          {agendamentos.length === 0 ? (
            <p className="text-gray-400 text-center py-4 text-xs">Sem Agendamentos.</p>
          ) : (
            <>
              <div className="divide-y divide-gray-100">
                {agendamentosPagina.map((os) => {
                  const dt = new Date(os.data_agendamento);
                  return (
                    <div key={os.id} className="flex items-center gap-3 py-2 first:pt-0 last:pb-0">
                      <div className="flex-shrink-0 bg-orange-50 border border-orange-200 rounded p-1.5 text-center min-w-[48px]">
                        <p className="text-[11px] font-semibold text-orange-700 leading-tight">
                          {dt.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                        </p>
                        <p className="text-[10px] text-orange-500 leading-tight">
                          {dt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-800 truncate">{getClienteNomeLocal(os.cliente_id)}</p>
                        <p className="text-[11px] text-gray-500 truncate">{getServicosNome(os)}</p>
                      </div>
                      {os.numero_os && (
                        <span className="flex-shrink-0 font-mono text-[10px] text-gray-400">{os.numero_os}</span>
                      )}
                    </div>
                  );
                })}
              </div>
              <Paginacao pagina={paginaAgenda} total={agendamentos.length} onChange={setPaginaAgenda} />
            </>
          )}
        </div>

        {/* Atendimentos em Aberto */}
        <div className="bg-white border border-blue-200 rounded p-4">
          <h3 className="text-xs font-medium text-gray-600 mb-3 flex items-center gap-1.5">
            <Icons.Clock className="w-3.5 h-3.5 text-blue-500" />
            Atendimentos em Aberto
            {atendimentosAbertos.length > 0 && (
              <span className="ml-auto bg-blue-100 text-blue-700 text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                {atendimentosAbertos.length}
              </span>
            )}
          </h3>
          {atendimentosAbertos.length === 0 ? (
            <p className="text-gray-400 text-center py-4 text-xs">Nenhum atendimento em aberto.</p>
          ) : (
            <>
              <div className="divide-y divide-gray-100">
                {atendimentosPagina.map((os) => {
                  const st = statusLabel(os.status);
                  return (
                    <div key={os.id} className="flex items-center gap-2 py-2 first:pt-0 last:pb-0">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          {os.numero_os && (
                            <span className="font-mono text-[10px] text-gray-400">{os.numero_os}</span>
                          )}
                          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${st.color}`}>
                            {st.label}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-gray-800 truncate">{getClienteNomeLocal(os.cliente_id)}</p>
                        <p className="text-[11px] text-gray-500 truncate">{getServicosNome(os)}</p>
                      </div>
                      <button
                        onClick={() => abrirEvolucao(os)}
                        title="Registrar evolução do atendimento"
                        className="flex-shrink-0 flex items-center gap-1 text-[11px] text-purple-600 hover:text-purple-800 hover:bg-purple-50 px-2 py-1 rounded border border-purple-200 hover:border-purple-300 transition-colors"
                      >
                        <Icons.BookOpen className="w-3 h-3" />
                        Evolução
                      </button>
                    </div>
                  );
                })}
              </div>
              <Paginacao pagina={paginaAtendimentos} total={atendimentosAbertos.length} onChange={setPaginaAtendimentos} />
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { l: "Clientes", v: clientes.length, s: "Total cadastrados", ic: <Icons.User className="w-5 h-5 text-gray-400" /> },
          { l: "Oportunidades", v: `R$ ${fmtBRL(ind.totalOportunidades)}`, s: `${ind.numOportunidades} ativas · ${ind.taxaConversao}%`, ic: <Icons.TrendingUp className="w-5 h-5 text-gray-400" /> },
          { l: "Vendas", v: `R$ ${fmtBRL(ind.totalVendas)}`, s: `${ind.numVendas} vendas · R$ ${fmtBRL(ind.totalVendasMes)} mês`, ic: <Icons.ShoppingCart className="w-5 h-5 text-gray-400" /> },
          { l: "A Receber", v: `R$ ${fmtBRL(ind.totalReceber)}`, s: `${ind.numPendentes} pendentes`, ic: <Icons.CreditCard className="w-5 h-5 text-gray-400" /> },
        ].map((c, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">{c.l}</span>{c.ic}
            </div>
            <p className="text-lg font-semibold text-gray-800">{c.v}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{c.s}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="bg-white border border-green-200 rounded p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-green-700">Recebido</span>
            <Icons.CheckCircle className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-lg font-semibold text-green-700">R$ {fmtBRL(ind.totalRecebido)}</p>
          <p className="text-[11px] text-green-600">{ind.numPagos} pagos</p>
        </div>
        <div className="bg-white border border-yellow-200 rounded p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-yellow-700">A Receber</span>
            <Icons.Clock className="w-4 h-4 text-yellow-500" />
          </div>
          <p className="text-lg font-semibold text-yellow-700">R$ {fmtBRL(ind.totalReceber)}</p>
          <p className="text-[11px] text-yellow-600">{ind.numPendentes} pendentes</p>
        </div>
        <div className="bg-white border border-red-200 rounded p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-red-700">Vencidos</span>
            <Icons.AlertCircle className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-lg font-semibold text-red-700">R$ {fmtBRL(ind.totalVencido)}</p>
          <p className="text-[11px] text-red-600">{ind.numVencidos} vencidos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="bg-white border border-gray-200 rounded p-4">
          <h3 className="text-xs font-medium text-gray-500 mb-3 flex items-center gap-1">
            <Icons.BarChart className="w-3.5 h-3.5" />Vendas por Mês
          </h3>
          {vendasPorMes.length === 0 ? (
            <p className="text-gray-400 text-center py-6 text-xs">Nenhuma venda registrada.</p>
          ) : (() => {
            const mx = Math.max(...vendasPorMes.map((m) => m.total));
            return (
              <div className="flex items-end gap-1" style={{ height: "180px" }}>
                {vendasPorMes.map((m, i) => {
                  const h = mx > 0 ? (m.total / mx) * 100 : 0;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                      <span className="text-[10px] text-gray-500 mb-1">
                        R$ {m.total.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
                      </span>
                      <div
                        className="w-full bg-gray-700 rounded-t hover:bg-gray-600 transition-colors"
                        style={{ height: `${Math.max(h, 2)}%`, minHeight: "3px" }}
                        title={`${m.label}: R$ ${fmtBRL(m.total)} (${m.count})`}
                      />
                      <span className="text-[10px] text-gray-400 mt-1">{m.label}</span>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>

        <div className="bg-white border border-gray-200 rounded p-4">
          <h3 className="text-xs font-medium text-gray-500 mb-3 flex items-center gap-1">
            <Icons.TrendingUp className="w-3.5 h-3.5" />Oportunidades - Pago x Pendente
          </h3>
          {faturamentoMensal.length === 0 ? (
            <p className="text-gray-400 text-center py-6 text-xs">Nenhuma venda registrada.</p>
          ) : (() => {
            const mx = Math.max(...faturamentoMensal.map((m) => m.pago + m.pendente));
            return (
              <div>
                <div className="flex items-end gap-1" style={{ height: "180px" }}>
                  {faturamentoMensal.map((m, i) => {
                    const total = m.pago + m.pendente;
                    const h = mx > 0 ? (total / mx) * 100 : 0;
                    const pctPago = total > 0 ? (m.pago / total) * 100 : 0;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                        <span className="text-[10px] text-gray-500 mb-1">
                          R$ {total.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
                        </span>
                        <div
                          className="w-full rounded-t overflow-hidden"
                          style={{ height: `${Math.max(h, 2)}%`, minHeight: "3px" }}
                          title={`${m.label}: Pago R$ ${fmtBRL(m.pago)} · Pendente R$ ${fmtBRL(m.pendente)}`}
                        >
                          <div className="w-full h-full flex flex-col justify-end">
                            <div className="w-full" style={{ height: `${100 - pctPago}%`, background: "#e84672" }} />
                            <div className="w-full" style={{ height: `${pctPago}%`, background: "#22c55e" }} />
                          </div>
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1">{m.label}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-center gap-4 mt-2">
                  <span className="flex items-center gap-1 text-[10px] text-gray-500">
                    <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: "#22c55e" }} />Pago
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-gray-500">
                    <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: "#e84672" }} />Pendente
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {modalEvolucao && osEvolucao && (
        <EvolucaoModal
          aberto={modalEvolucao}
          os={osEvolucao}
          onFechar={fecharEvolucao}
          onSalvar={(id, texto) => {
            if (salvarEvolucao) salvarEvolucao(id, texto);
            fecharEvolucao();
          }}
        />
      )}
    </div>
  );
}
