import { MesureDTO } from "./mesure-dto.model";

export interface ClientDTO {
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  archive: boolean;
  mesures: MesureDTO[];
}
