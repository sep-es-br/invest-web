import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faMagnifyingGlass, faTrash } from "@fortawesome/free-solid-svg-icons";
import { GrupoDTO } from "../../../../utils/models/GrupoDTO";
import { GrupoService } from "../../../../utils/services/grupo.service";
import { tap } from "rxjs/operators";
import { GrupoCadastroComponent } from "../cadastro/grupo-cadastro.component";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { IPodeDTO } from "../../../../utils/models/PodeDto";
import { concat, Observable } from "rxjs";
import { PermissaoService } from "../../../../utils/services/permissao.service";

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
    @ViewChildren("btnRemover") botaoRemoverList : QueryList<ElementRef>

    paginaAtual = 0;

    grupos : GrupoDTO[] = [];

    permissao : IPodeDTO

    constructor(private service : GrupoService, private router : Router,
            private permissaoService : PermissaoService, private acivatedRoute : ActivatedRoute
    ){}

    ngAfterViewInit(): void {
        this.txtBusca.valueChanges.subscribe(nome => {
            this.atualizarLista(this.paginaAtual).subscribe();
        })

        concat(this.atualizarLista(this.paginaAtual),
               this.permissaoService.getPermissao('grupo').pipe(
                tap( permissao => this.permissao = permissao)
               )).subscribe();
    }

    atualizarLista(pagAtual : number) : Observable<GrupoDTO[]> {
        return this.service.findByFilter(this.txtBusca.value, pagAtual, 15).pipe(tap(grupos => {
            this.grupos = grupos;
        }))
    }


    esconderModal(novoGrupo : GrupoDTO) {
        let telaCadastroElem = this.telaCadastroRef.nativeElement as HTMLElement;
        
        telaCadastroElem.classList.add(this.naoMostrar);

        if(novoGrupo) {
            this.service.save(novoGrupo).subscribe(grupoSalvo => {
                if(grupoSalvo) {
                    this.atualizarLista(this.paginaAtual).subscribe();
                    alert("Grupo salvo com sucesso!")
                } else {
                    alert("algum erro ao salvar grupo")
                }
            });
            
        }
            
    }

    remover(grupo : GrupoDTO, evt : MouseEvent){
        
        let btnRemover = false;

        this.botaoRemoverList.forEach(botaoRef => {
            if(botaoRef.nativeElement.contains(evt.target)){
                btnRemover = true;
            }
        });

        if(btnRemover)
            if(confirm("Tem certeza que deseja remover o grupo " + grupo.sigla + "(" + grupo.nome + ")?")){
                this.service.remover(grupo.id).subscribe(grupoRemovido => {
                    if(grupoRemovido) {
                        alert("Grupo " + grupoRemovido.sigla + " removido com sucesso!")
                        this.atualizarLista(this.paginaAtual).subscribe()
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

    navegar(path : string, evt : MouseEvent){

        

        let btnRemover = false;

        this.botaoRemoverList.forEach(botaoRef => {
            if(botaoRef.nativeElement.contains(evt.target)){
                btnRemover = true;
            }
        });

        if(btnRemover) return;
       if(!this.permissao?.visualizar) return;

        this.router.navigate([path], {relativeTo: this.acivatedRoute});
    }

}