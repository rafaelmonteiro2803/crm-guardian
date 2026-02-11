import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, DollarSign, User, Phone, Mail, Calendar, TrendingUp, FileText, CheckCircle, XCircle, Clock, BarChart3, ShoppingCart, CreditCard, AlertCircle, LogOut, Loader } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// IMPORTANTE: No Replit, configure as Secrets:
// VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function CRMSupabase() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clientes, setClientes] = useState([]);
  const [oportunidades, setOportunidades] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [titulos, setTitulos] = useState([]);
  const [viewMode, setViewMode] = useState('dashboard');
  const [modalAberto, setModalAberto] = useState(false);
  const [modalPipelineAberto, setModalPipelineAberto] = useState(false);
  const [modalVendaAberto, setModalVendaAberto] = useState(false);
  const [modalTituloAberto, setModalTituloAberto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [editandoOportunidade, setEditandoOportunidade] = useState(null);
  const [editandoVenda, setEditandoVenda] = useState(null);
  const [editandoTitulo, setEditandoTitulo] = useState(null);

  // Estados de login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authMessage, setAuthMessage] = useState('');

  const [formCliente, setFormCliente] = useState({
    nome: '',
    email: '',
    telefone: '',
    empresa: '',
    observacoes: ''
  });

  const [formOportunidade, setFormOportunidade] = useState({
    titulo: '',
    cliente_id: '',
    valor: '',
    estagio: 'prospecção',
    data_inicio: new Date().toISOString().split('T')[0]
  });

  const [formVenda, setFormVenda] = useState({
    cliente_id: '',
    descricao: '',
    valor: '',
    data_venda: new Date().toISOString().split('T')[0],
    forma_pagamento: 'à vista',
    observacoes: ''
  });

  const [formTitulo, setFormTitulo] = useState({
    venda_id: '',
    descricao: '',
    valor: '',
    data_emissao: new Date().toISOString().split('T')[0],
    data_vencimento: '',
    status: 'pendente'
  });

  const estagios = ['prospecção', 'qualificação', 'proposta', 'negociação', 'fechado'];

  // Verificar sessão ao carregar
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Carregar dados quando houver sessão
  useEffect(() => {
    if (session) {
      carregarTodosDados();
    }
  }, [session]);

  // Funções de autenticação
  const handleSignUp = async (e) => {
    e.preventDefault();
    setAuthMessage('');
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      setAuthMessage('Erro ao criar conta: ' + error.message);
    } else {
      setAuthMessage('Conta criada! Verifique seu email para confirmar.');
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setAuthMessage('');
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setAuthMessage('Erro ao fazer login: ' + error.message);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setClientes([]);
    setOportunidades([]);
    setVendas([]);
    setTitulos([]);
  };

  // Funções de carregamento
  const carregarTodosDados = async () => {
    await Promise.all([
      carregarClientes(),
      carregarOportunidades(),
      carregarVendas(),
      carregarTitulos()
    ]);
  };

  const carregarClientes = async () => {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('data_cadastro', { ascending: false });
    if (!error && data) setClientes(data);
  };

  const carregarOportunidades = async () => {
    const { data, error } = await supabase
      .from('oportunidades')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setOportunidades(data);
  };

  const carregarVendas = async () => {
    const { data, error } = await supabase
      .from('vendas')
      .select('*')
      .order('data_venda', { ascending: false });
    if (!error && data) setVendas(data);
  };

  const carregarTitulos = async () => {
    const { data, error } = await supabase
      .from('titulos')
      .select('*')
      .order('data_vencimento', { ascending: true });
    if (!error && data) setTitulos(data);
  };

  // Funções de Cliente
  const adicionarCliente = async () => {
    if (!formCliente.nome.trim()) return;
    const { data, error } = await supabase
      .from('clientes')
      .insert([{ ...formCliente, user_id: session.user.id }])
      .select();
    if (!error && data) {
      setClientes([data[0], ...clientes]);
      resetarFormCliente();
      setModalAberto(false);
    }
  };

  const atualizarCliente = async () => {
    const { data, error } = await supabase
      .from('clientes')
      .update(formCliente)
      .eq('id', editando.id)
      .select();
    if (!error && data) {
      setClientes(clientes.map(c => c.id === editando.id ? data[0] : c));
      resetarFormCliente();
      setModalAberto(false);
      setEditando(null);
    }
  };

  const excluirCliente = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return;
    const { error } = await supabase.from('clientes').delete().eq('id', id);
    if (!error) setClientes(clientes.filter(c => c.id !== id));
  };

  // Funções de Oportunidade
  const adicionarOportunidade = async () => {
    if (!formOportunidade.titulo.trim() || !formOportunidade.cliente_id) return;
    const { data, error } = await supabase
      .from('oportunidades')
      .insert([{ ...formOportunidade, user_id: session.user.id }])
      .select();
    if (!error && data) {
      setOportunidades([data[0], ...oportunidades]);
      resetarFormOportunidade();
      setModalPipelineAberto(false);
    }
  };

  const atualizarOportunidade = async () => {
    const { data, error } = await supabase
      .from('oportunidades')
      .update(formOportunidade)
      .eq('id', editandoOportunidade.id)
      .select();
    if (!error && data) {
      setOportunidades(oportunidades.map(o => o.id === editandoOportunidade.id ? data[0] : o));
      resetarFormOportunidade();
      setModalPipelineAberto(false);
      setEditandoOportunidade(null);
    }
  };

  const excluirOportunidade = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta oportunidade?')) return;
    const { error } = await supabase.from('oportunidades').delete().eq('id', id);
    if (!error) setOportunidades(oportunidades.filter(o => o.id !== id));
  };

  const moverOportunidade = async (id, novoEstagio) => {
    const { data, error } = await supabase
      .from('oportunidades')
      .update({ estagio: novoEstagio })
      .eq('id', id)
      .select();
    if (!error && data) setOportunidades(oportunidades.map(o => o.id === id ? data[0] : o));
  };

  // Funções de Venda
  const adicionarVenda = async () => {
    if (!formVenda.cliente_id || !formVenda.descricao.trim()) return;
    const { data, error } = await supabase
      .from('vendas')
      .insert([{ ...formVenda, user_id: session.user.id }])
      .select();
    if (!error && data) {
      setVendas([data[0], ...vendas]);
      resetarFormVenda();
      setModalVendaAberto(false);
    }
  };

  const atualizarVenda = async () => {
    const { data, error } = await supabase
      .from('vendas')
      .update(formVenda)
      .eq('id', editandoVenda.id)
      .select();
    if (!error && data) {
      setVendas(vendas.map(v => v.id === editandoVenda.id ? data[0] : v));
      resetarFormVenda();
      setModalVendaAberto(false);
      setEditandoVenda(null);
    }
  };

  const excluirVenda = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta venda?')) return;
    const { error } = await supabase.from('vendas').delete().eq('id', id);
    if (!error) setVendas(vendas.filter(v => v.id !== id));
  };

  // Funções de Título
  const adicionarTitulo = async () => {
    if (!formTitulo.descricao.trim()) return;
    const tituloData = {
      ...formTitulo,
      user_id: session.user.id,
      data_pagamento: formTitulo.status === 'pago' ? new Date().toISOString().split('T')[0] : null
    };
    const { data, error } = await supabase
      .from('titulos')
      .insert([tituloData])
      .select();
    if (!error && data) {
      setTitulos([...titulos, data[0]]);
      resetarFormTitulo();
      setModalTituloAberto(false);
    }
  };

  const atualizarTitulo = async () => {
    const { data, error } = await supabase
      .from('titulos')
      .update(formTitulo)
      .eq('id', editandoTitulo.id)
      .select();
    if (!error && data) {
      setTitulos(titulos.map(t => t.id === editandoTitulo.id ? data[0] : t));
      resetarFormTitulo();
      setModalTituloAberto(false);
      setEditandoTitulo(null);
    }
  };

  const excluirTitulo = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este título?')) return;
    const { error } = await supabase.from('titulos').delete().eq('id', id);
    if (!error) setTitulos(titulos.filter(t => t.id !== id));
  };

  const marcarComoPago = async (id) => {
    const { data, error } = await supabase
      .from('titulos')
      .update({ status: 'pago', data_pagamento: new Date().toISOString().split('T')[0] })
      .eq('id', id)
      .select();
    if (!error && data) setTitulos(titulos.map(t => t.id === id ? data[0] : t));
  };

  // Resetar forms
  const resetarFormCliente = () => {
    setFormCliente({ nome: '', email: '', telefone: '', empresa: '', observacoes: '' });
  };

  const resetarFormOportunidade = () => {
    setFormOportunidade({
      titulo: '', cliente_id: '', valor: '', estagio: 'prospecção',
      data_inicio: new Date().toISOString().split('T')[0]
    });
  };

  const resetarFormVenda = () => {
    setFormVenda({
      cliente_id: '', descricao: '', valor: '',
      data_venda: new Date().toISOString().split('T')[0],
      forma_pagamento: 'à vista', observacoes: ''
    });
  };

  const resetarFormTitulo = () => {
    setFormTitulo({
      venda_id: '', descricao: '', valor: '',
      data_emissao: new Date().toISOString().split('T')[0],
      data_vencimento: '', status: 'pendente'
    });
  };

  // Funções auxiliares
  const getClienteNome = (clienteId) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente?.nome || 'Cliente não encontrado';
  };

  const abrirEdicaoCliente = (cliente) => {
    setEditando(cliente);
    setFormCliente({
      nome: cliente.nome,
      email: cliente.email || '',
      telefone: cliente.telefone || '',
      empresa: cliente.empresa || '',
      observacoes: cliente.observacoes || ''
    });
    setModalAberto(true);
  };

  const abrirEdicaoOportunidade = (oportunidade) => {
    setEditandoOportunidade(oportunidade);
    setFormOportunidade({
      titulo: oportunidade.titulo,
      cliente_id: oportunidade.cliente_id,
      valor: oportunidade.valor.toString(),
      estagio: oportunidade.estagio,
      data_inicio: oportunidade.data_inicio
    });
    setModalPipelineAberto(true);
  };

  const abrirEdicaoVenda = (venda) => {
    setEditandoVenda(venda);
    setFormVenda({
      cliente_id: venda.cliente_id,
      descricao: venda.descricao,
      valor: venda.valor.toString(),
      data_venda: venda.data_venda,
      forma_pagamento: venda.forma_pagamento,
      observacoes: venda.observacoes || ''
    });
    setModalVendaAberto(true);
  };

  const abrirEdicaoTitulo = (titulo) => {
    setEditandoTitulo(titulo);
    setFormTitulo({
      venda_id: titulo.venda_id || '',
      descricao: titulo.descricao,
      valor: titulo.valor.toString(),
      data_emissao: titulo.data_emissao,
      data_vencimento: titulo.data_vencimento,
      status: titulo.status
    });
    setModalTituloAberto(true);
  };

  // Cálculos Dashboard
  const calcularIndicadores = () => {
    const totalOportunidades = oportunidades.reduce((sum, o) => sum + parseFloat(o.valor || 0), 0);
    const oportunidadesFechadas = oportunidades.filter(o => o.estagio === 'fechado');
    const taxaConversao = oportunidades.length > 0
      ? (oportunidadesFechadas.length / oportunidades.length * 100).toFixed(1)
      : 0;

    const totalVendas = vendas.reduce((sum, v) => sum + parseFloat(v.valor || 0), 0);
    const vendasMesAtual = vendas.filter(v => {
      const dataVenda = new Date(v.data_venda);
      const hoje = new Date();
      return dataVenda.getMonth() === hoje.getMonth() &&
             dataVenda.getFullYear() === hoje.getFullYear();
    });
    const totalVendasMes = vendasMesAtual.reduce((sum, v) => sum + parseFloat(v.valor || 0), 0);

    const titulosPendentes = titulos.filter(t => t.status === 'pendente');
    const titulosPagos = titulos.filter(t => t.status === 'pago');
    const titulosVencidos = titulos.filter(t => {
      if (t.status !== 'pendente') return false;
      return new Date(t.data_vencimento) < new Date();
    });

    const totalReceber = titulosPendentes.reduce((sum, t) => sum + parseFloat(t.valor || 0), 0);
    const totalRecebido = titulosPagos.reduce((sum, t) => sum + parseFloat(t.valor || 0), 0);
    const totalVencido = titulosVencidos.reduce((sum, t) => sum + parseFloat(t.valor || 0), 0);

    return {
      totalOportunidades,
      numOportunidades: oportunidades.length,
      taxaConversao,
      totalVendas,
      numVendas: vendas.length,
      totalVendasMes,
      numVendasMes: vendasMesAtual.length,
      totalReceber,
      totalRecebido,
      totalVencido,
      numTitulosPendentes: titulosPendentes.length,
      numTitulosPagos: titulosPagos.length,
      numTitulosVencidos: titulosVencidos.length
    };
  };

  // Tela de loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Tela de login
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">CRM Sistema</h1>
          <p className="text-center text-gray-600 mb-6">Sistema completo de gestão</p>

          <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            {authMessage && (
              <div className={`p-3 rounded-lg text-sm ${
                authMessage.includes('Erro') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
              }`}>
                {authMessage}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
            >
              {isSignUp ? 'Criar Conta' : 'Entrar'}
            </button>
          </form>

          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setAuthMessage('');
            }}
            className="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {isSignUp ? 'Já tem conta? Faça login' : 'Não tem conta? Criar uma'}
          </button>
        </div>
      </div>
    );
  }

  const indicadores = calcularIndicadores();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Continua... */}
    </div>
  );
}
