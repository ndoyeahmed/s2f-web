import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {

  constructor(private readonly http: HttpClient) { }

  getNewCommandeNumber() {
    return this.http.get(`/api/v1/commande-number`);
  }

  saveCommande(commandeData: any) {
    return this.http.post(`/api/v1/commande`, commandeData);
  }
}
