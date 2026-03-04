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

export const isMobile = () => {
  return screen.width <= 940;
}

export function toIsoZonedDateTime(date: Date): string {
    const pad = (num: number) => num.toString().padStart(2, '0');
    
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    // O offset no JS é invertido (minutos que faltam/sobram para o UTC)
    const tzOffset = -date.getTimezoneOffset();
    const diff = tzOffset >= 0 ? '+' : '-';
    const tzHours = pad(Math.floor(Math.abs(tzOffset) / 60));
    const tzMin = pad(Math.abs(tzOffset) % 60);

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${diff}${tzHours}:${tzMin}`;
}