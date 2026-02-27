import { useState, useCallback } from "react";
import { supabase } from "../lib/supabase";

const FORM_VAZIO = {
  nome: "",
  tipo: "produto",
  descricao: "",
  categoria: "",
  preco_base: "",
  custo: "",
  unidade_medida: "",
  ativo: true,
  observacoes: "",
};

export function useProdutos(tenantId, userId) {
  const [produtos, setProdutos] = useState([]);
  const [modalProduto, setModalProduto] = useState(false);
  const [editandoProduto, setEditandoProduto] = useState(null);
  const [formProduto, setFormProduto] = useState(FORM_VAZIO);
  const [modalVincularEstoque, setModalVincularEstoque] = useState(false);
  const [vinculoProduto, setVinculoProduto] = useState(null);

  const carregarProdutos = useCallback(async () => {
    if (!tenantId) return;
    const { data } = await supabase
      .from("produtos")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false });
    if (data) setProdutos(data);
  }, [tenantId]);

  const salvarProduto = useCallback(async () => {
    if (!formProduto.nome.trim()) { alert("Nome é obrigatório!"); return; }
    const payload = {
      ...formProduto,
      preco_base: formProduto.preco_base === "" ? 0 : parseFloat(formProduto.preco_base),
      custo: formProduto.custo === "" ? 0 : parseFloat(formProduto.custo),
      user_id: userId,
      tenant_id: tenantId,
    };
    if (editandoProduto) {
      const { data } = await supabase
        .from("produtos")
        .update(payload)
        .eq("id", editandoProduto.id)
        .select();
      if (data) setProdutos((prev) => prev.map((p) => (p.id === editandoProduto.id ? data[0] : p)));
    } else {
      const { data } = await supabase.from("produtos").insert([payload]).select();
      if (data) setProdutos((prev) => [data[0], ...prev]);
    }
    fecharModalProduto();
  }, [formProduto, editandoProduto, tenantId, userId]);

  const excluirProduto = useCallback(async (id) => {
    if (!confirm("Excluir produto?")) return;
    await supabase.from("produtos").delete().eq("id", id);
    setProdutos((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const abrirModalProduto = useCallback((p = null) => {
    if (p) {
      setEditandoProduto(p);
      setFormProduto({
        nome: p.nome || "",
        tipo: p.tipo || "produto",
        descricao: p.descricao || "",
        categoria: p.categoria || "",
        preco_base: (p.preco_base ?? 0).toString(),
        custo: (p.custo ?? 0).toString(),
        unidade_medida: p.unidade_medida || "",
        ativo: p.ativo ?? true,
        observacoes: p.observacoes || "",
      });
    }
    setModalProduto(true);
  }, []);

  const fecharModalProduto = useCallback(() => {
    setModalProduto(false);
    setEditandoProduto(null);
    setFormProduto(FORM_VAZIO);
  }, []);

  const abrirModalVincular = useCallback((produto) => {
    setVinculoProduto(produto);
    setModalVincularEstoque(true);
  }, []);

  const fecharModalVincular = useCallback(() => {
    setModalVincularEstoque(false);
    setVinculoProduto(null);
  }, []);

  return {
    produtos,
    setProdutos,
    carregarProdutos,
    salvarProduto,
    excluirProduto,
    modalProduto,
    editandoProduto,
    formProduto,
    setFormProduto,
    abrirModalProduto,
    fecharModalProduto,
    modalVincularEstoque,
    vinculoProduto,
    abrirModalVincular,
    fecharModalVincular,
  };
}
