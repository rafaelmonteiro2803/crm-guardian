import { useState } from "react";
import {
  fetchVendas,
  createVenda,
  updateVenda,
  deleteVenda,
  fetchTitulos,
  createTitulo,
  updateTitulo,
  deleteTitulo,
  createOrdemServico,
} from "../services/vendasService";

const hoje = () => new Date().toISOString().split("T")[0];

export function useVendas(tenantId, userId, onNovaOS) {
  const [vendas, setVendas] = useState([]);
  const [titulos, setTitulos] = useState([]);

  const carregarVendas = async () => {
    const data = await fetchVendas(tenantId);
    setVendas(data);
  };

  const carregarTitulos = async () => {
    const data = await fetchTitulos(tenantId);
    setTitulos(data);
  };

  const calcularTotalVenda = (itens, desconto) => {
    const sub = itens.reduce(
      (s, i) => s + parseFloat(i.valor_unitario || 0) * parseFloat(i.quantidade || 1),
      0
    );
    return Math.max(sub - parseFloat(desconto || 0), 0);
  };

  const salvarVenda = async (form, editando, onSuccess) => {
    if (!form.descricao.trim()) {
      alert("Descrição é obrigatória!");
      return;
    }
    const valorTotal =
      form.itens.length > 0
        ? calcularTotalVenda(form.itens, form.desconto)
        : parseFloat(form.valor || 0);
    const payload = {
      cliente_id: form.cliente_id,
      descricao: form.descricao,
      valor: valorTotal,
      data_venda: form.data_venda,
      forma_pagamento: form.forma_pagamento,
      observacoes: form.observacoes,
      desconto: form.desconto === "" ? 0 : parseFloat(form.desconto),
      itens: form.itens,
    };

    if (editando) {
      const updated = await updateVenda(editando.id, payload);
      if (updated) setVendas((prev) => prev.map((v) => (v.id === editando.id ? updated : v)));
    } else {
      const created = await createVenda({ ...payload, user_id: userId, tenant_id: tenantId });
      if (created) {
        setVendas((prev) => [created, ...prev]);

        const novoTitulo = {
          venda_id: created.id,
          descricao: created.descricao,
          valor: created.valor,
          data_emissao: hoje(),
          data_vencimento: created.data_venda || hoje(),
          status: "pendente",
          user_id: userId,
          tenant_id: tenantId,
        };
        const titulo = await createTitulo(novoTitulo);
        if (titulo) setTitulos((prev) => [...prev, titulo]);

        const novaOS = {
          numero_os: "OS" + new Date().getFullYear() + "-" + String(Date.now()).slice(-6),
          venda_id: created.id,
          cliente_id: created.cliente_id,
          descricao: created.descricao,
          itens: created.itens || [],
          valor_total: created.valor,
          status: "aguardando_atendimento",
          data_abertura: created.data_venda || hoje(),
          user_id: userId,
          tenant_id: tenantId,
        };
        const os = await createOrdemServico(novaOS);
        if (os) onNovaOS?.(os);
      }
    }
    onSuccess?.();
  };

  const excluirVenda = async (id) => {
    if (!confirm("Excluir venda?")) return;
    await deleteVenda(id);
    setVendas((prev) => prev.filter((v) => v.id !== id));
  };

  const _criarSaldoTitulo = async (vendaRel, titulosAtuais, dataVencimento) => {
    const totalPago = titulosAtuais
      .filter((t) => t.venda_id === vendaRel.id && t.status === "pago")
      .reduce((a, t) => a + Number(t.valor), 0);
    const saldo = Number(vendaRel.valor) - totalPago;
    if (saldo > 0.01) {
      const ts = {
        venda_id: vendaRel.id,
        descricao: `${vendaRel.descricao} (saldo)`,
        valor: saldo.toFixed(2),
        data_emissao: hoje(),
        data_vencimento: dataVencimento || hoje(),
        status: "pendente",
        user_id: userId,
        tenant_id: tenantId,
      };
      return await createTitulo(ts);
    }
    return null;
  };

  const salvarTitulo = async (form, editando, onSuccess) => {
    if (!form.descricao.trim()) {
      alert("Descrição é obrigatória!");
      return;
    }
    const dadosTitulo = {
      ...form,
      user_id: userId,
      tenant_id: tenantId,
      data_pagamento: form.status === "pago" ? hoje() : null,
    };

    let titulosAtualizados = [...titulos];

    if (editando) {
      const updated = await updateTitulo(editando.id, dadosTitulo);
      if (updated) titulosAtualizados = titulosAtualizados.map((t) => (t.id === editando.id ? updated : t));
    } else {
      const created = await createTitulo(dadosTitulo);
      if (created) titulosAtualizados = [...titulosAtualizados, created];
    }

    if (form.status === "pago" && form.venda_id) {
      const vendaRel = vendas.find((v) => v.id === form.venda_id);
      if (vendaRel) {
        const saldoTitulo = await _criarSaldoTitulo(vendaRel, titulosAtualizados, form.data_vencimento);
        if (saldoTitulo) titulosAtualizados = [...titulosAtualizados, saldoTitulo];
      }
    }

    setTitulos(titulosAtualizados);
    onSuccess?.();
  };

  const excluirTitulo = async (id) => {
    if (!confirm("Excluir título?")) return;
    await deleteTitulo(id);
    setTitulos((prev) => prev.filter((t) => t.id !== id));
  };

  const marcarComoPago = async (id) => {
    const updated = await updateTitulo(id, {
      status: "pago",
      data_pagamento: hoje(),
    });
    if (updated) {
      let nt = titulos.map((t) => (t.id === id ? updated : t));
      if (updated.venda_id) {
        const vendaRel = vendas.find((v) => v.id === updated.venda_id);
        if (vendaRel) {
          const saldoTitulo = await _criarSaldoTitulo(vendaRel, nt, updated.data_vencimento);
          if (saldoTitulo) nt = [...nt, saldoTitulo];
        }
      }
      setTitulos(nt);
    }
  };

  return {
    vendas,
    setVendas,
    titulos,
    setTitulos,
    carregarVendas,
    carregarTitulos,
    salvarVenda,
    excluirVenda,
    salvarTitulo,
    excluirTitulo,
    marcarComoPago,
  };
}
