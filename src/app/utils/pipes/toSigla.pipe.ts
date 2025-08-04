import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'toSigla',
    standalone: true
})
export class ToSiglaPipe implements PipeTransform {


    transform(txt: string, _args?: any): any {
        
        return txt.split(' ').map(n => n.substring(0, 1)).join('');
    }
}