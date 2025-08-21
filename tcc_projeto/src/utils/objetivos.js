export const OBJETIVOS = {
  "1": "Nutrição Clínica",
  "2": "Nutrição Pediátrica",
  "3": "Nutrição Esportiva",
  "4": "Emagrecimento e Obesidade",
  "5": "Intolerâncias Alimentares",
};

export function objetivoLabel(valor) {
  if (valor == null) return "";
  const key = String(valor);
  return OBJETIVOS[key] || "";
}