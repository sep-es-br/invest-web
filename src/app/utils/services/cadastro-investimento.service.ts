import { Injectable } from "@angular/core";
import { BehaviorSubject, EMPTY, filter, firstValueFrom, forkJoin, Observable, switchMap } from "rxjs";
import { IContaDetail } from "../interfaces/conta-detail.interface";
import { IObjetoDetail } from "../interfaces/objetoDetail.interface";
import { NavigationEnd, Router } from "@angular/router";
import { IInvestimentoCadastro } from "../interfaces/investimento-cadastro.interface";
import { PlanoOrcamentarioDTO } from "../models/PlanoOrcamentarioDTO";
import { PlanoOrcamentarioService } from "./planoOrcamentario.service";
import { UnidadeOrcamentariaService } from "./unidadeOrcamentaria.service";
import { UnidadeOrcamentariaDTO } from "../models/UnidadeOrcamentariaDTO";
import { IObjetoCadastroForm, ICusto as CadastroCusto, IValoresFonte as CadastroValoresFonte } from "../interfaces/objeto-cadastro-form.interface";
import { IFonteExercicio } from "../../home/carteira/objetos/cadastro/fonte-exercicio.interface";
import { FonteOrcamentariaService } from "./fonteOrcamentaria.service";
import { InvestimentosService } from "./investimentos.service";
import { IConta } from "../interfaces/IConta";
import { FonteOrcamentariaDTO } from "../models/FonteOrcamentariaDTO";
import { ObjetosService } from "./objetos.service";


@Injectable({providedIn: 'root'})
export class CadastroInvestimentoService {

    private readonly investimentoKey = 'investimento';
    private readonly objAtivoKey = 'objAtivo'
    private $investimento = new BehaviorSubject<IContaDetail>(this.loadInvestimento());

    constructor(
        private router: Router,
        private fonteSrv : FonteOrcamentariaService,
        private investimentoSrv: InvestimentosService,
        private objetoSrv: ObjetosService
    ) {
        
        this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
            const rotaAtual = event.urlAfterRedirects;
    
            const saiuDoCadastro =  !/\/carteira\/investimentos\/\d+\/editar/.test(rotaAtual)
                                    && !/\/carteira\/investimentos\/novo/.test(rotaAtual);
    
            if(saiuDoCadastro) {
                this.investimento = undefined;
                this.objAtivo = undefined;
            }
        })
    }

    set objAtivo(ativo: number){
        if(ativo !== undefined) {
            sessionStorage.setItem(this.objAtivoKey, String(ativo));
        } else {
            sessionStorage.removeItem(this.objAtivoKey);
        }
        
    }

    get objAtivo() {
        let raw = sessionStorage.getItem(this.objAtivoKey);
        return raw && Number(raw);
    }

    private loadInvestimento() {
        let raw = sessionStorage.getItem(this.investimentoKey);
        return raw && JSON.parse(raw);
    }

    get investimentoObs() {
        return this.$investimento.asObservable();
    }

    get investimento() {
        return this.$investimento.value;
    }

    set investimento(investimento : IContaDetail) {
        this.$investimento.next(investimento);
        if(investimento) sessionStorage.setItem(this.investimentoKey, JSON.stringify(investimento));
        else sessionStorage.removeItem(this.investimentoKey)
    }

    addNovoObjeto() : number {
        let objeto : IObjetoDetail = {
            tipoInvestimento: "Investimento",
            tipoObjeto: "Projeto",
            codPlano: this.investimento.codPO,
            codUnidade: this.investimento.codUnidade,
            tiposPlano: [],
            new: true
        } as IObjetoDetail;

        const objList = this.investimento.objetos;

        objList.push(objeto);

        const novoInvestimento = {
            ...this.investimento,
            objetos: objList
        }

        this.investimento = novoInvestimento;

        return this.investimento.objetos.indexOf(objeto);
    }

    patchValueInvestimento(value: Partial<IContaDetail>) {
        this.investimento = {
            ...this.investimento,
            ...value
        }
    }

    patchValueObjeto(value: Partial<IObjetoDetail>) {
        if(this.objAtivo === undefined) return;

        const investimentoAtual = this.investimento;

        const novoInvestimento = {
            ...investimentoAtual,
            objetos: investimentoAtual.objetos.map((obj, index) =>
                index === this.objAtivo
                ? { ...obj, ...value }
                : obj
            )
        };

        this.investimento = novoInvestimento;
    }

    newInvestimento(){
        return {
            tipo: 'Investimento'
        } as IContaDetail;
    }

    async removerObjeto (index: number) {
        let objetoRemovido = this.investimento.objetos[index];

        const novaLista = this.investimento.objetos.filter((obj) => obj != objetoRemovido);

        const novoInvestimento = {
            ...this.investimento,
            objetos: novaLista
        }

        this.investimento = novoInvestimento;

        if(objetoRemovido.id){
            await firstValueFrom(this.objetoSrv.removerObjeto(objetoRemovido.id));
        }
    }

    async salvar(plano: PlanoOrcamentarioDTO, unidade: UnidadeOrcamentariaDTO) : Promise<Observable<IContaDetail>>{

        const fontes = this.investimento.objetos
                        .flatMap(objetos => Object.values(objetos.custos))
                        .flatMap(custos => Object.keys(custos))


        const fonteMap = [...new Set(fontes)].reduce<Record<string, Observable<FonteOrcamentariaDTO>>>((acc, codigo) => {
            acc[codigo] = this.fonteSrv.findByCodigo(codigo);
            return acc;
        }, {});

        let fontesValues = Object.entries(fonteMap).length > 0 ? await firstValueFrom(forkJoin(fonteMap)) : {}; 
        
        const novoInvestimento = {
            id: this.investimento.id,
            tipo: this.investimento.tipo,
            nome: this.investimento.nome,
            descricao: this.investimento.descricao,
            codUnidade: unidade.codigo,
            siglaUnidade: unidade.sigla,
            codPo: plano.codigo,
            nomePo: plano.nome,
            objetos: this.investimento.objetos.map(
                obj => {
                    let recursosFinanceiros = []

                    Object.entries(obj.custos).forEach(([anoStr, fontes]) => {
                        const _fontes = [] as IFonteExercicio[];
                        
                        Object.entries(fontes).forEach(([codFonte, valores]) => {
                            const { planejado, contratado } = valores;
                            
                            _fontes.push({
                                fonteOrcamentaria: fontesValues[codFonte],
                                planejado,
                                contratado
                            } as IFonteExercicio)
                            
                        })

                        recursosFinanceiros.push( {
                            anoExercicio: Number(anoStr),
                            indicadaPor: _fontes
                        })
                    })

                    let objetoForm : IObjetoCadastroForm = {
                        id: obj.id,
                        tipoConta: obj.tipoInvestimento,
                        tipo: obj.tipoObjeto,
                        areaTematicaId: obj.idArea,
                        contrato: obj.contrato,
                        descricao: obj.descricao,
                        hashProposta: obj.hashProposta,
                        infoComplementares: obj.infoComplementar,
                        microregiaoId: obj.microrregiaoId,
                        nome: obj.nome,
                        planoOrcamentario: plano,
                        planos: obj.tiposPlano,
                        possuiOrcamento: obj.possuiOrcamento,
                        unidadeOrcamentaria: unidade,
                        recursos: recursosFinanceiros.map(
                            custo => ({
                                ano: custo.anoExercicio,
                                valoresFontes: custo.indicadaPor.map(
                                    indiPor => ({
                                        fonte: indiPor.fonteOrcamentaria,
                                        contratado: indiPor.contratado,
                                        planejado: indiPor.planejado
                                    } as CadastroValoresFonte)
                                )
                            })
                        )  
                    };

                    return objetoForm;
                }
            )
        } as IInvestimentoCadastro;

        return this.investimentoSrv.salvar(novoInvestimento)
        
    }

}