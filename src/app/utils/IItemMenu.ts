import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export interface IItemMenu {
    titulo?: string,
    icone?: string | IconDefinition,
    ativo: boolean,
    link? : string,
    subItens? : IItemMenu[]
}