import { IItemMenu } from "./IItemMenu";

export const menuLinks : IItemMenu[] = [
    {
        titulo: "Inventário",
        icone: "home",
        link: "/inventario",
        ativo: true,
        subItens: [
            {
                titulo: "Investimentos",
                link: "/investimentos",
                ativo: true
            }
        ]
    }, {
        titulo : "Minha Carteira",
        icone : "archive",
        link: "/carteira",
        ativo: true, 
        subItens: [
            {
                titulo: "Investimentos",
                link: "/investimentos",
                ativo: true
            }, {
                titulo: "Objetos",
                link: "/objetos",
                ativo: true
            }
        ]
    }, {
        icone: "graph",
        ativo: false
    }
]
