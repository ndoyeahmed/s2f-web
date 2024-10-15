import { CategorieDTO } from './categorie-dto.model';

export interface ProductFilterPayload {
  libelle: string;
  categorieDto: CategorieDTO;
  page: number;
  size: number;
}
