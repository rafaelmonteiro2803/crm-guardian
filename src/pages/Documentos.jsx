import { useState, useRef, useCallback } from "react";
import { Icons } from "../components/Icons";

// Importa todos os templates HTML como raw strings via Vite glob
const templateModules = import.meta.glob("../templates/*.html", {
  query: "?raw",
  import: "default",
  eager: true,
});

// Monta lista de templates a partir dos módulos importados
const templates = Object.entries(templateModules).map(([path, content]) => {
  const filename = path.split("/").pop(); // ex: "contrato_servicos.html"
  const label = filename
    .replace(/\.html$/, "")
    .split(/[_-]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return { name: filename, label, content };
});

// Gera tabela HTML com os itens da venda
function buildItensHtml(itens) {
  if (!itens || itens.length === 0) return "-";
  const rows = itens
    .map((it) => {
      const subtotal = parseFloat(it.valor_unitario || 0) * parseFloat(it.quantidade || 1);
      return `<tr>
        <td style="padding:6px 10px;border:1px solid #ddd">${it.nome || "-"}</td>
        <td style="padding:6px 10px;text-align:center;border:1px solid #ddd">${it.quantidade}</td>
        <td style="padding:6px 10px;text-align:right;border:1px solid #ddd">R$ ${parseFloat(it.valor_unitario || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
        <td style="padding:6px 10px;text-align:right;border:1px solid #ddd">R$ ${subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
      </tr>`;
    })
    .join("");

  return `<table style="width:100%;border-collapse:collapse;font-size:13px;margin:8px 0">
    <thead>
      <tr style="background:#f5f5f5">
        <th style="padding:6px 10px;text-align:left;border:1px solid #ddd">Produto / Serviço</th>
        <th style="padding:6px 10px;text-align:center;border:1px solid #ddd">Qtd</th>
        <th style="padding:6px 10px;text-align:right;border:1px solid #ddd">Valor Unit.</th>
        <th style="padding:6px 10px;text-align:right;border:1px solid #ddd">Subtotal</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>`;
}

// Substitui todos os placeholders {{CAMPO}} pelo valor correspondente da venda/cliente
function preenchePlaceholders(html, venda, cliente, fmtBRL) {
  const fmtData = (d) =>
    d ? new Date(d + "T00:00:00").toLocaleDateString("pt-BR") : "";
  const fmtValor = (v) =>
    fmtBRL
      ? `R$ ${fmtBRL(v)}`
      : `R$ ${parseFloat(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

  const hoje = new Date().toLocaleDateString("pt-BR");

  const substituicoes = {
    // Datas
    "{{CONTRATO_DATA}}": fmtData(venda?.data_venda) || hoje,
    "{{VENDA_DATA}}": fmtData(venda?.data_venda) || hoje,
    "{{DATA_HOJE}}": hoje,

    // Cliente / Contratante
    "{{CONTRATANTE_NOME}}": cliente?.nome || "",
    "{{CONTRATANTE_CPF}}": cliente?.cpf || "",
    "{{CONTRATANTE_RG}}": "",
    "{{CONTRATANTE_EMAIL}}": cliente?.email || "",
    "{{CONTRATANTE_TELEFONE}}": cliente?.telefone || "",
    "{{CLIENTE_NOME}}": cliente?.nome || "",
    "{{CLIENTE_CPF}}": cliente?.cpf || "",
    "{{CLIENTE_EMAIL}}": cliente?.email || "",
    "{{CLIENTE_TELEFONE}}": cliente?.telefone || "",
    "{{CLIENTE_EMPRESA}}": cliente?.empresa || "",

    // Venda
    "{{VENDA_DESCRICAO}}": venda?.descricao || "",
    "{{VENDA_VALOR}}": fmtValor(venda?.valor),
    "{{VENDA_VALOR_DESCONTO}}": fmtValor(venda?.desconto || 0),
    "{{VENDA_FORMA_PAGAMENTO}}": venda?.forma_pagamento || "",
    "{{VENDA_OBSERVACOES}}": venda?.observacoes || "",

    // Itens/produtos da venda
    "{{ITENS_LISTA}}": buildItensHtml(venda?.itens),
  };

  let result = html;
  for (const [placeholder, value] of Object.entries(substituicoes)) {
    result = result.replaceAll(placeholder, value);
  }
  return result;
}

// Botão da barra de ferramentas
function ToolbarBtn({ onClick, title, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="px-2 py-1 rounded text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors select-none"
      type="button"
    >
      {children}
    </button>
  );
}

export function DocumentosPage({ vendas, clientes, fmtBRL }) {
  const [vendaId, setVendaId] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [docHtml, setDocHtml] = useState(null);
  const iframeRef = useRef(null);

  const venda = vendas.find((v) => v.id === vendaId) || null;
  const cliente = venda ? clientes.find((c) => c.id === venda.cliente_id) || null : null;

  const handleAbrir = () => {
    if (!vendaId || !templateName) {
      alert("Selecione uma venda e um documento.");
      return;
    }
    const tpl = templates.find((t) => t.name === templateName);
    if (!tpl) return;
    const html = preenchePlaceholders(tpl.content, venda, cliente, fmtBRL);
    setDocHtml(html);
  };

  // Executa comando de edição no iframe
  const execCmd = useCallback((cmd, value = null) => {
    const doc = iframeRef.current?.contentWindow?.document;
    if (!doc) return;
    doc.execCommand(cmd, false, value);
    iframeRef.current.contentWindow.focus();
  }, []);

  const handleSalvarPDF = useCallback(() => {
    iframeRef.current?.contentWindow?.print();
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">Documentos</h2>
      </div>

      {/* Filtros */}
      <div className="bg-white border border-gray-200 rounded p-3 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs text-gray-600 mb-0.5">Venda</label>
          <select
            value={vendaId}
            onChange={(e) => {
              setVendaId(e.target.value);
              setDocHtml(null);
            }}
            className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"
          >
            <option value="">Selecionar Venda...</option>
            {vendas.map((v) => {
              const cli = clientes.find((c) => c.id === v.cliente_id);
              const data = v.data_venda
                ? new Date(v.data_venda + "T00:00:00").toLocaleDateString("pt-BR")
                : "";
              return (
                <option key={v.id} value={v.id}>
                  {data} — {cli?.nome || "N/A"} — R$ {fmtBRL(v.valor)}
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs text-gray-600 mb-0.5">Selecionar Documento</label>
          <select
            value={templateName}
            onChange={(e) => {
              setTemplateName(e.target.value);
              setDocHtml(null);
            }}
            className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"
          >
            <option value="">Selecionar Documento...</option>
            {templates.map((t) => (
              <option key={t.name} value={t.name}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleAbrir}
          disabled={!vendaId || !templateName}
          className="inline-flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-white px-4 py-1.5 rounded text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Icons.FileText />
          Abrir
        </button>
      </div>

      {/* Estado vazio */}
      {!docHtml && (
        <div className="bg-white border border-gray-200 rounded p-10 text-center">
          <Icons.FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-xs text-gray-400">
            {!vendaId || !templateName
              ? "Selecione uma venda e um documento, depois clique em Abrir."
              : 'Clique em "Abrir" para carregar o documento preenchido.'}
          </p>
        </div>
      )}

      {/* Editor de documento */}
      {docHtml && (
        <div className="bg-white border border-gray-200 rounded overflow-hidden">
          {/* Barra de ferramentas */}
          <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-gray-200 bg-gray-50">
            {/* Formatação de texto */}
            <ToolbarBtn onClick={() => execCmd("bold")} title="Negrito (Ctrl+B)">
              <strong>N</strong>
            </ToolbarBtn>
            <ToolbarBtn onClick={() => execCmd("italic")} title="Itálico (Ctrl+I)">
              <em>I</em>
            </ToolbarBtn>
            <ToolbarBtn onClick={() => execCmd("underline")} title="Sublinhado (Ctrl+U)">
              <span style={{ textDecoration: "underline" }}>S</span>
            </ToolbarBtn>
            <ToolbarBtn onClick={() => execCmd("strikeThrough")} title="Tachado">
              <span style={{ textDecoration: "line-through" }}>T</span>
            </ToolbarBtn>

            <div className="h-4 w-px bg-gray-300 mx-1" />

            {/* Alinhamento */}
            <ToolbarBtn onClick={() => execCmd("justifyLeft")} title="Alinhar à esquerda">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h10M4 14h16M4 18h10" />
              </svg>
            </ToolbarBtn>
            <ToolbarBtn onClick={() => execCmd("justifyCenter")} title="Centralizar">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 10h10M4 14h16M7 18h10" />
              </svg>
            </ToolbarBtn>
            <ToolbarBtn onClick={() => execCmd("justifyRight")} title="Alinhar à direita">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 10h10M4 14h16M10 18h10" />
              </svg>
            </ToolbarBtn>
            <ToolbarBtn onClick={() => execCmd("justifyFull")} title="Justificar">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </ToolbarBtn>

            <div className="h-4 w-px bg-gray-300 mx-1" />

            {/* Listas */}
            <ToolbarBtn onClick={() => execCmd("insertOrderedList")} title="Lista numerada">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h10M7 16h10M3 8h.01M3 12h.01M3 16h.01" />
              </svg>
            </ToolbarBtn>
            <ToolbarBtn onClick={() => execCmd("insertUnorderedList")} title="Lista com marcadores">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
              </svg>
            </ToolbarBtn>

            <div className="h-4 w-px bg-gray-300 mx-1" />

            {/* Undo / Redo */}
            <ToolbarBtn onClick={() => execCmd("undo")} title="Desfazer (Ctrl+Z)">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </ToolbarBtn>
            <ToolbarBtn onClick={() => execCmd("redo")} title="Refazer (Ctrl+Y)">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
              </svg>
            </ToolbarBtn>

            <div className="h-4 w-px bg-gray-300 mx-1" />

            {/* Tamanho da fonte */}
            <select
              onChange={(e) => {
                execCmd("fontSize", e.target.value);
                e.target.value = "";
              }}
              defaultValue=""
              className="border border-gray-200 rounded px-1.5 py-1 text-xs focus:ring-1 focus:ring-gray-400 outline-none bg-white"
              title="Tamanho da fonte"
            >
              <option value="" disabled>
                Tamanho
              </option>
              <option value="1">Muito Pequeno</option>
              <option value="2">Pequeno</option>
              <option value="3">Normal</option>
              <option value="4">Grande</option>
              <option value="5">Maior</option>
              <option value="6">Enorme</option>
            </select>

            {/* Cor do texto */}
            <div className="flex items-center gap-1 ml-1">
              <label className="text-xs text-gray-500 whitespace-nowrap">Cor:</label>
              <input
                type="color"
                defaultValue="#000000"
                onChange={(e) => execCmd("foreColor", e.target.value)}
                className="w-7 h-7 rounded cursor-pointer border border-gray-200 p-0.5"
                title="Cor do texto"
              />
            </div>

            {/* Salvar PDF — à direita */}
            <div className="ml-auto">
              <button
                onClick={handleSalvarPDF}
                type="button"
                className="inline-flex items-center gap-1.5 bg-green-700 hover:bg-green-600 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors"
                title="Imprimir / Salvar como PDF"
              >
                <Icons.Printer />
                Salvar PDF
              </button>
            </div>
          </div>

          {/* iframe com o documento carregado */}
          <iframe
            ref={iframeRef}
            srcDoc={docHtml}
            title="Editor de Documento"
            className="w-full"
            style={{ height: "72vh", border: "none", display: "block" }}
          />
        </div>
      )}
    </div>
  );
}
