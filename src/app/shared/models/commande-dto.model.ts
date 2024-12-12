import { ClientDTO } from "./client-dto.model";
import { GlobalModel } from "./global.model";

export interface CommandeDTO extends GlobalModel {
  id: number;
  numero: string;
  date: Date;
  etatCommande: string;
  client: ClientDTO;
  archive: boolean;
}
