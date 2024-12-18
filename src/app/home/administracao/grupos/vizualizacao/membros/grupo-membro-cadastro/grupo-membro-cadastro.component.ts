import { CommonModule } from "@angular/common";
import { Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from "@angular/core";
import { IProfile } from "../../../../../../utils/interfaces/profile.interface";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { UnidadeOrcamentariaDTO } from "../../../../../../utils/models/UnidadeOrcamentariaDTO";
import { ISetorDTO } from "../../../../../../utils/models/SetorDTO";
import { InfosService } from "../../../../../../utils/services/infos.service";
import { IPapelDTO, papelTodos } from "../../../../../../utils/models/PapelDto";
import { ICadastroMembroForm } from "./CadastroMembroForm";
import { GrupoService } from "../../../../../../utils/services/grupo.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: "spo-grupo-membro-cadastro",
    standalone: true,
    templateUrl: "./grupo-membro-cadastro.component.html",
    styleUrl: "./grupo-membro-cadastro.component.scss",
    imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule]
})
export class GrupoMembroCadastroComponent {

    @Output() onClose = new EventEmitter<ICadastroMembroForm>();

    @ViewChild("principal", {read: ElementRef}) principalRef : ElementRef;

    form : FormGroup;


    iconFechar = faXmark;

    unidades : UnidadeOrcamentariaDTO[] = [];
    setores : ISetorDTO[] = [];
    papeis : IPapelDTO[] = [];

    papelTodos = papelTodos;

    fora = true;

    constructor(
        private infosService: InfosService,
        private fb : FormBuilder,
        private grupoService : GrupoService
    ) {

        this.form = this.fb.group({
            unidade: [null],
            setor: [{value: null, disabled: true}],
            papel: [{value: null, disabled: true}]
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
  
    @HostListener("click", ["$event"])
    clickFora (event : MouseEvent) {
        if(!this.principalRef.nativeElement.contains(event.target)){
            this.fechar();
        }        
    }


    fechar() {
        this.form.get("unidade").setValue(null),
        this.form.get("setor").setValue(null),
        this.form.get("papel").setValue(null)
        this.onClose.emit(null);
    }

    salvar() {

        const papelSelecionado = this.form.get("papel").value as IPapelDTO;

        let cadastroMembroForm : ICadastroMembroForm;

        if(papelSelecionado.guid === papelTodos.guid) {
            cadastroMembroForm = {
                orgao: this.form.get("unidade").value,
                setor: this.form.get("setor").value,
                papeis: this.papeis
            }
        } else {
            cadastroMembroForm = {
                orgao: this.form.get("unidade").value,
                setor: this.form.get("setor").value,
                papeis: [papelSelecionado]
            }
        }
 
        this.form.get("unidade").setValue(null);
        this.form.get("setor").setValue(null);
        this.form.get("papel").setValue(null);

        
        this.form.get("setor").disable({onlySelf: true});
        this.form.get("papel").disable({onlySelf: true});

        this.onClose.emit(cadastroMembroForm);
    }
}