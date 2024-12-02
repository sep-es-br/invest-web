import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'customCurrency',
    standalone: true
})
export class CustomCurrencyPipe implements PipeTransform {


    transform(number: number, _args?: any): any {
        
        if (isNaN(number)) return null; // will only work value is a number
        if (number === null) return null;
        
        let treatedNumber = String(new CurrencyPipe('en-US').transform(number, 'BRL')).replace("$", "$ ");
        while(treatedNumber.indexOf('.') > -1)
            treatedNumber = treatedNumber.replace('.', 'x');
        while(treatedNumber.indexOf(',') > -1)
            treatedNumber = treatedNumber.replace(',', '.');
        while(treatedNumber.indexOf('x') > -1)
            treatedNumber = treatedNumber.replace('x', ',');

        return treatedNumber;
    }
}