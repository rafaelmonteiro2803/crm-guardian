import React from "react";

import { DashboardPage } from "../pages/DashboardPage";
import { ClientesPage } from "../pages/Clientes";
import { UsuariosPage } from "../pages/UsuariosPage";
import { ProdutosPage } from "../pages/ProdutosPage";
import { OrdensServicoPage } from "../pages/OrdensServicoPage";
import { AtendimentosRelatorioPage } from "../pages/AtendimentosRelatorioPage";
import { PipelinePage } from "../pages/Pipeline";
import { VendasPage } from "../pages/Vendas";
import { DocumentosPage } from "../pages/Documentos";
import { FinanceiroPage } from "../pages/Financeiro";
import { TecnicosPage } from "../pages/Tecnicos";
import { ComissoesPage } from "../pages/Comissoes";
import { EstoqueItensPage } from "../pages/EstoqueItens";
import { EstoqueMovimentacoesPage } from "../pages/EstoqueMovimentacoes";
import { ContasBancariasPage } from "../pages/ContasBancarias";
import { MovimentosBancariosPage } from "../pages/MovimentosBancarios";
import { ConciliacaoBancariaPage } from "../pages/ConciliacaoBancaria";
import { TenantsPage } from "../pages/Tenants";
import { FornecedoresPage } from "../pages/Fornecedores";
import { CentrosCustoPage } from "../pages/CentrosCusto";
import { ContasPagarPage } from "../pages/ContasPagar";
import { ContasPagarDashboard } from "../pages/ContasPagarDashboard";

/**
 * Renders the page component for the given viewMode.
 * @param {string} viewMode - Current active route key.
 * @param {object} props - All data and callbacks needed by page components.
 */
export const renderRoute = (viewMode, props) => {
  const {
    isOwner,
    fmtBRL,
    // Clientes
    clientes, salvarCliente, excluirCliente,
    // Usuarios
    usuariosEditUserId, onClearInitialEdit,
    // Produtos
    produtos, estoqueItens, produtoEstoqueVinculos,
    salvarProduto, excluirProduto,
    modalProduto, editandoProduto, formProduto, setFormProduto,
    abrirModalProduto, fecharModalProduto,
    modalVincularEstoque, vinculoProduto,
    abrirModalVincular, fecharModalVincular,
    salvarVinculo, excluirVinculo,
    // Pipeline / Oportunidades
    oportunidades, salvarOportunidade, excluirOportunidade, moverOportunidade,
    getClienteNome, getProdutoNome,
    // Vendas
    vendas, salvarVenda, excluirVenda,
    // Financeiro / Titulos
    titulos, salvarTitulo, excluirTitulo, marcarComoPago,
    // Tecnicos
    tecnicos, salvarTecnico, excluirTecnico,
    // Ordens de Serviço
    ordensServico,
    getTecnicoNome,
    encaminharParaTecnico, concluirOrdemServico, excluirOrdemServico, salvarEvolucao,
    modalEncaminhar, osEncaminhar, abrirModalEncaminhar, fecharModalEncaminhar,
    modalEvolucao, osEvolucao, abrirModalEvolucao, fecharModalEvolucao,
    // Comissões
    comissoes, agendarComissao, pagarComissao, excluirComissao,
    // Estoque
    estoqueMovimentacoes,
    salvarEstoqueItem, excluirEstoqueItem,
    salvarMovimentacaoComContaPagar, excluirMovimentacao,
    fornecedores,
    // Contas bancárias
    contasBancarias, salvarContaBancaria, excluirContaBancaria,
    movimentosBancarios, salvarMovimentoBancario, excluirMovimentoBancario,
    conciliacoesBancarias, salvarConciliacaoBancaria, excluirConciliacaoBancaria,
    // Tenants
    tenants, salvarTenant, excluirTenant,
    // Contas a pagar
    contasPagar, parcelasContasPagar, salvarContaPagar, excluirContaPagar, pagarParcela,
    // Fornecedores
    salvarFornecedor, excluirFornecedor,
    // Centros de custo
    centrosCusto, salvarCentroCusto, excluirCentroCusto,
  } = props;

  switch (viewMode) {
    case "dashboard":
      return <DashboardPage clientes={clientes} oportunidades={oportunidades} vendas={vendas} titulos={titulos} fmtBRL={fmtBRL} />;
    case "clientes":
      return <ClientesPage clientes={clientes} onSalvar={salvarCliente} onExcluir={excluirCliente} />;
    case "usuarios":
      return <UsuariosPage initialEditUserId={usuariosEditUserId} onClearInitialEdit={onClearInitialEdit} />;
    case "produtos":
      return (
        <ProdutosPage
          produtos={produtos}
          estoqueItens={estoqueItens}
          produtoEstoqueVinculos={produtoEstoqueVinculos}
          fmtBRL={fmtBRL}
          salvarProduto={salvarProduto}
          excluirProduto={excluirProduto}
          modalProduto={modalProduto}
          editandoProduto={editandoProduto}
          formProduto={formProduto}
          setFormProduto={setFormProduto}
          abrirModalProduto={abrirModalProduto}
          fecharModalProduto={fecharModalProduto}
          modalVincularEstoque={modalVincularEstoque}
          vinculoProduto={vinculoProduto}
          abrirModalVincular={abrirModalVincular}
          fecharModalVincular={fecharModalVincular}
          salvarVinculo={salvarVinculo}
          excluirVinculo={excluirVinculo}
        />
      );
    case "pipeline":
      return <PipelinePage oportunidades={oportunidades} clientes={clientes} produtos={produtos} fmtBRL={fmtBRL} getClienteNome={getClienteNome} getProdutoNome={getProdutoNome} onSalvar={salvarOportunidade} onExcluir={excluirOportunidade} onMover={moverOportunidade} />;
    case "vendas":
      return <VendasPage vendas={vendas} clientes={clientes} produtos={produtos} fmtBRL={fmtBRL} onSalvar={salvarVenda} onExcluir={excluirVenda} getClienteNome={getClienteNome} />;
    case "documentos":
      return <DocumentosPage vendas={vendas} clientes={clientes} fmtBRL={fmtBRL} />;
    case "financeiro":
      return <FinanceiroPage titulos={titulos} vendas={vendas} fmtBRL={fmtBRL} onSalvar={salvarTitulo} onExcluir={excluirTitulo} onMarcarPago={marcarComoPago} />;
    case "tecnicos":
      return <TecnicosPage tecnicos={tecnicos} onSalvar={salvarTecnico} onExcluir={excluirTecnico} />;
    case "ordens_servico":
      return (
        <OrdensServicoPage
          ordensServico={ordensServico}
          tecnicos={tecnicos}
          getClienteNome={getClienteNome}
          getTecnicoNome={getTecnicoNome}
          fmtBRL={fmtBRL}
          encaminharParaTecnico={encaminharParaTecnico}
          concluirOrdemServico={concluirOrdemServico}
          excluirOrdemServico={excluirOrdemServico}
          salvarEvolucao={salvarEvolucao}
          modalEncaminhar={modalEncaminhar}
          osEncaminhar={osEncaminhar}
          abrirModalEncaminhar={abrirModalEncaminhar}
          fecharModalEncaminhar={fecharModalEncaminhar}
          modalEvolucao={modalEvolucao}
          osEvolucao={osEvolucao}
          abrirModalEvolucao={abrirModalEvolucao}
          fecharModalEvolucao={fecharModalEvolucao}
        />
      );
    case "atendimentos_relatorio":
      return <AtendimentosRelatorioPage clientes={clientes} vendas={vendas} ordensServico={ordensServico} fmtBRL={fmtBRL} />;
    case "comissoes":
      return <ComissoesPage comissoes={comissoes} tecnicos={tecnicos} ordensServico={ordensServico} getTecnicoNome={getTecnicoNome} getClienteNome={getClienteNome} fmtBRL={fmtBRL} onAgendar={agendarComissao} onPagar={pagarComissao} onExcluir={excluirComissao} />;
    case "estoque_itens":
      return <EstoqueItensPage estoqueItens={estoqueItens} onSalvarItem={salvarEstoqueItem} onExcluirItem={excluirEstoqueItem} onSalvarMovimentacao={salvarMovimentacaoComContaPagar} fmtBRL={fmtBRL} fornecedores={fornecedores} />;
    case "estoque_movimentacoes":
      return <EstoqueMovimentacoesPage estoqueMovimentacoes={estoqueMovimentacoes} estoqueItens={estoqueItens} onSalvarMovimentacao={salvarMovimentacaoComContaPagar} onExcluirMovimentacao={excluirMovimentacao} fmtBRL={fmtBRL} />;
    case "contas_bancarias":
      return <ContasBancariasPage contasBancarias={contasBancarias} onSalvar={salvarContaBancaria} onExcluir={excluirContaBancaria} />;
    case "movimentos_bancarios":
      return <MovimentosBancariosPage movimentosBancarios={movimentosBancarios} contasBancarias={contasBancarias} onSalvar={salvarMovimentoBancario} onExcluir={excluirMovimentoBancario} fmtBRL={fmtBRL} />;
    case "conciliacao_bancaria":
      return <ConciliacaoBancariaPage conciliacoesBancarias={conciliacoesBancarias} titulos={titulos} movimentosBancarios={movimentosBancarios} contasBancarias={contasBancarias} onSalvar={salvarConciliacaoBancaria} onExcluir={excluirConciliacaoBancaria} fmtBRL={fmtBRL} />;
    case "tenants":
      return isOwner ? <TenantsPage tenants={tenants} onSalvar={salvarTenant} onExcluir={excluirTenant} /> : null;
    case "contas_pagar_dashboard":
      return <ContasPagarDashboard contasPagar={contasPagar} parcelas={parcelasContasPagar} fornecedores={fornecedores} fmtBRL={fmtBRL} />;
    case "contas_pagar":
      return <ContasPagarPage contasPagar={contasPagar} parcelas={parcelasContasPagar} fornecedores={fornecedores} centrosCusto={centrosCusto} contasBancarias={contasBancarias} onSalvar={salvarContaPagar} onExcluir={excluirContaPagar} onPagar={(parcela, formPagamento) => pagarParcela(parcela, formPagamento, contasBancarias)} fmtBRL={fmtBRL} />;
    case "fornecedores":
      return <FornecedoresPage fornecedores={fornecedores} onSalvar={salvarFornecedor} onExcluir={excluirFornecedor} />;
    case "centros_custo":
      return <CentrosCustoPage centrosCusto={centrosCusto} onSalvar={salvarCentroCusto} onExcluir={excluirCentroCusto} />;
    default:
      return null;
  }
};
