import { useState, useCallback } from "react";
import { supabase } from "../lib/supabase";

export function useOrdensServico(tenantId, userId, adicionarComissao) {
  const [ordensServico, setOrdensServico] = useState([]);
  const [modalEncaminhar, setModalEncaminhar] = useState(false);
  const [osEncaminhar, setOsEncaminhar] = useState(null);
  const [modalEvolucao, setModalEvolucao] = useState(false);
  const [osEvolucao, setOsEvolucao] = useState(null);

  const carregarOrdensServico = useCallback(async () => {
    if (!tenantId) return;
    const { data } = await supabase
      .from("ordens_servico")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false });
    if (data) setOrdensServico(data);
  }, [tenantId]);

  const adicionarOrdemServico = useCallback((os) => {
    setOrdensServico((prev) => [os, ...prev]);
  }, []);

  const encaminharParaTecnico = useCallback(async (form) => {
    if (!form.tecnico_id) { alert("Selecione um técnico!"); return; }
    const payload = {
      tecnico_id: form.tecnico_id,
      comissao_percentual: parseFloat(form.comissao_percentual || 0),
      comissao_valor: parseFloat(form.comissao_valor || 0),
      status: "em_atendimento",
      data_atribuicao: new Date().toISOString(),
    };
    const { data } = await supabase
      .from("ordens_servico")
      .update(payload)
      .eq("id", osEncaminhar.id)
      .select();
    if (data) setOrdensServico((prev) => prev.map((o) => (o.id === osEncaminhar.id ? data[0] : o)));
    fecharModalEncaminhar();
  }, [osEncaminhar]);

  const concluirOrdemServico = useCallback(async (id) => {
    if (!confirm("Marcar atendimento como concluído?")) return;
    const { data } = await supabase
      .from("ordens_servico")
      .update({ status: "atendimento_concluido", data_conclusao: new Date().toISOString() })
      .eq("id", id)
      .select();
    if (data) {
      setOrdensServico((prev) => prev.map((o) => (o.id === id ? data[0] : o)));
      const os = data[0];
      if (os.tecnico_id && parseFloat(os.comissao_valor || 0) > 0) {
        const novaComissao = {
          ordem_servico_id: os.id,
          tecnico_id: os.tecnico_id,
          valor: os.comissao_valor,
          percentual: os.comissao_percentual,
          status: "pendente",
          user_id: userId,
          tenant_id: tenantId,
        };
        const { data: comissaoData } = await supabase.from("comissoes").insert([novaComissao]).select();
        if (comissaoData) adicionarComissao(comissaoData[0]);
      }
    }
  }, [tenantId, userId, adicionarComissao]);

  const excluirOrdemServico = useCallback(async (id) => {
    if (!confirm("Excluir ordem de serviço?")) return;
    await supabase.from("ordens_servico").delete().eq("id", id);
    setOrdensServico((prev) => prev.filter((o) => o.id !== id));
  }, []);

  const salvarEvolucao = useCallback(async (osId, textoFinal) => {
    const { data } = await supabase
      .from("ordens_servico")
      .update({ observacoes: textoFinal })
      .eq("id", osId)
      .select();
    if (data) setOrdensServico((prev) => prev.map((o) => (o.id === osId ? data[0] : o)));
    fecharModalEvolucao();
  }, []);

  const abrirModalEncaminhar = useCallback((os) => {
    setOsEncaminhar(os);
    setModalEncaminhar(true);
  }, []);

  const fecharModalEncaminhar = useCallback(() => {
    setModalEncaminhar(false);
    setOsEncaminhar(null);
  }, []);

  const abrirModalEvolucao = useCallback((os) => {
    setOsEvolucao(os);
    setModalEvolucao(true);
  }, []);

  const fecharModalEvolucao = useCallback(() => {
    setModalEvolucao(false);
    setOsEvolucao(null);
  }, []);

  return {
    ordensServico,
    setOrdensServico,
    carregarOrdensServico,
    adicionarOrdemServico,
    encaminharParaTecnico,
    concluirOrdemServico,
    excluirOrdemServico,
    salvarEvolucao,
    modalEncaminhar,
    osEncaminhar,
    abrirModalEncaminhar,
    fecharModalEncaminhar,
    modalEvolucao,
    osEvolucao,
    abrirModalEvolucao,
    fecharModalEvolucao,
  };
}
