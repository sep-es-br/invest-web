import { AfterViewInit, ComponentRef, Directive, ElementRef, Input, OnDestroy, Renderer2, Type } from "@angular/core";

@Directive({
    standalone: true,
    selector: '[overlay]'
})
export class OverlayDirective implements AfterViewInit, OnDestroy {

    @Input('overlay') parent : HTMLElement | string ;
    @Input() left : string;
    @Input() right : string;
    @Input() top : string;
    @Input() bottom : string;
    
    private overlayEl : HTMLElement;

    private originalParent: HTMLElement;
    private originalNextSibling: Node | null;

    constructor(
        private renderer : Renderer2,
        private hostRef: ElementRef<HTMLElement>
    ){
    }

    ngOnDestroy() {
        if(this.overlayEl) {
            // remover overlay
            this.renderer.removeChild(document.body, this.overlayEl);
        }
        
    }

    ngAfterViewInit(): void {
        if (!this.parent) {
            const hostElem = this.hostRef.nativeElement;

            this.originalNextSibling = hostElem.nextSibling;
            this.originalParent = hostElem.parentNode as HTMLElement;

            this.overlayEl = this.renderer.createElement('div');
            this.renderer.setStyle(this.overlayEl , 'position', 'fixed');
            this.renderer.setStyle(this.overlayEl , 'height', '100vh');
            this.renderer.setStyle(this.overlayEl , 'width', '100vw');
            this.renderer.setStyle(this.overlayEl , 'top', 0);
            this.renderer.setStyle(this.overlayEl , 'left', 0);
            this.renderer.setStyle(this.overlayEl , 'background-color', 'rgba(0, 0, 0, 0.5)');
            this.renderer.setStyle(this.overlayEl , 'display', 'flex');
            this.renderer.setStyle(this.overlayEl , 'justify-content', 'center');
            this.renderer.setStyle(this.overlayEl , 'align-items', 'center');

            this.renderer.setStyle(hostElem, 'background-color', 'white')

            this.renderer.appendChild(document.body, this.overlayEl );
            this.renderer.appendChild(this.overlayEl , hostElem)


            
        } else {
            this.renderer.setStyle(this.hostRef.nativeElement, 'position', 'fixed')

            const parent = this.parent as HTMLElement;

            const parentBBox = parent.getBoundingClientRect()

            const calc = (value: string | undefined, refSize: number) => {
                if (!value) return 0;
                if (value.includes('%')) {
                    return (Number(value.replace('%', '')) / 100) * refSize;
                }
                return Number(value);
            };

            const leftPx = this.left
                ? parentBBox.left + calc(this.left, parentBBox.width)
                : parentBBox.left;

            const topPx = this.top
                ? parentBBox.top + calc(this.top, parentBBox.height)
                : parentBBox.bottom;

            // aplica posição ao overlay
            const hostEl = this.hostRef.nativeElement;
            this.renderer.setStyle(hostEl, 'left', `${leftPx}px`);
            this.renderer.setStyle(hostEl, 'top', `${topPx}px`);            
        }

    
        

    }

}