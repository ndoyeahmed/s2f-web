import { GlobalModel } from "./global.model";
import { ProduitDTO } from "./produit-dto.model";

export interface CommandeProduitDTO extends GlobalModel {
  id: number;
  quantite: number;
  prixVente: number;
  produit: ProduitDTO;
}
