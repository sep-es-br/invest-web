import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faMagnifyingGlass, faTrash } from "@fortawesome/free-solid-svg-icons";
import { GrupoDTO } from "../../../../utils/models/GrupoDTO";
import { GrupoService } from "../../../../utils/services/grupo.service";
import { tap } from "rxjs/operators";
import { GrupoCadastroComponent } from "../cadastro/grupo-cadastro.component";
import { Router, RouterLink } from "@angular/router";

@Component({
    standalone: true,
    templateUrl: "./grupo-lista.component.html",
    styleUrl: "./grupo-lista.component.scss",
    imports: [CommonModule, FontAwesomeModule, ReactiveFormsModule, GrupoCadastroComponent, RouterLink]
})
export class GrupoListaComponent implements AfterViewInit{
    readonly searchIcon = faMagnifyingGlass;
    readonly lixeira = faTrash;
    readonly naoMostrar = "naoMostar";
    
    txtBusca = new FormControl(null);

    @ViewChild(GrupoCadastroComponent, {read: ElementRef}) private telaCadastroRef : ElementRef;

    paginaAtual = 0;

    grupos : GrupoDTO[] = [];

    constructor(private service : GrupoService, private router : Router){}

    ngAfterViewInit(): void {
        this.txtBusca.valueChanges.subscribe(nome => {
            this.atualizarLista(this.paginaAtual);
        })
        
        this.atualizarLista(this.paginaAtual);
    }

    atualizarLista(pagAtual : number) {
        this.service.findByFilter(this.txtBusca.value, pagAtual, 15).pipe(tap(grupos => {
            this.grupos = grupos;
        })).subscribe()
    }

    vizualizarGrupo(id : string) {

        this.router.navigate([id]);
    }


    esconderModal(novoGrupo : GrupoDTO) {
        let telaCadastroElem = this.telaCadastroRef.nativeElement as HTMLElement;
        
        telaCadastroElem.classList.add(this.naoMostrar);

        if(novoGrupo) {
            this.service.save(novoGrupo).subscribe(grupoSalvo => {
                if(grupoSalvo) {
                    this.atualizarLista(this.paginaAtual);
                    alert("Grupo salvo com sucesso!")
                } else {
                    alert("algum erro ao salvar grupo")
                }
            });
            
        }
            
    }

    remover(grupo : GrupoDTO){

        if(confirm("Tem certeza que deseja remover o grupo " + grupo.sigla + "(" + grupo.nome + ")?")){
            this.service.remover(grupo.id).subscribe(grupoRemovido => {
                if(grupoRemovido) {
                    alert("Grupo " + grupoRemovido.sigla + " removido com sucesso!")
                    this.atualizarLista(this.paginaAtual)
                } else {
                    alert("não foi possivel remover o grupo " + grupo.sigla)
                }
            })
        }

    }

    mostrarModal() {
        let telaCadastroElem = this.telaCadastroRef.nativeElement as HTMLElement;
        
        telaCadastroElem.classList.remove(this.naoMostrar);
    }

}