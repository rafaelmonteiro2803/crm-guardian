export const CATEGORIAS_ESTOQUE = [
  { value: "cosmetico", label: "Cosméticos" },
  { value: "insumo", label: "Insumos" },
  { value: "descartavel", label: "Descartáveis" },
  { value: "produto_revenda", label: "Produto de Revenda" },
  { value: "equipamento", label: "Equipamentos" },
  { value: "material_limpeza", label: "Material de Limpeza" },
  { value: "embalagem", label: "Embalagens" },
  { value: "outro", label: "Outros" },
];

export const getCategorialLabel = (v) =>
  CATEGORIAS_ESTOQUE.find((c) => c.value === v)?.label || v;
