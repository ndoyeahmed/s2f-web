import { Injectable } from '@angular/core';
import { CategorieDTO } from '../../shared/models/categorie-dto.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private readonly http: HttpClient) {}

  addCategory(category: CategorieDTO) {
    return this.http.post(`/api/v1/category`, category);
  }

  getAllCategories() {
    return this.http.get<CategorieDTO[]>(`/api/v1/categories`);
  }
}
