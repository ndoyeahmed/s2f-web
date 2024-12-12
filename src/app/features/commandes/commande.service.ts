import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { ResponseDTOPaging } from '../../shared/models/response-dto-paging.model';
import { ToastrService } from 'ngx-toastr';
import { CommandeDTO } from '../../shared/models/commande-dto.model';
import { ProductFilterPayload } from '../../shared/models/product-filter-payload.model';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  // Signal pour stocker la liste des produits
  commandsSignal = signal<CommandeDTO[]>([]);
  currentPageSignal = signal<number>(0); // Page actuelle
  totalElementsSignal = signal<number>(0); // Page actuelle
  totalPagesSignal = signal<number>(0); // Nombre total de pages
  loaderSignal = signal<boolean>(false); // Nombre total de pages
  loaderFormSignal = signal<boolean>(false); // Nombre total de pages
  productPayloadFilter = {
    page: 0,
    size: 5,
  } as ProductFilterPayload;

  constructor(private readonly http: HttpClient, private readonly toastr: ToastrService) {
    this.getAllCommandeByFilters('ENCOURS',
      this.productPayloadFilter.page,
      this.productPayloadFilter.size
    );
  }

  getNewCommandeNumber() {
    return this.http.get(`/api/v1/commande-number`);
  }

  saveCommande(commandeData: any) {
    return this.http.post(`/api/v1/commandes`, commandeData);
  }

  getAllCommandeByFilters(etat = 'ENCOURS',page = 0, size = 5) {
    const options = {
      params: new HttpParams().set('page', page).set('size', size).set('etat', etat)
    };
    return this.http
      .get<ResponseDTOPaging>(`/api/v1/commandes`, options)
      .subscribe({
        next: (response) => {
          this.commandsSignal.set(response.result); // Mettre à jour les commandes
          this.currentPageSignal.set(response.page); // Mettre à jour la page courante
          this.totalPagesSignal.set(response.totalPages); // Mettre à jour le total des pages
          this.totalElementsSignal.set(response.totalElements); // Mettre à jour le total des éléments
          this.loaderSignal.set(true);
        },
        error: (err) => {
          this.loaderSignal.set(true);
          this.toastr.error('Erreur lors du chargement des commandes');
        },
      });
    }

    archiveCommande(commandeId: number) {
      return this.http.delete(`/api/v1/commandes/${commandeId}`);
    }
}

