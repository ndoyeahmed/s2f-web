import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter',
  standalone: true,
})
export class SearchFilterPipe implements PipeTransform {
  transform(items: any[], value: string): any {
    if (!items) {
      return [];
    }
    if (!value || value === '') {
      return items;
    }

    const keys: string[] = [];
    for (const k in items[0]) {
      keys.push(k);
    }

    return items.filter((item: any) => {
      let find = false;
      keys.forEach((key: string) => {
        if (item[`${key}`]) {
          if (
            item[`${key}`]
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          ) {
            find = true;
          }
        }
      });
      return find;
    });
  }
}
