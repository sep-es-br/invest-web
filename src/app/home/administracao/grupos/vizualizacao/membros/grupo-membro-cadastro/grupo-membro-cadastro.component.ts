import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from "@angular/core";
import { IProfile } from "../../../../../../utils/interfaces/profile.interface";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UnidadeOrcamentariaDTO } from "../../../../../../utils/models/UnidadeOrcamentariaDTO";
import { ISetorDTO, setorTodos } from "../../../../../../utils/models/SetorDTO";
import { InfosService } from "../../../../../../utils/services/infos.service";
import { IPapelDTO, papelTodos } from "../../../../../../utils/models/PapelDto";
import { ICadastroMembroForm } from "./CadastroMembroForm";
import { GrupoService } from "../../../../../../utils/services/grupo.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { NgSelectModule } from "@ng-select/ng-select";
import { IOrgaoDTO } from "../../../../../../utils/models/OrgaoDTO";
import { OrgaoService } from "../../../../../../utils/services/orgao.service";
import { merge, tap } from "rxjs";

@Component({
    selector: "spo-grupo-membro-cadastro",
    standalone: true,
    templateUrl: "./grupo-membro-cadastro.component.html",
    styleUrl: "./grupo-membro-cadastro.component.scss",
    imports: [
        CommonModule, ReactiveFormsModule, FontAwesomeModule, FormsModule,
        NgSelectModule
    ]
})
export class GrupoMembroCadastroComponent implements AfterViewInit {

    @Output() onClose = new EventEmitter<ICadastroMembroForm>();

    @ViewChild("principal", {read: ElementRef}) principalRef : ElementRef;

    form : FormGroup;


    iconFechar = faXmark;

    unidades : UnidadeOrcamentariaDTO[] = [];
    orgaos : IOrgaoDTO[] = [];

    setores : ISetorDTO[] = [];
    papeis : IPapelDTO[] = [];

    papelTodos = papelTodos;
    setorTodos = setorTodos;

    fora = true;

    cadastroForm : ICadastroMembroForm = {
        orgao: undefined,
        setor: undefined,
        papel: undefined
    };

    constructor(
        private infosService: InfosService,
        private fb : FormBuilder,
        private grupoService : GrupoService,
        private orgaoService : OrgaoService
    ) {

        this.form = this.fb.group({
            unidade: [undefined],
            setor: [{value: undefined, disabled: true}],
            papel: [{value: undefined, disabled: true}]
        });

        this.form.get("unidade").valueChanges.subscribe((novoValor : UnidadeOrcamentariaDTO) => {
            const selectSetor = this.form.get('setor');

            if(novoValor){
                this.infosService.getSetores(novoValor.guid).subscribe(setoresList => {
                    this.setores = setoresList;
                    selectSetor?.setValue(null);
                    selectSetor?.enable();
                });

            } else {
                this.setores = [];
                selectSetor?.setValue(null);
                selectSetor?.disable();
            }
            
        })

        this.form.get("setor").valueChanges.subscribe((novoValor : ISetorDTO) => {
            const selectPapel = this.form.get('papel');

            if(novoValor){
                this.infosService.getPapeis(novoValor.guid).subscribe(papeisList => {
                    
                    this.grupoService.grupoSession.subscribe(grupo => {
                        let subList = grupo.membros.map(user => user.sub);

                        this.papeis = papeisList.filter(papel => subList.indexOf(papel.agenteSub) < 0)
                    })

                })

                selectPapel?.enable();
            } else {
                selectPapel?.setValue(null);
                selectPapel?.disable();
            }
        })
        
        this.infosService.getUnidades().subscribe(unidadeList => {
            this.unidades = unidadeList;
        });
    }

    ngAfterViewInit(): void {
        merge(
            this.orgaoService.getOrgaosSigefes().pipe(
                tap(orgaos => this.setOrgaos(orgaos))
            )
        ).subscribe()
    }

    preencherSetores(orgao : IOrgaoDTO) {

        if(orgao){
            this.infosService.getSetores(orgao.guid).subscribe(setoresList => {
                this.setores = [ setorTodos, ...setoresList];
                this.cadastroForm.setor = undefined;
            });

        } else {
            this.setores = [];
            this.cadastroForm.setor = undefined;
        }
           
    }

    preencherPapeis(setor : ISetorDTO) {

        if(setor && setor !== setorTodos){
            this.infosService.getPapeis(setor.guid).subscribe(papeisList => {
                
                this.grupoService.grupoSession.subscribe(grupo => {
                    let subList = grupo.membros.map(user => user.papel);

                    this.papeis = [papelTodos, ...papeisList.filter(papel => subList.indexOf(papel.nome) < 0)] 
                    this.cadastroForm.papel = undefined
                })

            })

        } else {
            this.cadastroForm.papel = undefined;
        }

           
    }

    setOrgaos(orgaos : IOrgaoDTO[]){
        this.orgaos = orgaos;
    }
  
    @HostListener("click", ["$event"])
    clickFora (event : MouseEvent) {
        if(!this.principalRef.nativeElement.contains(event.target)){
            this.fechar(null);
        }        
    }


    fechar(cadastroForm : ICadastroMembroForm) {
        this.onClose.emit({...cadastroForm});
        this.cadastroForm.orgao = undefined;
        this.cadastroForm.setor = undefined;
        this.cadastroForm.papel = undefined;
    }

    salvar() {
       
        if(this.cadastroForm.setor === setorTodos)
            this.cadastroForm.setor = undefined

        if(this.cadastroForm.papel === papelTodos)
            this.cadastroForm.papel = undefined

        this.fechar(this.cadastroForm);
    }

    searchOrgao(term : string, orgao : IOrgaoDTO) : boolean {
        return orgao.nome.toLowerCase().includes(term.toLowerCase())
            || orgao.sigla?.toLowerCase().includes(term.toLowerCase());
    }

    searchSetor(term : string, setor : ISetorDTO) : boolean {
        return setor.nome.toLowerCase().includes(term.toLowerCase())
            || setor.sigla?.toLowerCase().includes(term.toLowerCase());
    }

    searchPapel(term : string, setor : IPapelDTO) : boolean {
        return setor.nome.toLowerCase().includes(term.toLowerCase())
            || setor.agenteNome?.toLowerCase().includes(term.toLowerCase());
    }
}