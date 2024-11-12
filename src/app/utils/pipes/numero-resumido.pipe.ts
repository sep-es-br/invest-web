import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numeroResumido',
  standalone: true
})
export class NumeroResumidoPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): string | null {
    if (isNaN(value)) return null; // will only work value is a number
    if (value === null) return null;
    let abs = Math.abs(value);
    const rounder = Math.pow(10, 1);
    const isNegative = value < 0; // will also work for Negative numbers
    let key = '';

    const powers = [
        {key: 'Q', value: Math.pow(10, 15)},
        {key: 'T', value: Math.pow(10, 12)},
        {key: 'bi', value: Math.pow(10, 9)},
        {key: 'M', value: Math.pow(10, 6)},
        {key: 'mil', value: 1000}
    ];

    for (let i = 0; i < powers.length; i++) {
        let reduced = abs / powers[i].value;
        reduced = Math.round(reduced * rounder) / rounder;
        if (reduced >= 1) {
            abs = reduced;
            key = powers[i].key;
            break;
        }
    }
    return (isNegative ? '-' : '') + String(abs).replace('.', ',') + ' ' + key;
  }

}
