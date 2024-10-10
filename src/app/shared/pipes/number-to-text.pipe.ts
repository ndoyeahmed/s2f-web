import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'numberToText', standalone: true })
export class NumberToTextPipe implements PipeTransform {
  transform(value: number): string {
    const units = [
      '',
      'un',
      'deux',
      'trois',
      'quatre',
      'cinq',
      'six',
      'sept',
      'huit',
      'neuf',
    ];
    const tens = [
      '',
      '',
      'vingt',
      'trente',
      'quarante',
      'cinquante',
      'soixante',
      'soixante-dix',
      'quatre-vingt',
      'quatre-vingt-dix',
    ];
    const teens = [
      'dix',
      'onze',
      'douze',
      'treize',
      'quatorze',
      'quinze',
      'seize',
      'dix-sept',
      'dix-huit',
      'dix-neuf',
    ];

    let result = '';

    if (value < 0 || value > 999) {
      return 'Nombre invalide';
    }

    if (value === 0) {
      return 'zéro';
    }

    if (value >= 100) {
      result += `${units[Math.floor(value / 100)]} cent `;
      value %= 100;
    }

    if (value >= 20) {
      if (value >= 70 && value <= 79) {
        result += `${tens[7]} `;
        value -= 60;
      } else if (value >= 80 && value <= 89) {
        result += `${tens[8]} `;
        value -= 80;
      } else if (value >= 90 && value <= 99) {
        result += `${tens[9]} `;
        value -= 90;
      } else {
        result += `${tens[Math.floor(value / 10)]} `;
        value %= 10;
        if (
          (value === 1 || value === 11) &&
          result[result.length - 2] !== ' '
        ) {
          result = result.slice(0, -1);
          result += '-';
        }
      }
    } else if (value >= 10) {
      result += `${teens[value - 10]} `;
      value = 0;
    }

    if (value > 0) {
      result += `${units[value]} `;
    }

    return result.trim();
  }
}
