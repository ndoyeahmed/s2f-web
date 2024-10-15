import { CategorieDTO } from './categorie-dto.model';
import { GlobalModel } from './global.model';

export interface ProduitDTO extends GlobalModel {
  id: number;
  libelle: string;
  description: string;
  prix: number;
  categorieDto: CategorieDTO;
  archive: boolean;
}
