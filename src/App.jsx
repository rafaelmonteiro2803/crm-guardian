import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, DollarSign, User, Phone, Mail, Calendar, TrendingUp, FileText, CheckCircle, XCircle, Clock, BarChart3, ShoppingCart, CreditCard, AlertCircle, LogOut, Loader } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function CRMSupabase() {
  const [modalPipelineAberto, setModalPipelineAberto] = useState(false);
  const [modalVendaAberto, setModalVendaAberto] = useState(false);
  const [modalTituloAberto, setModalTituloAberto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [editandoOportunidade, setEditandoOportunidade] = useState(null);
  const [editandoVenda, setEditandoVenda] = useState(null);
  const [editandoTitulo, setEditandoTitulo] = useState(null);

  const [formCliente, setFormCliente] = useState({
    nome: '',
    email: '',
    telefone: '',
    empresa: '',
    observacoes: ''
  });

  const [formOportunidade, setFormOportunidade] = useState({
    titulo: '',
    clienteId: '',
    valor: '',
    estagio: 'prospecção',
    dataInicio: new Date().toISOString().split('T')[0]
  });

  const [formVenda, setFormVenda] = useState({
    clienteId: '',
    descricao: '',
    valor: '',
    dataVenda: new Date().toISOString().split('T')[0],
    formaPagamento: 'à vista',
    observacoes: ''
  });

  const [formTitulo, setFormTitulo] = useState({
    vendaId: '',
    descricao: '',
    valor: '',
    dataEmissao: new Date().toISOString().split('T')[0],
    dataVencimento: '',
    status: 'pendente'
  });

  const estagios = ['prospecção', 'qualificação', 'proposta', 'negociação', 'fechado'];

  // Carregar dados do storage
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const clientesData = await window.storage.get('crm-clientes', false);
        const oportunidadesData = await window.storage.get('crm-oportunidades', false);
        const vendasData = await window.storage.get('crm-vendas', false);
        const titulosData = await window.storage.get('crm-titulos', false);
        
        if (clientesData?.value) setClientes(JSON.parse(clientesData.value));
        if (oportunidadesData?.value) setOportunidades(JSON.parse(oportunidadesData.value));
        if (vendasData?.value) setVendas(JSON.parse(vendasData.value));
        if (titulosData?.value) setTitulos(JSON.parse(titulosData.value));
      } catch (error) {
        console.log('Iniciando com dados vazios');
      }
    };
    carregarDados();
  }, []);

  // Funções de salvamento
  const salvarClientes = async (novosClientes) => {
    setClientes(novosClientes);
    try {
      await window.storage.set('crm-clientes', JSON.stringify(novosClientes), false);
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  const salvarOportunidades = async (novasOportunidades) => {
    setOportunidades(novasOportunidades);
    try {
      await window.storage.set('crm-oportunidades', JSON.stringify(novasOportunidades), false);
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  const salvarVendas = async (novasVendas) => {
    setVendas(novasVendas);
    try {
      await window.storage.set('crm-vendas', JSON.stringify(novasVendas), false);
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  const salvarTitulos = async (novosTitulos) => {
    setTitulos(novosTitulos);
    try {
      await window.storage.set('crm-titulos', JSON.stringify(novosTitulos), false);
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  // Funções de Cliente
  const adicionarCliente = () => {
    if (!formCliente.nome.trim()) return;
    const novoCliente = {
      id: Date.now().toString(),
      ...formCliente,
      dataCadastro: new Date().toISOString()
    };
    salvarClientes([...clientes, novoCliente]);
    resetarFormCliente();
    setModalAberto(false);
  };

  const atualizarCliente = () => {
    const clientesAtualizados = clientes.map(c => 
      c.id === editando.id ? { ...editando, ...formCliente } : c
    );
    salvarClientes(clientesAtualizados);
    resetarFormCliente();
    setModalAberto(false);
    setEditando(null);
  };

  const excluirCliente = (id) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      salvarClientes(clientes.filter(c => c.id !== id));
      salvarOportunidades(oportunidades.filter(o => o.clienteId !== id));
      salvarVendas(vendas.filter(v => v.clienteId !== id));
    }
  };

  // Funções de Oportunidade
  const adicionarOportunidade = () => {
    if (!formOportunidade.titulo.trim() || !formOportunidade.clienteId) return;
    const novaOportunidade = {
      id: Date.now().toString(),
      ...formOportunidade,
      valor: parseFloat(formOportunidade.valor) || 0
    };
    salvarOportunidades([...oportunidades, novaOportunidade]);
    resetarFormOportunidade();
    setModalPipelineAberto(false);
  };

  const atualizarOportunidade = () => {
    const oportunidadesAtualizadas = oportunidades.map(o => 
      o.id === editandoOportunidade.id 
        ? { ...editandoOportunidade, ...formOportunidade, valor: parseFloat(formOportunidade.valor) || 0 } 
        : o
    );
    salvarOportunidades(oportunidadesAtualizadas);
    resetarFormOportunidade();
    setModalPipelineAberto(false);
    setEditandoOportunidade(null);
  };

  const excluirOportunidade = (id) => {
    if (confirm('Tem certeza que deseja excluir esta oportunidade?')) {
      salvarOportunidades(oportunidades.filter(o => o.id !== id));
    }
  };

  const moverOportunidade = (id, novoEstagio) => {
    const oportunidadesAtualizadas = oportunidades.map(o => 
      o.id === id ? { ...o, estagio: novoEstagio } : o
    );
    salvarOportunidades(oportunidadesAtualizadas);
  };

  // Funções de Venda
  const adicionarVenda = () => {
    if (!formVenda.clienteId || !formVenda.descricao.trim()) return;
    const novaVenda = {
      id: Date.now().toString(),
      ...formVenda,
      valor: parseFloat(formVenda.valor) || 0
    };
    salvarVendas([...vendas, novaVenda]);
    resetarFormVenda();
    setModalVendaAberto(false);
  };

  const atualizarVenda = () => {
    const vendasAtualizadas = vendas.map(v => 
      v.id === editandoVenda.id 
        ? { ...editandoVenda, ...formVenda, valor: parseFloat(formVenda.valor) || 0 } 
        : v
    );
    salvarVendas(vendasAtualizadas);
    resetarFormVenda();
    setModalVendaAberto(false);
    setEditandoVenda(null);
  };

  const excluirVenda = (id) => {
    if (confirm('Tem certeza que deseja excluir esta venda?')) {
      salvarVendas(vendas.filter(v => v.id !== id));
      salvarTitulos(titulos.filter(t => t.vendaId !== id));
    }
  };

  // Funções de Título
  const adicionarTitulo = () => {
    if (!formTitulo.descricao.trim()) return;
    const novoTitulo = {
      id: Date.now().toString(),
      ...formTitulo,
      valor: parseFloat(formTitulo.valor) || 0,
      dataPagamento: formTitulo.status === 'pago' ? new Date().toISOString().split('T')[0] : null
    };
    salvarTitulos([...titulos, novoTitulo]);
    resetarFormTitulo();
    setModalTituloAberto(false);
  };

  const atualizarTitulo = () => {
    const titulosAtualizados = titulos.map(t => 
      t.id === editandoTitulo.id 
        ? { 
            ...editandoTitulo, 
            ...formTitulo, 
            valor: parseFloat(formTitulo.valor) || 0,
            dataPagamento: formTitulo.status === 'pago' && !editandoTitulo.dataPagamento 
              ? new Date().toISOString().split('T')[0] 
              : editandoTitulo.dataPagamento
          } 
        : t
    );
    salvarTitulos(titulosAtualizados);
    resetarFormTitulo();
    setModalTituloAberto(false);
    setEditandoTitulo(null);
  };

  const excluirTitulo = (id) => {
    if (confirm('Tem certeza que deseja excluir este título?')) {
      salvarTitulos(titulos.filter(t => t.id !== id));
    }
  };

  const marcarComoPago = (id) => {
    const titulosAtualizados = titulos.map(t => 
      t.id === id ? { ...t, status: 'pago', dataPagamento: new Date().toISOString().split('T')[0] } : t
    );
    salvarTitulos(titulosAtualizados);
  };

  // Resetar forms
  const resetarFormCliente = () => {
    setFormCliente({ nome: '', email: '', telefone: '', empresa: '', observacoes: '' });
  };

  const resetarFormOportunidade = () => {
    setFormOportunidade({
      titulo: '', clienteId: '', valor: '', estagio: 'prospecção',
      dataInicio: new Date().toISOString().split('T')[0]
    });
  };

  const resetarFormVenda = () => {
    setFormVenda({
      clienteId: '', descricao: '', valor: '', 
      dataVenda: new Date().toISOString().split('T')[0],
      formaPagamento: 'à vista', observacoes: ''
    });
  };

  const resetarFormTitulo = () => {
    setFormTitulo({
      vendaId: '', descricao: '', valor: '',
      dataEmissao: new Date().toISOString().split('T')[0],
      dataVencimento: '', status: 'pendente'
    });
  };

  // Funções auxiliares
  const getClienteNome = (clienteId) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente?.nome || 'Cliente não encontrado';
  };

  const getVendaDescricao = (vendaId) => {
    const venda = vendas.find(v => v.id === vendaId);
    return venda?.descricao || 'Venda não encontrada';
  };

  const abrirEdicaoCliente = (cliente) => {
    setEditando(cliente);
    setFormCliente({
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone,
      empresa: cliente.empresa,
      observacoes: cliente.observacoes
    });
    setModalAberto(true);
  };

  const abrirEdicaoOportunidade = (oportunidade) => {
    setEditandoOportunidade(oportunidade);
    setFormOportunidade({
      titulo: oportunidade.titulo,
      clienteId: oportunidade.clienteId,
      valor: oportunidade.valor.toString(),
      estagio: oportunidade.estagio,
      dataInicio: oportunidade.dataInicio
    });
    setModalPipelineAberto(true);
  };

  const abrirEdicaoVenda = (venda) => {
    setEditandoVenda(venda);
    setFormVenda({
      clienteId: venda.clienteId,
      descricao: venda.descricao,
      valor: venda.valor.toString(),
      dataVenda: venda.dataVenda,
      formaPagamento: venda.formaPagamento,
      observacoes: venda.observacoes
    });
    setModalVendaAberto(true);
  };

  const abrirEdicaoTitulo = (titulo) => {
    setEditandoTitulo(titulo);
    setFormTitulo({
      vendaId: titulo.vendaId,
      descricao: titulo.descricao,
      valor: titulo.valor.toString(),
      dataEmissao: titulo.dataEmissao,
      dataVencimento: titulo.dataVencimento,
      status: titulo.status
    });
    setModalTituloAberto(true);
  };

  // Cálculos Dashboard
  const calcularIndicadores = () => {
    const totalOportunidades = oportunidades.reduce((sum, o) => sum + o.valor, 0);
    const oportunidadesFechadas = oportunidades.filter(o => o.estagio === 'fechado');
    const taxaConversao = oportunidades.length > 0 
      ? (oportunidadesFechadas.length / oportunidades.length * 100).toFixed(1) 
      : 0;
    
    const totalVendas = vendas.reduce((sum, v) => sum + v.valor, 0);
    const vendasMesAtual = vendas.filter(v => {
      const dataVenda = new Date(v.dataVenda);
      const hoje = new Date();
      return dataVenda.getMonth() === hoje.getMonth() && 
             dataVenda.getFullYear() === hoje.getFullYear();
    });
    const totalVendasMes = vendasMesAtual.reduce((sum, v) => sum + v.valor, 0);

    const titulosPendentes = titulos.filter(t => t.status === 'pendente');
    const titulosPagos = titulos.filter(t => t.status === 'pago');
    const titulosVencidos = titulos.filter(t => {
      if (t.status !== 'pendente') return false;
      return new Date(t.dataVencimento) < new Date();
    });

    const totalReceber = titulosPendentes.reduce((sum, t) => sum + t.valor, 0);
    const totalRecebido = titulosPagos.reduce((sum, t) => sum + t.valor, 0);
    const totalVencido = titulosVencidos.reduce((sum, t) => sum + t.valor, 0);

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

  const indicadores = calcularIndicadores();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-4">CRM Completo</h1>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setViewMode('dashboard')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'dashboard' 
                ? 'bg-white text-blue-600 shadow-md' 
                : 'bg-blue-500 hover:bg-blue-400'
            }`}
          >
            <BarChart3 className="inline w-5 h-5 mr-2" />
            Dashboard
          </button>
          <button
            onClick={() => setViewMode('clientes')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'clientes' 
                ? 'bg-white text-blue-600 shadow-md' 
                : 'bg-blue-500 hover:bg-blue-400'
            }`}
          >
            <User className="inline w-5 h-5 mr-2" />
            Clientes ({clientes.length})
          </button>
          <button
            onClick={() => setViewMode('pipeline')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'pipeline' 
                ? 'bg-white text-blue-600 shadow-md' 
                : 'bg-blue-500 hover:bg-blue-400'
            }`}
          >
            <TrendingUp className="inline w-5 h-5 mr-2" />
            Pipeline ({oportunidades.length})
          </button>
          <button
            onClick={() => setViewMode('vendas')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'vendas' 
                ? 'bg-white text-blue-600 shadow-md' 
                : 'bg-blue-500 hover:bg-blue-400'
            }`}
          >
            <ShoppingCart className="inline w-5 h-5 mr-2" />
            Vendas ({vendas.length})
          </button>
          <button
            onClick={() => setViewMode('financeiro')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'financeiro' 
                ? 'bg-white text-blue-600 shadow-md' 
                : 'bg-blue-500 hover:bg-blue-400'
            }`}
          >
            <CreditCard className="inline w-5 h-5 mr-2" />
            Financeiro ({titulos.length})
          </button>
        </div>
      </div>

      <div className="container mx-auto p-6 max-w-7xl">
        {/* DASHBOARD */}
        {viewMode === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Visão Geral</h2>
            
            {/* Cards de indicadores */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 text-sm font-medium">Clientes</h3>
                  <User className="w-8 h-8 text-blue-500" />
                </div>
                <p className="text-3xl font-bold text-gray-800">{clientes.length}</p>
                <p className="text-sm text-gray-500 mt-1">Total cadastrados</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 text-sm font-medium">Oportunidades</h3>
                  <TrendingUp className="w-8 h-8 text-purple-500" />
                </div>
                <p className="text-3xl font-bold text-gray-800">
                  R$ {indicadores.totalOportunidades.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {indicadores.numOportunidades} ativas • {indicadores.taxaConversao}% conversão
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 text-sm font-medium">Vendas</h3>
                  <ShoppingCart className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-3xl font-bold text-gray-800">
                  R$ {indicadores.totalVendas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {indicadores.numVendas} vendas • R$ {indicadores.totalVendasMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} este mês
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 text-sm font-medium">Financeiro</h3>
                  <CreditCard className="w-8 h-8 text-yellow-500" />
                </div>
                <p className="text-3xl font-bold text-gray-800">
                  R$ {indicadores.totalReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  A receber • {indicadores.numTitulosPendentes} títulos pendentes
                </p>
              </div>
            </div>

            {/* Detalhes financeiros */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-green-700 font-semibold">Recebido</h3>
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-700">
                  R$ {indicadores.totalRecebido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-green-600 mt-1">{indicadores.numTitulosPagos} títulos pagos</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-yellow-700 font-semibold">A Receber</h3>
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-yellow-700">
                  R$ {indicadores.totalReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-yellow-600 mt-1">{indicadores.numTitulosPendentes} títulos pendentes</p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-red-700 font-semibold">Vencidos</h3>
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <p className="text-2xl font-bold text-red-700">
                  R$ {indicadores.totalVencido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-red-600 mt-1">{indicadores.numTitulosVencidos} títulos vencidos</p>
              </div>
            </div>

            {/* Resumo visual */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Resumo do Sistema</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-blue-600">{clientes.length}</p>
                  <p className="text-sm text-gray-600">Clientes</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-purple-600">{oportunidades.length}</p>
                  <p className="text-sm text-gray-600">Oportunidades</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-600">{vendas.length}</p>
                  <p className="text-sm text-gray-600">Vendas</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-yellow-600">{titulos.length}</p>
                  <p className="text-sm text-gray-600">Títulos</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CLIENTES */}
        {viewMode === 'clientes' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Meus Clientes</h2>
              <button
                onClick={() => {
                  resetarFormCliente();
                  setEditando(null);
                  setModalAberto(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-colors"
              >
                <Plus className="w-5 h-5" />
                Novo Cliente
              </button>
            </div>

            {clientes.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <User className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">Nenhum cliente cadastrado ainda.</p>
                <p className="text-gray-400 mt-2">Clique em "Novo Cliente" para começar!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clientes.map(cliente => (
                  <div key={cliente.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-800">{cliente.nome}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => abrirEdicaoCliente(cliente)}
                          className="text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => excluirCliente(cliente.id)}
                          className="text-red-600 hover:bg-red-50 p-2 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {cliente.empresa && (
                      <p className="text-gray-600 font-medium mb-2">{cliente.empresa}</p>
                    )}
                    
                    <div className="space-y-2 text-sm">
                      {cliente.email && (
                        <div className="flex items-center text-gray-600">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          {cliente.email}
                        </div>
                      )}
                      {cliente.telefone && (
                        <div className="flex items-center text-gray-600">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {cliente.telefone}
                        </div>
                      )}
                      {cliente.observacoes && (
                        <p className="text-gray-500 mt-3 pt-3 border-t">{cliente.observacoes}</p>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-3 border-t text-xs text-gray-400">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      Cadastrado em {new Date(cliente.dataCadastro).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PIPELINE */}
        {viewMode === 'pipeline' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Pipeline de Vendas</h2>
              <button
                onClick={() => {
                  resetarFormOportunidade();
                  setEditandoOportunidade(null);
                  setModalPipelineAberto(true);
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-colors"
                disabled={clientes.length === 0}
              >
                <Plus className="w-5 h-5" />
                Nova Oportunidade
              </button>
            </div>

            {clientes.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <User className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">Cadastre clientes primeiro para criar oportunidades.</p>
              </div>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-4">
                {estagios.map(estagio => {
                  const oportunidadesEstagio = oportunidades.filter(o => o.estagio === estagio);
                  const total = oportunidadesEstagio.reduce((sum, o) => sum + o.valor, 0);
                  
                  return (
                    <div key={estagio} className="flex-shrink-0 w-80">
                      <div className="bg-gray-100 rounded-lg p-4 mb-3">
                        <h3 className="font-bold text-gray-700 capitalize mb-1">{estagio}</h3>
                        <p className="text-sm text-gray-600">
                          {oportunidadesEstagio.length} oportunidade{oportunidadesEstagio.length !== 1 ? 's' : ''}
                          {' • '}
                          R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        {oportunidadesEstagio.map(oportunidade => (
                          <div key={oportunidade.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-gray-800">{oportunidade.titulo}</h4>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => abrirEdicaoOportunidade(oportunidade)}
                                  className="text-blue-600 hover:bg-blue-50 p-1 rounded"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => excluirOportunidade(oportunidade.id)}
                                  className="text-red-600 hover:bg-red-50 p-1 rounded"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-2">
                              <User className="w-3 h-3 inline mr-1" />
                              {getClienteNome(oportunidade.clienteId)}
                            </p>
                            
                            <p className="text-lg font-bold text-green-600 mb-3">
                              R$ {oportunidade.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                            
                            <div className="flex gap-1">
                              {estagios.map((est, idx) => {
                                const estagioAtualIdx = estagios.indexOf(oportunidade.estagio);
                                const podeAvancar = idx === estagioAtualIdx + 1;
                                const podeVoltar = idx === estagioAtualIdx - 1;
                                
                                if (!podeAvancar && !podeVoltar) return null;
                                
                                return (
                                  <button
                                    key={est}
                                    onClick={() => moverOportunidade(oportunidade.id, est)}
                                    className={`flex-1 px-2 py-1 text-xs rounded ${
                                      podeAvancar 
                                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                  >
                                    {podeAvancar ? '→ Avançar' : '← Voltar'}
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
        {viewMode === 'vendas' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Vendas Realizadas</h2>
              <button
                onClick={() => {
                  resetarFormVenda();
                  setEditandoVenda(null);
                  setModalVendaAberto(true);
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-colors"
                disabled={clientes.length === 0}
              >
                <Plus className="w-5 h-5" />
                Nova Venda
              </button>
            </div>

            {clientes.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <User className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">Cadastre clientes primeiro para registrar vendas.</p>
              </div>
            ) : vendas.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">Nenhuma venda registrada ainda.</p>
                <p className="text-gray-400 mt-2">Clique em "Nova Venda" para começar!</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Forma Pgto</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {vendas.map(venda => (
                      <tr key={venda.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(venda.dataVenda).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">
                          {getClienteNome(venda.clienteId)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{venda.descricao}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 capitalize">{venda.formaPagamento}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-green-600">
                          R$ {venda.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 text-sm text-right">
                          <button
                            onClick={() => abrirEdicaoVenda(venda)}
                            className="text-blue-600 hover:bg-blue-50 p-2 rounded mr-2"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => excluirVenda(venda.id)}
                            className="text-red-600 hover:bg-red-50 p-2 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
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
        {viewMode === 'financeiro' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Gestão Financeira</h2>
              <button
                onClick={() => {
                  resetarFormTitulo();
                  setEditandoTitulo(null);
                  setModalTituloAberto(true);
                }}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-colors"
              >
                <Plus className="w-5 h-5" />
                Novo Título
              </button>
            </div>

            {/* Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-green-700 font-semibold mb-2">Pagos</h3>
                <p className="text-2xl font-bold text-green-700">
                  R$ {indicadores.totalRecebido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-green-600">{indicadores.numTitulosPagos} títulos</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-yellow-700 font-semibold mb-2">Pendentes</h3>
                <p className="text-2xl font-bold text-yellow-700">
                  R$ {indicadores.totalReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-yellow-600">{indicadores.numTitulosPendentes} títulos</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-red-700 font-semibold mb-2">Vencidos</h3>
                <p className="text-2xl font-bold text-red-700">
                  R$ {indicadores.totalVencido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-red-600">{indicadores.numTitulosVencidos} títulos</p>
              </div>
            </div>

            {titulos.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">Nenhum título cadastrado ainda.</p>
                <p className="text-gray-400 mt-2">Clique em "Novo Título" para começar!</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Emissão</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vencimento</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {titulos.map(titulo => {
                      const vencido = titulo.status === 'pendente' && new Date(titulo.dataVencimento) < new Date();
                      return (
                        <tr key={titulo.id} className={`hover:bg-gray-50 ${vencido ? 'bg-red-50' : ''}`}>
                          <td className="px-6 py-4 text-sm text-gray-800">{titulo.descricao}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(titulo.dataEmissao).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(titulo.dataVencimento).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                            R$ {titulo.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {titulo.status === 'pago' ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Pago
                              </span>
                            ) : vencido ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <XCircle className="w-3 h-3 mr-1" />
                                Vencido
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <Clock className="w-3 h-3 mr-1" />
                                Pendente
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-right">
                            {titulo.status === 'pendente' && (
                              <button
                                onClick={() => marcarComoPago(titulo.id)}
                                className="text-green-600 hover:bg-green-50 px-3 py-1 rounded mr-2 text-xs font-medium"
                              >
                                Pagar
                              </button>
                            )}
                            <button
                              onClick={() => abrirEdicaoTitulo(titulo)}
                              className="text-blue-600 hover:bg-blue-50 p-2 rounded mr-2"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => excluirTitulo(titulo.id)}
                              className="text-red-600 hover:bg-red-50 p-2 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
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

      {/* Modal Cliente */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editando ? 'Editar Cliente' : 'Novo Cliente'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                <input
                  type="text"
                  value={formCliente.nome}
                  onChange={(e) => setFormCliente({...formCliente, nome: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome do cliente"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formCliente.email}
                  onChange={(e) => setFormCliente({...formCliente, email: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="email@exemplo.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input
                  type="tel"
                  value={formCliente.telefone}
                  onChange={(e) => setFormCliente({...formCliente, telefone: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(00) 00000-0000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                <input
                  type="text"
                  value={formCliente.empresa}
                  onChange={(e) => setFormCliente({...formCliente, empresa: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome da empresa"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                <textarea
                  value={formCliente.observacoes}
                  onChange={(e) => setFormCliente({...formCliente, observacoes: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Notas sobre o cliente..."
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setModalAberto(false);
                  setEditando(null);
                  resetarFormCliente();
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={editando ? atualizarCliente : adicionarCliente}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editando ? 'Salvar' : 'Adicionar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Oportunidade */}
      {modalPipelineAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">
              {editandoOportunidade ? 'Editar Oportunidade' : 'Nova Oportunidade'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                <input
                  type="text"
                  value={formOportunidade.titulo}
                  onChange={(e) => setFormOportunidade({...formOportunidade, titulo: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: Venda de sistema"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
                <select
                  value={formOportunidade.clienteId}
                  onChange={(e) => setFormOportunidade({...formOportunidade, clienteId: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Selecione um cliente</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formOportunidade.valor}
                  onChange={(e) => setFormOportunidade({...formOportunidade, valor: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estágio</label>
                <select
                  value={formOportunidade.estagio}
                  onChange={(e) => setFormOportunidade({...formOportunidade, estagio: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {estagios.map(estagio => (
                    <option key={estagio} value={estagio}>
                      {estagio.charAt(0).toUpperCase() + estagio.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
                <input
                  type="date"
                  value={formOportunidade.dataInicio}
                  onChange={(e) => setFormOportunidade({...formOportunidade, dataInicio: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setModalPipelineAberto(false);
                  setEditandoOportunidade(null);
                  resetarFormOportunidade();
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={editandoOportunidade ? atualizarOportunidade : adicionarOportunidade}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {editandoOportunidade ? 'Salvar' : 'Adicionar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Venda */}
      {modalVendaAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editandoVenda ? 'Editar Venda' : 'Nova Venda'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
                <select
                  value={formVenda.clienteId}
                  onChange={(e) => setFormVenda({...formVenda, clienteId: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Selecione um cliente</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
                <input
                  type="text"
                  value={formVenda.descricao}
                  onChange={(e) => setFormVenda({...formVenda, descricao: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: Venda de produto X"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formVenda.valor}
                  onChange={(e) => setFormVenda({...formVenda, valor: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data da Venda</label>
                <input
                  type="date"
                  value={formVenda.dataVenda}
                  onChange={(e) => setFormVenda({...formVenda, dataVenda: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Forma de Pagamento</label>
                <select
                  value={formVenda.formaPagamento}
                  onChange={(e) => setFormVenda({...formVenda, formaPagamento: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="à vista">À vista</option>
                  <option value="parcelado">Parcelado</option>
                  <option value="boleto">Boleto</option>
                  <option value="cartão">Cartão</option>
                  <option value="pix">PIX</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                <textarea
                  value={formVenda.observacoes}
                  onChange={(e) => setFormVenda({...formVenda, observacoes: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows="3"
                  placeholder="Notas sobre a venda..."
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setModalVendaAberto(false);
                  setEditandoVenda(null);
                  resetarFormVenda();
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={editandoVenda ? atualizarVenda : adicionarVenda}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {editandoVenda ? 'Salvar' : 'Adicionar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Título */}
      {modalTituloAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">
              {editandoTitulo ? 'Editar Título' : 'Novo Título'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
                <input
                  type="text"
                  value={formTitulo.descricao}
                  onChange={(e) => setFormTitulo({...formTitulo, descricao: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Ex: Parcela 1/3"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formTitulo.valor}
                  onChange={(e) => setFormTitulo({...formTitulo, valor: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Emissão</label>
                <input
                  type="date"
                  value={formTitulo.dataEmissao}
                  onChange={(e) => setFormTitulo({...formTitulo, dataEmissao: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Vencimento *</label>
                <input
                  type="date"
                  value={formTitulo.dataVencimento}
                  onChange={(e) => setFormTitulo({...formTitulo, dataVencimento: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formTitulo.status}
                  onChange={(e) => setFormTitulo({...formTitulo, status: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="pendente">Pendente</option>
                  <option value="pago">Pago</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setModalTituloAberto(false);
                  setEditandoTitulo(null);
                  resetarFormTitulo();
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={editandoTitulo ? atualizarTitulo : adicionarTitulo}
                className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                {editandoTitulo ? 'Salvar' : 'Adicionar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
