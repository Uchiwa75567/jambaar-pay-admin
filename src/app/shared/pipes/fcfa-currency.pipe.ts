import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fcfa', standalone: true })
export class FcfaCurrencyPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null) return '—';
    const formatted = new Intl.NumberFormat('fr-FR').format(value);
    return `${formatted} Fcfa`;
  }
}
