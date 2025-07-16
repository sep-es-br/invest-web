export function cleanApoc(input: string): string {
  if (!input) return "";

  return input
    // 1. Normaliza acentos
    .normalize("NFD")
    // 2. Remove marcas diacríticas (acentos, etc.)
    .replace(/[\u0300-\u036f]/g, "")
    // 3. Remove tudo que não seja letra, número ou espaço
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    // 4. Substitui múltiplos espaços por um só
    .replace(/\s+/g, " ")
    // 5. Converte para minúsculo
    .toLowerCase()
    // 6. Remove espaços nas bordas
    .trim();
}