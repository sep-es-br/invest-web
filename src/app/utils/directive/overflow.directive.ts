import { AfterViewInit, ComponentRef, Directive, ElementRef, Input, Renderer2, Type } from "@angular/core";

@Directive({
    standalone: true,
    selector: '[overlay]'
})
export class OverlayDirective implements AfterViewInit {

    @Input('overlay') parent : HTMLElement ;
    @Input() left : string;
    @Input() right : string;
    @Input() top : string;
    @Input() bottom : string;

    constructor(
        private renderer : Renderer2,
        private hostRef: ElementRef<HTMLElement>
    ){
    }

    ngAfterViewInit(): void {
        this.renderer.setStyle(this.hostRef.nativeElement, 'position', 'fixed')
        if (!this.parent) {
            throw new Error('[overlay]: situação não implementada ainda');
        } else {
            const parentBBox = this.parent.getBoundingClientRect()

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