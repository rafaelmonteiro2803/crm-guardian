import { useMemo } from "react";
import { Icons } from "../components/Icons";
import {
  getCategoriaLabel,
  isVencida,
  isVencendoHoje,
} from "../constants/contasPagar";

export function ContasPagarDashboard({ contasPagar, parcelas, fornecedores, fmtBRL }) {
  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();

  const indicadores = useMemo(() => {
    const emAberto = parcelas.filter((p) => p.status === "em_aberto" && !isVencida(p));
    const vencidas = parcelas.filter((p) => isVencida(p));
    const pagas = parcelas.filter((p) => p.status === "pago");
    const vencendoHoje = parcelas.filter((p) => isVencendoHoje(p));

    // Total a pagar no mês
    const doMes = parcelas.filter((p) => {
      const d = new Date(p.data_vencimento + "T00:00:00");
      return d.getMonth() === mesAtual && d.getFullYear() === anoAtual && p.status !== "cancelado";
    });

    // Despesas fixas vs variáveis (parcelas em aberto)
    const todasAtivas = parcelas.filter((p) => p.status !== "cancelado" && p.status !== "pago");
    const contasIds = todasAtivas.map((p) => p.conta_pagar_id);
    const fixas = todasAtivas.filter((p) => {
      const conta = contasPagar.find((c) => c.id === p.conta_pagar_id);
      return conta?.tipo === "fixo";
    });
    const variaveis = todasAtivas.filter((p) => {
      const conta = contasPagar.find((c) => c.id === p.conta_pagar_id);
      return conta?.tipo === "variavel";
    });

    return {
      totalEmAberto: emAberto.reduce((s, p) => s + parseFloat(p.valor || 0), 0),
      qtdEmAberto: emAberto.length,
      totalVencidas: vencidas.reduce((s, p) => s + parseFloat(p.valor || 0), 0),
      qtdVencidas: vencidas.length,
      totalPago: pagas.reduce((s, p) => s + parseFloat(p.valor || 0), 0),
      qtdPago: pagas.length,
      totalMes: doMes.reduce((s, p) => s + parseFloat(p.valor || 0), 0),
      qtdMes: doMes.length,
      totalFixas: fixas.reduce((s, p) => s + parseFloat(p.valor || 0), 0),
      totalVariaveis: variaveis.reduce((s, p) => s + parseFloat(p.valor || 0), 0),
      vencendoHoje: vencendoHoje.length,
    };
  }, [parcelas, contasPagar, mesAtual, anoAtual]);

  // Despesas por categoria (parcelas em aberto + vencidas)
  const despesasPorCategoria = useMemo(() => {
    const pendentes = parcelas.filter(
      (p) => p.status === "em_aberto" || isVencida(p)
    );
    const mapa = {};
    pendentes.forEach((p) => {
      const conta = contasPagar.find((c) => c.id === p.conta_pagar_id);
      const cat = conta?.categoria || "outros";
      if (!mapa[cat]) mapa[cat] = 0;
      mapa[cat] += parseFloat(p.valor || 0);
    });
    return Object.entries(mapa)
      .map(([cat, total]) => ({ cat, total, label: getCategoriaLabel(cat) }))
      .sort((a, b) => b.total - a.total);
  }, [parcelas, contasPagar]);

  // Fluxo de caixa projetado (próximos 6 meses)
  const fluxoProjetado = useMemo(() => {
    const meses = [];
    const nm = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    for (let i = 0; i < 6; i++) {
      const d = new Date(anoAtual, mesAtual + i, 1);
      const m = d.getMonth();
      const a = d.getFullYear();
      const label = `${nm[m]}/${a}`;
      const total = parcelas
        .filter((p) => {
          if (p.status === "cancelado") return false;
          const dv = new Date(p.data_vencimento + "T00:00:00");
          return dv.getMonth() === m && dv.getFullYear() === a;
        })
        .reduce((s, p) => s + parseFloat(p.valor || 0), 0);
      meses.push({ label, total, mes: m, ano: a });
    }
    return meses;
  }, [parcelas, mesAtual, anoAtual]);

  const maxFluxo = Math.max(...fluxoProjetado.map((m) => m.total), 1);

  const nomesMeses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-gray-700">Dashboard — Contas a Pagar</h2>

      {/* Cards indicadores principais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-blue-200 rounded p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-blue-600 font-medium">Total a Pagar no Mês</span>
            <Icons.Calendar className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-lg font-semibold text-blue-700">R$ {fmtBRL(indicadores.totalMes)}</p>
          <p className="text-[11px] text-blue-500">{indicadores.qtdMes} parcela(s) em {nomesMeses[mesAtual]}</p>
        </div>

        <div className="bg-white border border-yellow-200 rounded p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-yellow-700 font-medium">Em Aberto</span>
            <Icons.Clock className="w-4 h-4 text-yellow-500" />
          </div>
          <p className="text-lg font-semibold text-yellow-700">R$ {fmtBRL(indicadores.totalEmAberto)}</p>
          <p className="text-[11px] text-yellow-600">{indicadores.qtdEmAberto} parcela(s)</p>
        </div>

        <div className="bg-white border border-red-200 rounded p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-red-700 font-medium">Obrigações Vencidas</span>
            <Icons.AlertCircle className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-lg font-semibold text-red-700">R$ {fmtBRL(indicadores.totalVencidas)}</p>
          <p className="text-[11px] text-red-600">{indicadores.qtdVencidas} vencida(s)</p>
        </div>

        <div className="bg-white border border-green-200 rounded p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-green-700 font-medium">Pago (total)</span>
            <Icons.CheckCircle className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-lg font-semibold text-green-700">R$ {fmtBRL(indicadores.totalPago)}</p>
          <p className="text-[11px] text-green-600">{indicadores.qtdPago} pago(s)</p>
        </div>
      </div>

      {/* Alertas */}
      {indicadores.vencendoHoje > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded p-3 flex items-center gap-2">
          <Icons.AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
          <p className="text-xs text-orange-700">
            <span className="font-semibold">{indicadores.vencendoHoje} parcela(s)</span> vencem hoje!
          </p>
        </div>
      )}
      {indicadores.qtdVencidas > 0 && (
        <div className="bg-red-50 border border-red-200 rounded p-3 flex items-center gap-2">
          <Icons.XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-xs text-red-700">
            <span className="font-semibold">{indicadores.qtdVencidas} parcela(s)</span> estão vencidas — total de <span className="font-semibold">R$ {fmtBRL(indicadores.totalVencidas)}</span>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Fixas vs Variáveis */}
        <div className="bg-white border border-gray-200 rounded p-4">
          <h3 className="text-xs font-medium text-gray-500 mb-3 flex items-center gap-1">
            <Icons.BarChart className="w-3.5 h-3.5" />Despesas Fixas vs Variáveis (em aberto)
          </h3>
          {indicadores.totalFixas + indicadores.totalVariaveis > 0 ? (
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[11px] text-gray-600 mb-1">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-sm inline-block bg-blue-500" />Fixas
                  </span>
                  <span className="font-medium">R$ {fmtBRL(indicadores.totalFixas)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${indicadores.totalFixas + indicadores.totalVariaveis > 0
                        ? (indicadores.totalFixas / (indicadores.totalFixas + indicadores.totalVariaveis)) * 100
                        : 0}%`
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-gray-600 mb-1">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-sm inline-block bg-orange-400" />Variáveis
                  </span>
                  <span className="font-medium">R$ {fmtBRL(indicadores.totalVariaveis)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-orange-400 h-2 rounded-full"
                    style={{
                      width: `${indicadores.totalFixas + indicadores.totalVariaveis > 0
                        ? (indicadores.totalVariaveis / (indicadores.totalFixas + indicadores.totalVariaveis)) * 100
                        : 0}%`
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-center py-6 text-xs">Nenhuma despesa em aberto.</p>
          )}
        </div>

        {/* Despesas por Categoria */}
        <div className="bg-white border border-gray-200 rounded p-4">
          <h3 className="text-xs font-medium text-gray-500 mb-3 flex items-center gap-1">
            <Icons.DollarSign className="w-3.5 h-3.5" />Despesas por Categoria (pendente)
          </h3>
          {despesasPorCategoria.length > 0 ? (
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {despesasPorCategoria.map(({ cat, total, label }) => {
                const maxCat = despesasPorCategoria[0]?.total || 1;
                const pct = (total / maxCat) * 100;
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-[11px] text-gray-600 mb-0.5">
                      <span>{label}</span>
                      <span className="font-medium">R$ {fmtBRL(total)}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className="bg-purple-500 h-1.5 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-6 text-xs">Nenhuma despesa pendente.</p>
          )}
        </div>

        {/* Fluxo de caixa projetado */}
        <div className="bg-white border border-gray-200 rounded p-4 lg:col-span-2">
          <h3 className="text-xs font-medium text-gray-500 mb-3 flex items-center gap-1">
            <Icons.TrendingUp className="w-3.5 h-3.5" />Fluxo de Caixa Projetado — Saídas (próximos 6 meses)
          </h3>
          {fluxoProjetado.some((m) => m.total > 0) ? (
            <div>
              <div className="flex items-end gap-1" style={{ height: "140px" }}>
                {fluxoProjetado.map((m, i) => {
                  const h = maxFluxo > 0 ? (m.total / maxFluxo) * 100 : 0;
                  const isCurrentMonth = m.mes === mesAtual && m.ano === anoAtual;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                      <span className="text-[10px] text-gray-500 mb-1">
                        R$ {m.total.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
                      </span>
                      <div
                        className={`w-full rounded-t hover:opacity-80 transition-opacity ${isCurrentMonth ? "bg-blue-600" : "bg-gray-400"}`}
                        style={{ height: `${Math.max(h, 2)}%`, minHeight: "3px" }}
                        title={`${m.label}: R$ ${fmtBRL(m.total)}`}
                      />
                      <span className="text-[10px] text-gray-400 mt-1">{m.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-center py-6 text-xs">Nenhuma projeção disponível.</p>
          )}
        </div>
      </div>
    </div>
  );
}
