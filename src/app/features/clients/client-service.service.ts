import { inject, Injectable, signal } from '@angular/core';
import { CategorieDTO } from '../../shared/models/categorie-dto.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ResponseDTOPaging } from '../../shared/models/response-dto-paging.model';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormDialogService } from '../../shared/form-dialog.service';
import { CLOSE } from '../../shared/components/form-dialog/form-action-const';
import { ClientDTO } from '../../shared/models/client-dto.model';
import { ClientFilter } from '../../shared/client-filter';

@Injectable({
  providedIn: 'root'
})
export class ClientServiceService {
  private readonly toastr = inject(ToastrService);
  private readonly modalService = inject(NgbModal);
  private readonly formDialogService = inject(FormDialogService);

  clientSignal = signal<ClientDTO[]>([]);
  currentPageSignal = signal<number>(0); // Page actuelle
  totalElementsSignal = signal<number>(0); // Page actuelle
  totalPagesSignal = signal<number>(0); // Nombre total de pages
  loaderSignal = signal<boolean>(false); // Nombre total de pages
  loaderFormSignal = signal<boolean>(false); // Nombre total de pages
  clientFilter = {
    page: 0,
    size: 5,
  } as ClientFilter;

  constructor(private readonly http: HttpClient) {
    this.getAllClientsByFilters(
      this.clientFilter.page,
      this.clientFilter.size
    );
  }

  getAllClientsByFilters(page = 0, size = 5) {
    const options = {
      params: new HttpParams().set('page', page).set('size', size),
    };
    return this.http
      .get<ResponseDTOPaging>(`/api/v1/clients/filter`, options)
      .subscribe({
        next: (response) => {
          this.clientSignal.set(response.result); // Mettre à jour les produits
          this.currentPageSignal.set(response.page); // Mettre à jour la page courante
          this.totalPagesSignal.set(response.totalPages); // Mettre à jour le total des pages
          this.totalElementsSignal.set(response.totalElements); // Mettre à jour le total des éléments
          this.loaderSignal.set(true);
        },
        error: (err) => {
          this.loaderSignal.set(true);
          this.toastr.error('Erreur lors du chargement des clients');
        },
      });
  }

  getAllClienttsNotArchived() {
    return this.http.get<ResponseDTOPaging>(`/api/v1/clients/filter`);
  }
}
