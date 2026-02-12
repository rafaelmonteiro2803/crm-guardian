import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Ícones SVG
const Icons = {
  User: ({ className = "w-5 h-5" }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),
  Plus: ({ className = "w-5 h-5" }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
      />
    </svg>
  ),
  Edit: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  ),
  Trash: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  ),
  Mail: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  ),
  Phone: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  ),
  Calendar: ({ className = "w-3 h-3" }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
  LogOut: ({ className = "w-5 h-5" }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </svg>
  ),
  BarChart: ({ className = "w-5 h-5" }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  ),
  TrendingUp: ({ className = "w-5 h-5" }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
    </svg>
  ),
  ShoppingCart: ({ className = "w-5 h-5" }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  ),
  CreditCard: ({ className = "w-5 h-5" }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
      />
    </svg>
  ),
  DollarSign: ({ className = "w-5 h-5" }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  CheckCircle: ({ className = "w-5 h-5" }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  XCircle: ({ className = "w-5 h-5" }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  Clock: ({ className = "w-5 h-5" }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  AlertCircle: ({ className = "w-5 h-5" }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
};

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clientes, setClientes] = useState([]);
  const [oportunidades, setOportunidades] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [titulos, setTitulos] = useState([]);
  const [viewMode, setViewMode] = useState("dashboard");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [authMessage, setAuthMessage] = useState("");

  const [modalCliente, setModalCliente] = useState(false);
  const [modalOportunidade, setModalOportunidade] = useState(false);
  const [modalVenda, setModalVenda] = useState(false);
  const [modalTitulo, setModalTitulo] = useState(false);

  const [editandoCliente, setEditandoCliente] = useState(null);
  const [editandoOportunidade, setEditandoOportunidade] = useState(null);
  const [editandoVenda, setEditandoVenda] = useState(null);
  const [editandoTitulo, setEditandoTitulo] = useState(null);

  const [produtos, setProdutos] = useState([]);
  const [modalProduto, setModalProduto] = useState(false);
  const [editandoProduto, setEditandoProduto] = useState(null);

  const [formCliente, setFormCliente] = useState({
    nome: "",
    email: "",
    telefone: "",
    empresa: "",
    observacoes: "",
  });
  const [formOportunidade, setFormOportunidade] = useState({
    titulo: "",
    cliente_id: "",
    produto_id: "",
    valor: "",
    estagio: "prospecção",
    data_inicio: new Date().toISOString().split("T")[0],
  });
  const [formVenda, setFormVenda] = useState({
    cliente_id: "",
    descricao: "",
    valor: "",
    data_venda: new Date().toISOString().split("T")[0],
    forma_pagamento: "à vista",
    observacoes: "",
    desconto: "",
    itens: [],
  });
  const [formTitulo, setFormTitulo] = useState({
    venda_id: "",
    descricao: "",
    valor: "",
    data_emissao: new Date().toISOString().split("T")[0],
    data_vencimento: "",
    status: "pendente",
  });
  const [formProduto, setFormProduto] = useState({
    nome: "",
    tipo: "produto",
    descricao: "",
    categoria: "",
    preco_base: "",
    custo: "",
    unidade_medida: "",
    ativo: true,
    observacoes: "",
  });

  const estagios = [
    "prospecção",
    "qualificação",
    "proposta",
    "negociação",
    "fechado",
    "cancelado",
  ];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) =>
      setSession(session),
    );
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) carregarTodosDados();
  }, [session]);

  const carregarTodosDados = async () => {
    await Promise.all([
      carregarClientes(),
      carregarOportunidades(),
      carregarVendas(),
      carregarTitulos(),
      carregarProdutos(),
    ]);
  };

  const carregarClientes = async () => {
    const { data } = await supabase
      .from("clientes")
      .select("*")
      .order("data_cadastro", { ascending: false });
    if (data) setClientes(data);
  };

  const carregarOportunidades = async () => {
    const { data } = await supabase
      .from("oportunidades")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setOportunidades(data);
  };

  const carregarVendas = async () => {
    const { data } = await supabase
      .from("vendas")
      .select("*")
      .order("data_venda", { ascending: false });
    if (data) setVendas(data);
  };

  const carregarTitulos = async () => {
    const { data } = await supabase
      .from("titulos")
      .select("*")
      .order("data_vencimento", { ascending: true });
    if (data) setTitulos(data);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setAuthMessage("");
    const { error } = await supabase.auth.signUp({ email, password });
    setAuthMessage(
      error ? "Erro: " + error.message : "Conta criada! Verifique seu email.",
    );
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setAuthMessage("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setAuthMessage("Erro: " + error.message);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setClientes([]);
    setOportunidades([]);
    setVendas([]);
    setTitulos([]);
    setProdutos([]);
  };

  // CRUD Clientes
  const salvarCliente = async () => {
    if (!formCliente.nome.trim()) return alert("Nome é obrigatório!");
    if (editandoCliente) {
      const { data } = await supabase
        .from("clientes")
        .update(formCliente)
        .eq("id", editandoCliente.id)
        .select();
      if (data)
        setClientes(
          clientes.map((c) => (c.id === editandoCliente.id ? data[0] : c)),
        );
    } else {
      const { data } = await supabase
        .from("clientes")
        .insert([{ ...formCliente, user_id: session.user.id }])
        .select();
      if (data) setClientes([data[0], ...clientes]);
    }
    fecharModalCliente();
  };

  const excluirCliente = async (id) => {
    if (!confirm("Excluir cliente?")) return;
    await supabase.from("clientes").delete().eq("id", id);
    setClientes(clientes.filter((c) => c.id !== id));
  };

  // CRUD Oportunidades
  const salvarOportunidade = async () => {
    if (!formOportunidade.titulo.trim()) return alert("Título é obrigatório!");
    const payload = {
      ...formOportunidade,
      produto_id: formOportunidade.produto_id || null,
    };
    if (editandoOportunidade) {
      const { data } = await supabase
        .from("oportunidades")
        .update(payload)
        .eq("id", editandoOportunidade.id)
        .select();
      if (data)
        setOportunidades(
          oportunidades.map((o) =>
            o.id === editandoOportunidade.id ? data[0] : o,
          ),
        );
    } else {
      const { data } = await supabase
        .from("oportunidades")
        .insert([{ ...payload, user_id: session.user.id }])
        .select();
      if (data) setOportunidades([data[0], ...oportunidades]);
    }
    fecharModalOportunidade();
  };

  const excluirOportunidade = async (id) => {
    if (!confirm("Excluir oportunidade?")) return;
    await supabase.from("oportunidades").delete().eq("id", id);
    setOportunidades(oportunidades.filter((o) => o.id !== id));
  };

  const moverOportunidade = async (id, estagio) => {
    const { data } = await supabase
      .from("oportunidades")
      .update({ estagio })
      .eq("id", id)
      .select();
    if (data)
      setOportunidades(oportunidades.map((o) => (o.id === id ? data[0] : o)));
  };

  // CRUD Vendas
  const calcularTotalVenda = (itens, desconto) => {
    const subtotal = itens.reduce(
      (s, item) => s + parseFloat(item.valor_unitario || 0) * parseFloat(item.quantidade || 1),
      0,
    );
    const desc = parseFloat(desconto || 0);
    return Math.max(subtotal - desc, 0);
  };

  const salvarVenda = async () => {
    if (!formVenda.descricao.trim()) return alert("Descrição é obrigatória!");
    const valorTotal = formVenda.itens.length > 0
      ? calcularTotalVenda(formVenda.itens, formVenda.desconto)
      : parseFloat(formVenda.valor || 0);
    const payload = {
      cliente_id: formVenda.cliente_id,
      descricao: formVenda.descricao,
      valor: valorTotal,
      data_venda: formVenda.data_venda,
      forma_pagamento: formVenda.forma_pagamento,
      observacoes: formVenda.observacoes,
      desconto: formVenda.desconto === "" ? 0 : parseFloat(formVenda.desconto),
      itens: formVenda.itens,
    };
    if (editandoVenda) {
      const { data } = await supabase
        .from("vendas")
        .update(payload)
        .eq("id", editandoVenda.id)
        .select();
      if (data)
        setVendas(vendas.map((v) => (v.id === editandoVenda.id ? data[0] : v)));
    } else {
      const { data } = await supabase
        .from("vendas")
        .insert([{ ...payload, user_id: session.user.id }])
        .select();
      if (data) {
        setVendas([data[0], ...vendas]);
        // Gerar título pendente vinculado à venda
        const novoTitulo = {
          venda_id: data[0].id,
          descricao: data[0].descricao,
          valor: data[0].valor,
          data_emissao: new Date().toISOString().split("T")[0],
          data_vencimento: data[0].data_venda || new Date().toISOString().split("T")[0],
          status: "pendente",
          user_id: session.user.id,
        };
        const { data: tituloData } = await supabase
          .from("titulos")
          .insert([novoTitulo])
          .select();
        if (tituloData) setTitulos([...titulos, tituloData[0]]);
      }
    }
    fecharModalVenda();
  };

  const excluirVenda = async (id) => {
    if (!confirm("Excluir venda?")) return;
    await supabase.from("vendas").delete().eq("id", id);
    setVendas(vendas.filter((v) => v.id !== id));
  };

  // CRUD Títulos
  const salvarTitulo = async () => {
    if (!formTitulo.descricao.trim()) return alert("Descrição é obrigatória!");
    const dadosTitulo = {
      ...formTitulo,
      user_id: session.user.id,
      data_pagamento:
        formTitulo.status === "pago"
          ? new Date().toISOString().split("T")[0]
          : null,
    };
    let novosTitulos = [...titulos];
    if (editandoTitulo) {
      const { data } = await supabase
        .from("titulos")
        .update(dadosTitulo)
        .eq("id", editandoTitulo.id)
        .select();
      if (data)
        novosTitulos = novosTitulos.map((t) =>
          t.id === editandoTitulo.id ? data[0] : t,
        );
    } else {
      const { data } = await supabase
        .from("titulos")
        .insert([dadosTitulo])
        .select();
      if (data) novosTitulos = [...novosTitulos, data[0]];
    }

    // Se título pago e vinculado a uma venda, verificar saldo
    if (formTitulo.status === "pago" && formTitulo.venda_id) {
      const vendaRelacionada = vendas.find(
        (v) => v.id === formTitulo.venda_id,
      );
      if (vendaRelacionada) {
        const totalPago = novosTitulos
          .filter(
            (t) =>
              t.venda_id === vendaRelacionada.id && t.status === "pago",
          )
          .reduce((acc, t) => acc + Number(t.valor), 0);
        const saldo = Number(vendaRelacionada.valor) - totalPago;
        if (saldo > 0.01) {
          const tituloSaldo = {
            venda_id: vendaRelacionada.id,
            descricao: `${vendaRelacionada.descricao} (saldo)`,
            valor: saldo.toFixed(2),
            data_emissao: new Date().toISOString().split("T")[0],
            data_vencimento:
              formTitulo.data_vencimento ||
              new Date().toISOString().split("T")[0],
            status: "pendente",
            user_id: session.user.id,
          };
          const { data: saldoData } = await supabase
            .from("titulos")
            .insert([tituloSaldo])
            .select();
          if (saldoData) novosTitulos = [...novosTitulos, saldoData[0]];
        }
      }
    }

    setTitulos(novosTitulos);
    fecharModalTitulo();
  };

  const excluirTitulo = async (id) => {
    if (!confirm("Excluir título?")) return;
    await supabase.from("titulos").delete().eq("id", id);
    setTitulos(titulos.filter((t) => t.id !== id));
  };

  const marcarComoPago = async (id) => {
    const { data } = await supabase
      .from("titulos")
      .update({
        status: "pago",
        data_pagamento: new Date().toISOString().split("T")[0],
      })
      .eq("id", id)
      .select();
    if (data) {
      let novosTitulos = titulos.map((t) => (t.id === id ? data[0] : t));
      const tituloPago = data[0];
      // Se vinculado a uma venda, verificar saldo e gerar título pendente
      if (tituloPago.venda_id) {
        const vendaRelacionada = vendas.find(
          (v) => v.id === tituloPago.venda_id,
        );
        if (vendaRelacionada) {
          const totalPago = novosTitulos
            .filter(
              (t) =>
                t.venda_id === vendaRelacionada.id && t.status === "pago",
            )
            .reduce((acc, t) => acc + Number(t.valor), 0);
          const saldo = Number(vendaRelacionada.valor) - totalPago;
          if (saldo > 0.01) {
            const tituloSaldo = {
              venda_id: vendaRelacionada.id,
              descricao: `${vendaRelacionada.descricao} (saldo)`,
              valor: saldo.toFixed(2),
              data_emissao: new Date().toISOString().split("T")[0],
              data_vencimento:
                tituloPago.data_vencimento ||
                new Date().toISOString().split("T")[0],
              status: "pendente",
              user_id: session.user.id,
            };
            const { data: saldoData } = await supabase
              .from("titulos")
              .insert([tituloSaldo])
              .select();
            if (saldoData) novosTitulos = [...novosTitulos, saldoData[0]];
          }
        }
      }
      setTitulos(novosTitulos);
    }
  };

  // CRUD Produtos
  const carregarProdutos = async () => {
    const { data } = await supabase
      .from("produtos")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setProdutos(data);
  };

  const salvarProduto = async () => {
    if (!formProduto.nome.trim()) return alert("Nome é obrigatório!");

    // normaliza números (evita "" virar erro)
    const payload = {
      ...formProduto,
      preco_base:
        formProduto.preco_base === "" ? 0 : parseFloat(formProduto.preco_base),
      custo: formProduto.custo === "" ? 0 : parseFloat(formProduto.custo),
      user_id: session.user.id,
    };

    if (editandoProduto) {
      const { data } = await supabase
        .from("produtos")
        .update(payload)
        .eq("id", editandoProduto.id)
        .select();

      if (data)
        setProdutos(
          produtos.map((p) => (p.id === editandoProduto.id ? data[0] : p)),
        );
    } else {
      const { data } = await supabase
        .from("produtos")
        .insert([payload])
        .select();

      if (data) setProdutos([data[0], ...produtos]);
    }

    fecharModalProduto();
  };

  const excluirProduto = async (id) => {
    if (!confirm("Excluir produto?")) return;
    await supabase.from("produtos").delete().eq("id", id);
    setProdutos(produtos.filter((p) => p.id !== id));
  };

  // Modais
  const abrirModalCliente = (cliente = null) => {
    if (cliente) {
      setEditandoCliente(cliente);
      setFormCliente({
        nome: cliente.nome,
        email: cliente.email || "",
        telefone: cliente.telefone || "",
        empresa: cliente.empresa || "",
        observacoes: cliente.observacoes || "",
      });
    }
    setModalCliente(true);
  };

  const fecharModalCliente = () => {
    setModalCliente(false);
    setEditandoCliente(null);
    setFormCliente({
      nome: "",
      email: "",
      telefone: "",
      empresa: "",
      observacoes: "",
    });
  };

  const abrirModalOportunidade = (oportunidade = null) => {
    if (oportunidade) {
      setEditandoOportunidade(oportunidade);
      setFormOportunidade({
        titulo: oportunidade.titulo,
        cliente_id: oportunidade.cliente_id,
        produto_id: oportunidade.produto_id || "",
        valor: oportunidade.valor.toString(),
        estagio: oportunidade.estagio,
        data_inicio: oportunidade.data_inicio,
      });
    }
    setModalOportunidade(true);
  };

  const fecharModalOportunidade = () => {
    setModalOportunidade(false);
    setEditandoOportunidade(null);
    setFormOportunidade({
      titulo: "",
      cliente_id: "",
      produto_id: "",
      valor: "",
      estagio: "prospecção",
      data_inicio: new Date().toISOString().split("T")[0],
    });
  };

  const abrirModalVenda = (venda = null) => {
    if (venda) {
      setEditandoVenda(venda);
      setFormVenda({
        cliente_id: venda.cliente_id,
        descricao: venda.descricao,
        valor: venda.valor.toString(),
        data_venda: venda.data_venda,
        forma_pagamento: venda.forma_pagamento,
        observacoes: venda.observacoes || "",
        desconto: (venda.desconto ?? 0).toString(),
        itens: venda.itens || [],
      });
    }
    setModalVenda(true);
  };

  const fecharModalVenda = () => {
    setModalVenda(false);
    setEditandoVenda(null);
    setFormVenda({
      cliente_id: "",
      descricao: "",
      valor: "",
      data_venda: new Date().toISOString().split("T")[0],
      forma_pagamento: "à vista",
      observacoes: "",
      desconto: "",
      itens: [],
    });
  };

  const abrirModalTitulo = (titulo = null) => {
    if (titulo) {
      setEditandoTitulo(titulo);
      setFormTitulo({
        venda_id: titulo.venda_id || "",
        descricao: titulo.descricao,
        valor: titulo.valor.toString(),
        data_emissao: titulo.data_emissao,
        data_vencimento: titulo.data_vencimento,
        status: titulo.status,
      });
    }
    setModalTitulo(true);
  };

  const fecharModalTitulo = () => {
    setModalTitulo(false);
    setEditandoTitulo(null);
    setFormTitulo({
      venda_id: "",
      descricao: "",
      valor: "",
      data_emissao: new Date().toISOString().split("T")[0],
      data_vencimento: "",
      status: "pendente",
    });
  };

  const abrirModalProduto = (produto = null) => {
    if (produto) {
      setEditandoProduto(produto);
      setFormProduto({
        nome: produto.nome || "",
        tipo: produto.tipo || "produto",
        descricao: produto.descricao || "",
        categoria: produto.categoria || "",
        preco_base: (produto.preco_base ?? 0).toString(),
        custo: (produto.custo ?? 0).toString(),
        unidade_medida: produto.unidade_medida || "",
        ativo: produto.ativo ?? true,
        observacoes: produto.observacoes || "",
      });
    }
    setModalProduto(true);
  };

  const fecharModalProduto = () => {
    setModalProduto(false);
    setEditandoProduto(null);
    setFormProduto({
      nome: "",
      tipo: "produto",
      descricao: "",
      categoria: "",
      preco_base: "",
      custo: "",
      unidade_medida: "",
      ativo: true,
      observacoes: "",
    });
  };

  const getClienteNome = (id) =>
    clientes.find((c) => c.id === id)?.nome || "N/A";

  const getProdutoNome = (id) =>
    produtos.find((p) => p.id === id)?.nome || null;

  // Indicadores Dashboard
  const calcularIndicadores = () => {
    const totalOportunidades = oportunidades.reduce(
      (s, o) => s + parseFloat(o.valor || 0),
      0,
    );
    const fechadas = oportunidades.filter((o) => o.estagio === "fechado");
    const taxaConversao =
      oportunidades.length > 0
        ? ((fechadas.length / oportunidades.length) * 100).toFixed(1)
        : 0;

    const totalVendas = vendas.reduce(
      (s, v) => s + parseFloat(v.valor || 0),
      0,
    );
    const vendasMes = vendas.filter((v) => {
      const d = new Date(v.data_venda);
      const h = new Date();
      return (
        d.getMonth() === h.getMonth() && d.getFullYear() === h.getFullYear()
      );
    });
    const totalVendasMes = vendasMes.reduce(
      (s, v) => s + parseFloat(v.valor || 0),
      0,
    );

    const pendentes = titulos.filter((t) => t.status === "pendente");
    const pagos = titulos.filter((t) => t.status === "pago");
    const vencidos = pendentes.filter(
      (t) => new Date(t.data_vencimento) < new Date(),
    );

    return {
      totalOportunidades,
      numOportunidades: oportunidades.length,
      taxaConversao,
      totalVendas,
      numVendas: vendas.length,
      totalVendasMes,
      numVendasMes: vendasMes.length,
      totalReceber: pendentes.reduce((s, t) => s + parseFloat(t.valor || 0), 0),
      totalRecebido: pagos.reduce((s, t) => s + parseFloat(t.valor || 0), 0),
      totalVencido: vencidos.reduce((s, t) => s + parseFloat(t.valor || 0), 0),
      numPendentes: pendentes.length,
      numPagos: pagos.length,
      numVencidos: vencidos.length,
    };
  };

  const calcularVendasPorMes = () => {
    const meses = {};
    const nomesMeses = [
      "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
      "Jul", "Ago", "Set", "Out", "Nov", "Dez",
    ];
    vendas.forEach((v) => {
      const d = new Date(v.data_venda);
      const chave = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = `${nomesMeses[d.getMonth()]}/${d.getFullYear()}`;
      if (!meses[chave]) meses[chave] = { label, total: 0, count: 0 };
      meses[chave].total += parseFloat(v.valor || 0);
      meses[chave].count += 1;
    });
    return Object.entries(meses)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([, v]) => v);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-blue-600">Carregando...</div>
      </div>
    );

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            CRM GuardIAn
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Sistema Inteligente de Gestão
          </p>
          <form
            onSubmit={isSignUp ? handleSignUp : handleSignIn}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            {authMessage && (
              <div
                className={`p-3 rounded-lg text-sm ${authMessage.includes("Erro") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}
              >
                {authMessage}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium"
            >
              {isSignUp ? "Criar Conta" : "Entrar"}
            </button>
          </form>
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setAuthMessage("");
            }}
            className="w-full mt-4 text-blue-600 text-sm"
          >
            {isSignUp ? "Já tem conta? Faça login" : "Não tem conta? Criar uma"}
          </button>
        </div>
      </div>
    );
  }

  const indicadores = calcularIndicadores();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">CRM GuardIAn</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm opacity-90">{session.user.email}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg"
              >
                <Icons.LogOut />
                Sair
              </button>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              "dashboard",
              "clientes",
              "produtos",
              "pipeline",
              "vendas",
              "financeiro",
            ].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 rounded-lg font-medium ${viewMode === mode ? "bg-white text-blue-600" : "bg-blue-500 hover:bg-blue-400"}`}
              >
                {mode === "dashboard" && (
                  <Icons.BarChart className="inline mr-2" />
                )}
                {mode === "clientes" && <Icons.User className="inline mr-2" />}
                {mode === "produtos" && (
                  <Icons.ShoppingCart className="inline mr-2" />
                )}
                {mode === "pipeline" && (
                  <Icons.TrendingUp className="inline mr-2" />
                )}
                {mode === "vendas" && (
                  <Icons.ShoppingCart className="inline mr-2" />
                )}
                {mode === "financeiro" && (
                  <Icons.CreditCard className="inline mr-2" />
                )}
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
                {mode === "clientes" && ` (${clientes.length})`}
                {mode === "produtos" && ` (${produtos.length})`}
                {mode === "pipeline" && ` (${oportunidades.length})`}
                {mode === "vendas" && ` (${vendas.length})`}
                {mode === "financeiro" && ` (${titulos.length})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 max-w-7xl">
        {/* DASHBOARD */}
        {viewMode === "dashboard" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Visão Geral</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 text-sm font-medium">
                    Clientes
                  </h3>
                  <Icons.User className="w-8 h-8 text-blue-500" />
                </div>
                <p className="text-3xl font-bold">{clientes.length}</p>
                <p className="text-sm text-gray-500 mt-1">Total cadastrados</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 text-sm font-medium">
                    Oportunidades
                  </h3>
                  <Icons.TrendingUp className="w-8 h-8 text-purple-500" />
                </div>
                <p className="text-3xl font-bold">
                  R${" "}
                  {indicadores.totalOportunidades.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {indicadores.numOportunidades} ativas •{" "}
                  {indicadores.taxaConversao}% conversão
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 text-sm font-medium">Vendas</h3>
                  <Icons.ShoppingCart className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-3xl font-bold">
                  R${" "}
                  {indicadores.totalVendas.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {indicadores.numVendas} vendas • R${" "}
                  {indicadores.totalVendasMes.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}{" "}
                  este mês
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 text-sm font-medium">
                    Financeiro
                  </h3>
                  <Icons.CreditCard className="w-8 h-8 text-yellow-500" />
                </div>
                <p className="text-3xl font-bold">
                  R${" "}
                  {indicadores.totalReceber.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  A receber • {indicadores.numPendentes} títulos pendentes
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-green-700 font-semibold">Recebido</h3>
                  <Icons.CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-700">
                  R${" "}
                  {indicadores.totalRecebido.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  {indicadores.numPagos} títulos pagos
                </p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-yellow-700 font-semibold">A Receber</h3>
                  <Icons.Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-yellow-700">
                  R${" "}
                  {indicadores.totalReceber.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className="text-sm text-yellow-600 mt-1">
                  {indicadores.numPendentes} títulos pendentes
                </p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-red-700 font-semibold">Vencidos</h3>
                  <Icons.AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <p className="text-2xl font-bold text-red-700">
                  R${" "}
                  {indicadores.totalVencido.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className="text-sm text-red-600 mt-1">
                  {indicadores.numVencidos} títulos vencidos
                </p>
              </div>
            </div>

            {/* Gráfico de Vendas por Mês */}
            <div className="bg-white rounded-lg shadow p-6 mt-8">
              <div className="flex items-center mb-4">
                <Icons.BarChart className="w-6 h-6 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Vendas Consolidadas por Mês
                </h3>
              </div>
              {(() => {
                const dadosMensais = calcularVendasPorMes();
                if (dadosMensais.length === 0) {
                  return (
                    <p className="text-gray-500 text-center py-8">
                      Nenhuma venda registrada ainda.
                    </p>
                  );
                }
                const maxValor = Math.max(...dadosMensais.map((d) => d.total));
                return (
                  <div>
                    <div className="flex items-end gap-2" style={{ height: "260px" }}>
                      {dadosMensais.map((mes, i) => {
                        const altura = maxValor > 0 ? (mes.total / maxValor) * 100 : 0;
                        return (
                          <div
                            key={i}
                            className="flex-1 flex flex-col items-center justify-end h-full"
                          >
                            <span className="text-xs font-semibold text-gray-700 mb-1">
                              R${" "}
                              {mes.total.toLocaleString("pt-BR", {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              })}
                            </span>
                            <div
                              className="w-full bg-green-500 rounded-t-md hover:bg-green-600 transition-colors"
                              style={{
                                height: `${Math.max(altura, 2)}%`,
                                minHeight: "4px",
                              }}
                              title={`${mes.label}: R$ ${mes.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} (${mes.count} venda${mes.count !== 1 ? "s" : ""})`}
                            />
                            <span className="text-xs text-gray-500 mt-2 whitespace-nowrap">
                              {mes.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-4 text-sm text-gray-500 text-center">
                      Últimos {dadosMensais.length} meses com vendas registradas
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* CLIENTES */}
        {viewMode === "clientes" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Meus Clientes</h2>
              <button
                onClick={() => abrirModalCliente()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Icons.Plus />
                Novo Cliente
              </button>
            </div>
            {clientes.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <Icons.User className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Nenhum cliente cadastrado.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clientes.map((cliente) => (
                  <div
                    key={cliente.id}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition p-5"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold">{cliente.nome}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => abrirModalCliente(cliente)}
                          className="text-blue-600 hover:bg-blue-50 p-2 rounded"
                        >
                          <Icons.Edit />
                        </button>
                        <button
                          onClick={() => excluirCliente(cliente.id)}
                          className="text-red-600 hover:bg-red-50 p-2 rounded"
                        >
                          <Icons.Trash />
                        </button>
                      </div>
                    </div>
                    {cliente.empresa && (
                      <p className="text-gray-600 font-medium mb-2">
                        {cliente.empresa}
                      </p>
                    )}
                    <div className="space-y-2 text-sm">
                      {cliente.email && (
                        <div className="flex items-center text-gray-600">
                          <Icons.Mail className="mr-2 text-gray-400" />
                          {cliente.email}
                        </div>
                      )}
                      {cliente.telefone && (
                        <div className="flex items-center text-gray-600">
                          <Icons.Phone className="mr-2 text-gray-400" />
                          {cliente.telefone}
                        </div>
                      )}
                      {cliente.observacoes && (
                        <p className="text-gray-500 mt-3 pt-3 border-t">
                          {cliente.observacoes}
                        </p>
                      )}
                    </div>
                    <div className="mt-4 pt-3 border-t text-xs text-gray-400">
                      <Icons.Calendar className="inline mr-1" />
                      Cadastrado em{" "}
                      {new Date(cliente.data_cadastro).toLocaleDateString(
                        "pt-BR",
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PRODUTOS */}
        {viewMode === "produtos" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Produtos / Serviços</h2>
              <button
                onClick={() => abrirModalProduto()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Icons.Plus />
                Novo Produto
              </button>
            </div>

            {produtos.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <Icons.ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Nenhum produto cadastrado.</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      {[
                        "Nome",
                        "Tipo",
                        "Categoria",
                        "Preço",
                        "Custo",
                        "Ativo",
                        "Ações",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {produtos.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium">
                          {p.nome}
                        </td>
                        <td className="px-6 py-4 text-sm capitalize">
                          {p.tipo}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {p.categoria || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-green-600">
                          R${" "}
                          {parseFloat(p.preco_base || 0).toLocaleString(
                            "pt-BR",
                            { minimumFractionDigits: 2 },
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          R${" "}
                          {parseFloat(p.custo || 0).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {p.ativo ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              Ativo
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-200 text-gray-700">
                              Inativo
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => abrirModalProduto(p)}
                            className="text-blue-600 hover:bg-blue-50 p-2 rounded mr-2"
                          >
                            <Icons.Edit />
                          </button>
                          <button
                            onClick={() => excluirProduto(p.id)}
                            className="text-red-600 hover:bg-red-50 p-2 rounded"
                          >
                            <Icons.Trash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* PIPELINE */}
        {viewMode === "pipeline" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Pipeline de Vendas</h2>
              <button
                onClick={() => abrirModalOportunidade()}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                disabled={clientes.length === 0}
              >
                <Icons.Plus />
                Nova Oportunidade
              </button>
            </div>
            {clientes.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <Icons.User className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Cadastre clientes primeiro.</p>
              </div>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-4">
                {estagios.map((estagio) => {
                  const ops = oportunidades.filter(
                    (o) => o.estagio === estagio,
                  );
                  const total = ops.reduce(
                    (s, o) => s + parseFloat(o.valor || 0),
                    0,
                  );
                  return (
                    <div key={estagio} className="flex-shrink-0 w-80">
                      <div className={`rounded-lg p-4 mb-3 ${estagio === "cancelado" ? "bg-red-100" : "bg-gray-100"}`}>
                        <h3 className={`font-bold capitalize ${estagio === "cancelado" ? "text-red-700" : ""}`}>{estagio}</h3>
                        <p className="text-sm text-gray-600">
                          {ops.length} • R${" "}
                          {total.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                      <div className="space-y-3">
                        {ops.map((op) => (
                          <div
                            key={op.id}
                            className="bg-white rounded-lg shadow p-4"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold">{op.titulo}</h4>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => abrirModalOportunidade(op)}
                                  className="text-blue-600 p-1 hover:bg-blue-50 rounded"
                                >
                                  <Icons.Edit className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => excluirOportunidade(op.id)}
                                  className="text-red-600 p-1 hover:bg-red-50 rounded"
                                >
                                  <Icons.Trash className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              <Icons.User className="w-3 h-3 inline mr-1" />
                              {getClienteNome(op.cliente_id)}
                            </p>
                            {getProdutoNome(op.produto_id) && (
                              <p className="text-sm text-purple-600 mb-2">
                                <Icons.ShoppingCart className="w-3 h-3 inline mr-1" />
                                {getProdutoNome(op.produto_id)}
                              </p>
                            )}
                            <p className="text-lg font-bold text-green-600 mb-3">
                              R${" "}
                              {parseFloat(op.valor || 0).toLocaleString(
                                "pt-BR",
                                { minimumFractionDigits: 2 },
                              )}
                            </p>
                            <div className="flex gap-1">
                              {estagios.map((est, idx) => {
                                const atual = estagios.indexOf(op.estagio);
                                const avancar = idx === atual + 1;
                                const voltar = idx === atual - 1;
                                if (!avancar && !voltar) return null;
                                return (
                                  <button
                                    key={est}
                                    onClick={() =>
                                      moverOportunidade(op.id, est)
                                    }
                                    className={`flex-1 px-2 py-1 text-xs rounded ${avancar ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}
                                  >
                                    {avancar ? "→ Avançar" : "← Voltar"}
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
          </div>
        )}

        {/* VENDAS */}
        {viewMode === "vendas" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Vendas Realizadas</h2>
              <button
                onClick={() => abrirModalVenda()}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                disabled={clientes.length === 0}
              >
                <Icons.Plus />
                Nova Venda
              </button>
            </div>
            {vendas.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <Icons.ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Nenhuma venda registrada.</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      {[
                        "Data",
                        "Cliente",
                        "Descrição",
                        "Produtos",
                        "Desconto",
                        "Forma Pgto",
                        "Valor",
                        "Ações",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {vendas.map((v) => (
                      <tr key={v.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm">
                          {new Date(v.data_venda).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          {getClienteNome(v.cliente_id)}
                        </td>
                        <td className="px-6 py-4 text-sm">{v.descricao}</td>
                        <td className="px-6 py-4 text-sm">
                          {v.itens && v.itens.length > 0 ? (
                            <div className="space-y-1">
                              {v.itens.map((item, idx) => (
                                <div key={idx} className="text-xs">
                                  <span className="font-medium">{item.nome}</span>
                                  <span className="text-gray-500"> x{item.quantidade}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {parseFloat(v.desconto || 0) > 0 ? (
                            <span className="text-red-600">
                              - R${" "}
                              {parseFloat(v.desconto).toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm capitalize">
                          {v.forma_pagamento}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-green-600">
                          R${" "}
                          {parseFloat(v.valor || 0).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => abrirModalVenda(v)}
                            className="text-blue-600 hover:bg-blue-50 p-2 rounded mr-2"
                          >
                            <Icons.Edit />
                          </button>
                          <button
                            onClick={() => excluirVenda(v.id)}
                            className="text-red-600 hover:bg-red-50 p-2 rounded"
                          >
                            <Icons.Trash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* FINANCEIRO */}
        {viewMode === "financeiro" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Gestão Financeira</h2>
              <button
                onClick={() => abrirModalTitulo()}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Icons.Plus />
                Novo Título
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-green-700 font-semibold mb-2">Pagos</h3>
                <p className="text-2xl font-bold text-green-700">
                  R${" "}
                  {indicadores.totalRecebido.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className="text-sm text-green-600">
                  {indicadores.numPagos} títulos
                </p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-yellow-700 font-semibold mb-2">
                  Pendentes
                </h3>
                <p className="text-2xl font-bold text-yellow-700">
                  R${" "}
                  {indicadores.totalReceber.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className="text-sm text-yellow-600">
                  {indicadores.numPendentes} títulos
                </p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-red-700 font-semibold mb-2">Vencidos</h3>
                <p className="text-2xl font-bold text-red-700">
                  R${" "}
                  {indicadores.totalVencido.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className="text-sm text-red-600">
                  {indicadores.numVencidos} títulos
                </p>
              </div>
            </div>
            {titulos.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <Icons.CreditCard className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Nenhum título cadastrado.</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      {[
                        "Descrição",
                        "Emissão",
                        "Vencimento",
                        "Valor",
                        "Status",
                        "Ações",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {titulos.map((t) => {
                      const vencido =
                        t.status === "pendente" &&
                        new Date(t.data_vencimento) < new Date();
                      return (
                        <tr
                          key={t.id}
                          className={`hover:bg-gray-50 ${vencido ? "bg-red-50" : ""}`}
                        >
                          <td className="px-6 py-4 text-sm">{t.descricao}</td>
                          <td className="px-6 py-4 text-sm">
                            {new Date(t.data_emissao).toLocaleDateString(
                              "pt-BR",
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {new Date(t.data_vencimento).toLocaleDateString(
                              "pt-BR",
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold">
                            R${" "}
                            {parseFloat(t.valor || 0).toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {t.status === "pago" ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                <Icons.CheckCircle className="w-3 h-3 mr-1" />
                                Pago
                              </span>
                            ) : vencido ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                                <Icons.XCircle className="w-3 h-3 mr-1" />
                                Vencido
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                                <Icons.Clock className="w-3 h-3 mr-1" />
                                Pendente
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {t.status === "pendente" && (
                              <button
                                onClick={() => marcarComoPago(t.id)}
                                className="text-green-600 hover:bg-green-50 px-3 py-1 rounded mr-2 text-xs"
                              >
                                Pagar
                              </button>
                            )}
                            <button
                              onClick={() => abrirModalTitulo(t)}
                              className="text-blue-600 hover:bg-blue-50 p-2 rounded mr-2"
                            >
                              <Icons.Edit />
                            </button>
                            <button
                              onClick={() => excluirTitulo(t.id)}
                              className="text-red-600 hover:bg-red-50 p-2 rounded"
                            >
                              <Icons.Trash />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAIS */}
      {modalCliente && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editandoCliente ? "Editar Cliente" : "Novo Cliente"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome *</label>
                <input
                  type="text"
                  value={formCliente.nome}
                  onChange={(e) =>
                    setFormCliente({ ...formCliente, nome: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formCliente.email}
                  onChange={(e) =>
                    setFormCliente({ ...formCliente, email: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={formCliente.telefone}
                  onChange={(e) =>
                    setFormCliente({ ...formCliente, telefone: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Empresa
                </label>
                <input
                  type="text"
                  value={formCliente.empresa}
                  onChange={(e) =>
                    setFormCliente({ ...formCliente, empresa: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Observações
                </label>
                <textarea
                  value={formCliente.observacoes}
                  onChange={(e) =>
                    setFormCliente({
                      ...formCliente,
                      observacoes: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  rows="3"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={fecharModalCliente}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={salvarCliente}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editandoCliente ? "Salvar" : "Adicionar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modalProduto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editandoProduto ? "Editar Produto" : "Novo Produto"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome *</label>
                <input
                  type="text"
                  value={formProduto.nome}
                  onChange={(e) =>
                    setFormProduto({ ...formProduto, nome: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tipo</label>
                <select
                  value={formProduto.tipo}
                  onChange={(e) =>
                    setFormProduto({ ...formProduto, tipo: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="produto">Produto</option>
                  <option value="servico">Serviço</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Categoria
                </label>
                <input
                  type="text"
                  value={formProduto.categoria}
                  onChange={(e) =>
                    setFormProduto({
                      ...formProduto,
                      categoria: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Descrição
                </label>
                <textarea
                  value={formProduto.descricao}
                  onChange={(e) =>
                    setFormProduto({
                      ...formProduto,
                      descricao: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Preço (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formProduto.preco_base}
                    onChange={(e) =>
                      setFormProduto({
                        ...formProduto,
                        preco_base: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Custo (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formProduto.custo}
                    onChange={(e) =>
                      setFormProduto({ ...formProduto, custo: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Unidade de Medida
                </label>
                <input
                  type="text"
                  value={formProduto.unidade_medida}
                  onChange={(e) =>
                    setFormProduto({
                      ...formProduto,
                      unidade_medida: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="ex: un, hora, mês, kg..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="produto_ativo"
                  type="checkbox"
                  checked={!!formProduto.ativo}
                  onChange={(e) =>
                    setFormProduto({ ...formProduto, ativo: e.target.checked })
                  }
                />
                <label htmlFor="produto_ativo" className="text-sm font-medium">
                  Ativo
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Observações
                </label>
                <textarea
                  value={formProduto.observacoes}
                  onChange={(e) =>
                    setFormProduto({
                      ...formProduto,
                      observacoes: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  rows="3"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={fecharModalProduto}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={salvarProduto}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editandoProduto ? "Salvar" : "Adicionar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modalOportunidade && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">
              {editandoOportunidade
                ? "Editar Oportunidade"
                : "Nova Oportunidade"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  value={formOportunidade.titulo}
                  onChange={(e) =>
                    setFormOportunidade({
                      ...formOportunidade,
                      titulo: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Cliente *
                </label>
                <select
                  value={formOportunidade.cliente_id}
                  onChange={(e) =>
                    setFormOportunidade({
                      ...formOportunidade,
                      cliente_id: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <option value="">Selecione</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Produto
                </label>
                <select
                  value={formOportunidade.produto_id}
                  onChange={(e) => {
                    const produtoId = e.target.value;
                    const produtoSelecionado = produtos.find((p) => p.id === produtoId);
                    setFormOportunidade({
                      ...formOportunidade,
                      produto_id: produtoId,
                      valor: produtoSelecionado ? produtoSelecionado.preco_base.toString() : formOportunidade.valor,
                    });
                  }}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <option value="">Nenhum</option>
                  {produtos.filter((p) => p.ativo !== false).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome} — R$ {parseFloat(p.preco_base || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Valor (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formOportunidade.valor}
                  onChange={(e) =>
                    setFormOportunidade({
                      ...formOportunidade,
                      valor: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Estágio
                </label>
                <select
                  value={formOportunidade.estagio}
                  onChange={(e) =>
                    setFormOportunidade({
                      ...formOportunidade,
                      estagio: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                >
                  {estagios.map((e) => (
                    <option key={e} value={e}>
                      {e.charAt(0).toUpperCase() + e.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Data de Início
                </label>
                <input
                  type="date"
                  value={formOportunidade.data_inicio}
                  onChange={(e) =>
                    setFormOportunidade({
                      ...formOportunidade,
                      data_inicio: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={fecharModalOportunidade}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={salvarOportunidade}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {editandoOportunidade ? "Salvar" : "Adicionar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modalVenda && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editandoVenda ? "Editar Venda" : "Nova Venda"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Cliente *
                </label>
                <select
                  value={formVenda.cliente_id}
                  onChange={(e) =>
                    setFormVenda({ ...formVenda, cliente_id: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <option value="">Selecione</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Descrição *
                </label>
                <input
                  type="text"
                  value={formVenda.descricao}
                  onChange={(e) =>
                    setFormVenda({ ...formVenda, descricao: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              {/* Produtos da Venda */}
              <div>
                <label className="block text-sm font-medium mb-2">Produtos</label>
                <div className="flex gap-2 mb-2">
                  <select
                    id="venda-produto-select"
                    className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none text-sm"
                    defaultValue=""
                  >
                    <option value="">Selecione um produto</option>
                    {produtos.filter((p) => p.ativo !== false).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nome} — R$ {parseFloat(p.preco_base || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      const sel = document.getElementById("venda-produto-select");
                      const produtoId = sel.value;
                      if (!produtoId) return;
                      const prod = produtos.find((p) => p.id === produtoId);
                      if (!prod) return;
                      const novoItem = {
                        produto_id: prod.id,
                        nome: prod.nome,
                        quantidade: 1,
                        valor_unitario: parseFloat(prod.preco_base || 0),
                      };
                      setFormVenda({
                        ...formVenda,
                        itens: [...formVenda.itens, novoItem],
                      });
                      sel.value = "";
                    }}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-1"
                  >
                    <Icons.Plus className="w-4 h-4" />
                    Adicionar
                  </button>
                </div>

                {formVenda.itens.length > 0 && (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Produto</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 w-20">Qtd</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 w-28">Valor Unit.</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 w-28">Subtotal</th>
                          <th className="px-3 py-2 w-10"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {formVenda.itens.map((item, idx) => (
                          <tr key={idx}>
                            <td className="px-3 py-2">{item.nome}</td>
                            <td className="px-3 py-2">
                              <input
                                type="number"
                                min="1"
                                value={item.quantidade}
                                onChange={(e) => {
                                  const novosItens = [...formVenda.itens];
                                  novosItens[idx] = { ...novosItens[idx], quantidade: parseInt(e.target.value) || 1 };
                                  setFormVenda({ ...formVenda, itens: novosItens });
                                }}
                                className="w-16 border rounded px-2 py-1 text-center"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="number"
                                step="0.01"
                                value={item.valor_unitario}
                                onChange={(e) => {
                                  const novosItens = [...formVenda.itens];
                                  novosItens[idx] = { ...novosItens[idx], valor_unitario: parseFloat(e.target.value) || 0 };
                                  setFormVenda({ ...formVenda, itens: novosItens });
                                }}
                                className="w-24 border rounded px-2 py-1"
                              />
                            </td>
                            <td className="px-3 py-2 font-medium text-green-600">
                              R$ {(parseFloat(item.valor_unitario || 0) * parseFloat(item.quantidade || 1)).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-3 py-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const novosItens = formVenda.itens.filter((_, i) => i !== idx);
                                  setFormVenda({ ...formVenda, itens: novosItens });
                                }}
                                className="text-red-600 hover:bg-red-50 p-1 rounded"
                              >
                                <Icons.Trash className="w-3 h-3" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Desconto */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Desconto (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formVenda.desconto}
                  onChange={(e) =>
                    setFormVenda({ ...formVenda, desconto: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="0,00"
                />
              </div>

              {/* Valor Total */}
              {formVenda.itens.length > 0 ? (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Subtotal:</span>
                    <span>R$ {formVenda.itens.reduce((s, item) => s + parseFloat(item.valor_unitario || 0) * parseFloat(item.quantidade || 1), 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                  {parseFloat(formVenda.desconto || 0) > 0 && (
                    <div className="flex justify-between text-sm text-red-600 mb-1">
                      <span>Desconto:</span>
                      <span>- R$ {parseFloat(formVenda.desconto || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg text-green-700 border-t pt-2 mt-2">
                    <span>Total:</span>
                    <span>R$ {calcularTotalVenda(formVenda.itens, formVenda.desconto).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Valor (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formVenda.valor}
                    onChange={(e) =>
                      setFormVenda({ ...formVenda, valor: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">
                  Data da Venda
                </label>
                <input
                  type="date"
                  value={formVenda.data_venda}
                  onChange={(e) =>
                    setFormVenda({ ...formVenda, data_venda: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Forma de Pagamento
                </label>
                <select
                  value={formVenda.forma_pagamento}
                  onChange={(e) =>
                    setFormVenda({
                      ...formVenda,
                      forma_pagamento: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                >
                  {["à vista", "parcelado", "boleto", "cartão", "pix"].map(
                    (f) => (
                      <option key={f} value={f}>
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                      </option>
                    ),
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Observações
                </label>
                <textarea
                  value={formVenda.observacoes}
                  onChange={(e) =>
                    setFormVenda({ ...formVenda, observacoes: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                  rows="3"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={fecharModalVenda}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={salvarVenda}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {editandoVenda ? "Salvar" : "Adicionar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modalTitulo && (() => {
        const vendaRelacionada = formTitulo.venda_id
          ? vendas.find((v) => v.id === formTitulo.venda_id)
          : null;
        const saldoVenda = vendaRelacionada
          ? vendaRelacionada.valor -
            titulos
              .filter(
                (t) =>
                  t.venda_id === vendaRelacionada.id &&
                  t.status === "pago" &&
                  (!editandoTitulo || t.id !== editandoTitulo.id)
              )
              .reduce((acc, t) => acc + Number(t.valor), 0)
          : null;
        return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">
              {editandoTitulo ? "Editar Título" : "Novo Título"}
            </h3>
            <div className="space-y-4">
              {vendaRelacionada && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Venda Relacionada</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">{vendaRelacionada.descricao}</span>
                    <span className="text-sm font-medium text-gray-900">R$ {Number(vendaRelacionada.valor).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-gray-200 pt-2">
                    <span className="text-sm font-medium text-gray-700">Saldo restante</span>
                    <span className={`text-sm font-bold ${saldoVenda > 0 ? "text-yellow-600" : "text-green-600"}`}>
                      R$ {saldoVenda.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Descrição *
                </label>
                <input
                  type="text"
                  value={formTitulo.descricao}
                  onChange={(e) =>
                    setFormTitulo({ ...formTitulo, descricao: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Valor (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formTitulo.valor}
                  onChange={(e) =>
                    setFormTitulo({ ...formTitulo, valor: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Data de Emissão
                </label>
                <input
                  type="date"
                  value={formTitulo.data_emissao}
                  onChange={(e) =>
                    setFormTitulo({
                      ...formTitulo,
                      data_emissao: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Data de Vencimento *
                </label>
                <input
                  type="date"
                  value={formTitulo.data_vencimento}
                  onChange={(e) =>
                    setFormTitulo({
                      ...formTitulo,
                      data_vencimento: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={formTitulo.status}
                  onChange={(e) =>
                    setFormTitulo({ ...formTitulo, status: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 outline-none"
                >
                  <option value="pendente">Pendente</option>
                  <option value="pago">Pago</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={fecharModalTitulo}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={salvarTitulo}
                className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
              >
                {editandoTitulo ? "Salvar" : "Adicionar"}
              </button>
            </div>
          </div>
        </div>
        );
      })()}
    </div>
  );
}

export default App;
