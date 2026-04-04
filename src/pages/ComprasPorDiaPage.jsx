import React, { useState, useMemo } from "react";
import { Icons } from "../components/Icons";

const MESES_NOMES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function getMesKey(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function getMesLabel(key) {
  const [ano, mes] = key.split("-");
  return `${MESES_NOMES[parseInt(mes, 10) - 1]}/${ano}`;
}

function buildMesesDisponiveis(vendas) {
  const set = new Set();
  vendas.forEach((v) => {
    if (v.data_venda) set.add(getMesKey(v.data_venda));
  });
  return Array.from(set).sort();
}

function buildDadosDiaMes(vendas, mesesSelecionados, modo) {
  // matriz: { [mesKey]: { [dia 1-31]: { count, valor } } }
  const dados = {};
  mesesSelecionados.forEach((mk) => { dados[mk] = {}; });

  vendas.forEach((v) => {
    if (!v.data_venda) return;
    const mk = getMesKey(v.data_venda);
    if (!mesesSelecionados.includes(mk)) return;
    const dia = new Date(v.data_venda + "T00:00:00").getDate();
    if (!dados[mk][dia]) dados[mk][dia] = { count: 0, valor: 0 };
    dados[mk][dia].count += 1;
    dados[mk][dia].valor += parseFloat(v.valor || 0);
  });

  return dados;
}

function buildDadosDiaSemana(vendas, mesesSelecionados) {
  // matriz: { [mesKey]: { [diaSemana 0-6]: { count, valor } } }
  const dados = {};
  mesesSelecionados.forEach((mk) => { dados[mk] = {}; });

  vendas.forEach((v) => {
    if (!v.data_venda) return;
    const mk = getMesKey(v.data_venda);
    if (!mesesSelecionados.includes(mk)) return;
    const ds = new Date(v.data_venda + "T00:00:00").getDay();
    if (!dados[mk][ds]) dados[mk][ds] = { count: 0, valor: 0 };
    dados[mk][ds].count += 1;
    dados[mk][ds].valor += parseFloat(v.valor || 0);
  });

  return dados;
}

function getValorCelula(cell, modo) {
  if (!cell) return 0;
  return modo === "quantidade" ? cell.count : cell.valor;
}

function calcIntensidade(val, max) {
  if (!max || max === 0) return 0;
  return Math.max(0.08, val / max);
}

const COR_CHEIA = { r: 37, g: 99, b: 235 }; // blue-600

function corCelula(intensidade) {
  if (intensidade === 0) return "#f3f4f6"; // gray-100 (vazio)
  const alpha = Math.round(intensidade * 255);
  const r = Math.round(255 - (255 - COR_CHEIA.r) * intensidade);
  const g = Math.round(255 - (255 - COR_CHEIA.g) * intensidade);
  const b = Math.round(255 - (255 - COR_CHEIA.b) * intensidade);
  return `rgb(${r},${g},${b})`;
}

function textoCorCelula(intensidade) {
  return intensidade > 0.5 ? "#ffffff" : "#374151";
}

function HeatmapCell({ value, max, tooltip, modo, fmtBRL }) {
  const intensidade = value > 0 ? calcIntensidade(value, max) : 0;
  const bg = corCelula(intensidade);
  const txt = textoCorCelula(intensidade);
  const label =
    value === 0
      ? ""
      : modo === "quantidade"
      ? String(value)
      : value >= 1000
      ? `${(value / 1000).toFixed(1)}k`
      : String(Math.round(value));

  return (
    <div
      className="flex items-center justify-center rounded text-[9px] font-medium transition-all cursor-default select-none"
      style={{
        backgroundColor: bg,
        color: txt,
        width: "100%",
        height: 28,
        minWidth: 0,
      }}
      title={tooltip}
    >
      {label}
    </div>
  );
}

function HeatmapDiaMes({ dados, meses, modo, fmtBRL }) {
  const dias = Array.from({ length: 31 }, (_, i) => i + 1);

  const maxVal = useMemo(() => {
    let m = 0;
    meses.forEach((mk) => {
      dias.forEach((d) => {
        const v = getValorCelula(dados[mk]?.[d], modo);
        if (v > m) m = v;
      });
    });
    return m;
  }, [dados, meses, modo]);

  if (meses.length === 0) {
    return <p className="text-gray-400 text-xs text-center py-6">Nenhum mês selecionado.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: 700 }}>
        {/* Header dias */}
        <div className="flex items-center gap-0.5 mb-0.5">
          <div style={{ width: 68, flexShrink: 0 }} />
          {dias.map((d) => (
            <div key={d} className="flex-1 text-center text-[9px] text-gray-400 font-medium">
              {d}
            </div>
          ))}
        </div>

        {/* Linhas por mês */}
        {meses.map((mk) => (
          <div key={mk} className="flex items-center gap-0.5 mb-0.5">
            <div
              className="text-[10px] text-gray-500 font-medium text-right pr-1.5 flex-shrink-0"
              style={{ width: 68 }}
            >
              {getMesLabel(mk)}
            </div>
            {dias.map((d) => {
              const cell = dados[mk]?.[d];
              const val = getValorCelula(cell, modo);
              const tooltip =
                val === 0
                  ? `${getMesLabel(mk)} - Dia ${d}: sem vendas`
                  : modo === "quantidade"
                  ? `${getMesLabel(mk)} - Dia ${d}: ${val} venda${val !== 1 ? "s" : ""}`
                  : `${getMesLabel(mk)} - Dia ${d}: R$ ${fmtBRL(val)} (${cell?.count || 0} venda${(cell?.count || 0) !== 1 ? "s" : ""})`;
              return (
                <div key={d} className="flex-1" style={{ minWidth: 0 }}>
                  <HeatmapCell value={val} max={maxVal} tooltip={tooltip} modo={modo} fmtBRL={fmtBRL} />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function HeatmapDiaSemana({ dados, meses, modo, fmtBRL }) {
  const diasSemana = [0, 1, 2, 3, 4, 5, 6];

  const maxVal = useMemo(() => {
    let m = 0;
    meses.forEach((mk) => {
      diasSemana.forEach((ds) => {
        const v = getValorCelula(dados[mk]?.[ds], modo);
        if (v > m) m = v;
      });
    });
    return m;
  }, [dados, meses, modo]);

  if (meses.length === 0) {
    return <p className="text-gray-400 text-xs text-center py-6">Nenhum mês selecionado.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: 360 }}>
        {/* Header dias da semana */}
        <div className="flex items-center gap-1 mb-0.5">
          <div style={{ width: 68, flexShrink: 0 }} />
          {diasSemana.map((ds) => (
            <div key={ds} className="flex-1 text-center text-[10px] text-gray-400 font-medium">
              {DIAS_SEMANA[ds]}
            </div>
          ))}
        </div>

        {/* Linhas por mês */}
        {meses.map((mk) => (
          <div key={mk} className="flex items-center gap-1 mb-0.5">
            <div
              className="text-[10px] text-gray-500 font-medium text-right pr-1.5 flex-shrink-0"
              style={{ width: 68 }}
            >
              {getMesLabel(mk)}
            </div>
            {diasSemana.map((ds) => {
              const cell = dados[mk]?.[ds];
              const val = getValorCelula(cell, modo);
              const tooltip =
                val === 0
                  ? `${getMesLabel(mk)} - ${DIAS_SEMANA[ds]}: sem vendas`
                  : modo === "quantidade"
                  ? `${getMesLabel(mk)} - ${DIAS_SEMANA[ds]}: ${val} venda${val !== 1 ? "s" : ""}`
                  : `${getMesLabel(mk)} - ${DIAS_SEMANA[ds]}: R$ ${fmtBRL(val)} (${cell?.count || 0} venda${(cell?.count || 0) !== 1 ? "s" : ""})`;
              return (
                <div key={ds} className="flex-1" style={{ minWidth: 0 }}>
                  <HeatmapCell value={val} max={maxVal} tooltip={tooltip} modo={modo} fmtBRL={fmtBRL} />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ComprasPorDiaPage({ vendas = [], fmtBRL }) {
  const mesesDisponiveis = useMemo(() => buildMesesDisponiveis(vendas), [vendas]);

  const [mesesSelecionados, setMesesSelecionados] = useState(() => {
    const todos = buildMesesDisponiveis(vendas);
    return todos.slice(-6); // últimos 6 meses por padrão
  });

  const [modo, setModo] = useState("quantidade"); // "quantidade" | "valor"
  const [filtroAberto, setFiltroAberto] = useState(false);

  const dadosDiaMes = useMemo(
    () => buildDadosDiaMes(vendas, mesesSelecionados, modo),
    [vendas, mesesSelecionados, modo]
  );

  const dadosDiaSemana = useMemo(
    () => buildDadosDiaSemana(vendas, mesesSelecionados),
    [vendas, mesesSelecionados]
  );

  function toggleMes(mk) {
    setMesesSelecionados((prev) =>
      prev.includes(mk) ? prev.filter((m) => m !== mk) : [...prev, mk].sort()
    );
  }

  function selecionarTodos() {
    setMesesSelecionados([...mesesDisponiveis]);
  }

  function limparSelecao() {
    setMesesSelecionados([]);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
          <Icons.BarChart className="w-4 h-4 text-blue-500" />
          Compras por Dia
        </h2>

        {/* Controles */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Toggle quantidade / valor */}
          <div className="flex items-center border border-gray-200 rounded overflow-hidden text-xs">
            <button
              onClick={() => setModo("quantidade")}
              className={`px-3 py-1.5 transition-colors ${
                modo === "quantidade"
                  ? "bg-blue-600 text-white font-medium"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Quantidade
            </button>
            <button
              onClick={() => setModo("valor")}
              className={`px-3 py-1.5 transition-colors ${
                modo === "valor"
                  ? "bg-blue-600 text-white font-medium"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Valor (R$)
            </button>
          </div>

          {/* Filtro meses */}
          <div className="relative">
            <button
              onClick={() => setFiltroAberto((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-200 rounded bg-white text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Icons.Calendar className="w-3.5 h-3.5" />
              Meses ({mesesSelecionados.length}/{mesesDisponiveis.length})
            </button>

            {filtroAberto && (
              <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded shadow-lg p-3 min-w-[220px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-medium text-gray-600">Filtrar Meses</span>
                  <button
                    onClick={() => setFiltroAberto(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Icons.X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex gap-2 mb-2">
                  <button
                    onClick={selecionarTodos}
                    className="text-[10px] text-blue-600 hover:underline"
                  >
                    Todos
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={limparSelecao}
                    className="text-[10px] text-gray-500 hover:underline"
                  >
                    Limpar
                  </button>
                </div>

                <div className="max-h-52 overflow-y-auto space-y-1">
                  {mesesDisponiveis.length === 0 && (
                    <p className="text-[11px] text-gray-400">Nenhum dado disponível.</p>
                  )}
                  {[...mesesDisponiveis].reverse().map((mk) => (
                    <label
                      key={mk}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={mesesSelecionados.includes(mk)}
                        onChange={() => toggleMes(mk)}
                        className="w-3.5 h-3.5 accent-blue-600"
                      />
                      <span className="text-[11px] text-gray-600 group-hover:text-gray-800">
                        {getMesLabel(mk)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legenda de intensidade */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-gray-400">Menor</span>
        {[0.08, 0.25, 0.45, 0.65, 0.85, 1].map((v, i) => (
          <div
            key={i}
            className="w-5 h-4 rounded-sm"
            style={{ backgroundColor: corCelula(v) }}
          />
        ))}
        <span className="text-[10px] text-gray-400">Maior</span>
        <span className="text-[10px] text-gray-300 ml-2">
          ({modo === "quantidade" ? "nº de vendas" : "valor R$"})
        </span>
      </div>

      {/* Gráfico 1 — Por dia do mês */}
      <div className="bg-white border border-gray-200 rounded p-4">
        <h3 className="text-xs font-medium text-gray-500 mb-4 flex items-center gap-1.5">
          <Icons.BarChart className="w-3.5 h-3.5 text-blue-400" />
          Vendas por Dia do Mês
          <span className="text-gray-300 font-normal ml-1">— eixo X: dia 1 a 31 · eixo Y: mês/ano</span>
        </h3>
        <HeatmapDiaMes
          dados={dadosDiaMes}
          meses={mesesSelecionados}
          modo={modo}
          fmtBRL={fmtBRL}
        />
      </div>

      {/* Gráfico 2 — Por dia da semana */}
      <div className="bg-white border border-gray-200 rounded p-4">
        <h3 className="text-xs font-medium text-gray-500 mb-4 flex items-center gap-1.5">
          <Icons.TrendingUp className="w-3.5 h-3.5 text-blue-400" />
          Vendas por Dia da Semana
          <span className="text-gray-300 font-normal ml-1">— eixo X: Dom a Sáb · eixo Y: mês/ano</span>
        </h3>
        <HeatmapDiaSemana
          dados={dadosDiaSemana}
          meses={mesesSelecionados}
          modo={modo}
          fmtBRL={fmtBRL}
        />
      </div>
    </div>
  );
}
