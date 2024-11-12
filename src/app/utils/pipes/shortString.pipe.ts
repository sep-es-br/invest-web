import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'shortString',
    standalone: true
})
export class ShortStringPipe implements PipeTransform {


    transform(value: any, maxChar?: number): any {
        
        if (maxChar === undefined) 
            return value;
        

        let str = String(value);

        if(str.length <= maxChar)
            return str
        
        let novaStr = str.substring(0, maxChar) + ' ...'

        return novaStr;
            

    }
}