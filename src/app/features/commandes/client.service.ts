import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ClientDTO } from '../../shared/models/client-dto.model';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CLOSE } from '../../shared/components/form-dialog/form-action-const';
import { FormDialogService } from '../../shared/form-dialog.service';
import { ResponseDTOPaging } from '../../shared/models/response-dto-paging.model';
import { ClientFilter } from '../../shared/client-filter';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private readonly http: HttpClient) { }
  loaderFormSignal = signal<boolean>(false); // Nombre total de pages
  private readonly toastr = inject(ToastrService);
  private readonly modalService = inject(NgbModal);
  private readonly formDialogService = inject(FormDialogService);

  clientSignal = signal<ClientDTO[]>([]);
  currentPageSignal = signal<number>(0); // Page actuelle
  totalElementsSignal = signal<number>(0); // Page actuelle
  totalPagesSignal = signal<number>(0); // Nombre total de pages
  loaderSignal = signal<boolean>(false); // Nombre total de pages
  clientFilter = {
    page: 0,
    size: 5,
  } as ClientFilter;

  addClient(client: any) {
    return this.http.post(`/api/v1/clients`, client);
  }

  getAllClientNotArchived() {
    return this.http.get<ClientDTO[]>(`/api/v1/clients`);
  }
  getAllClientsByFilters(page = 0, size = 5) {
    const options = {
      params: new HttpParams().set('page', page).set('size', size),
    };
    return this.http
      .get<ResponseDTOPaging>(`/api/v1/clients/filter`, options)
      .subscribe({
        next: (response) => {
          this.clientSignal.set(response.result); // Mettre à jour les clients
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

  addClientAndRefresh(client: ClientDTO, form: FormGroup) {
    this.loaderFormSignal.set(true);
    this.addClient(client).subscribe({
      next: () => {
        form.reset();
        client?.id
          ? this.toastr.success('Client ajouté avec succès')
          : this.toastr.success('Client éditer avec succès');
        this.loaderFormSignal.set(false);
        this.modalService.dismissAll();
        this.formDialogService.formdialogSignal.set(CLOSE);
        this.getAllClientsByFilters(
          this.clientFilter.page,
          this.clientFilter.size
        );
      },
      error: (err) => {
        this.toastr.error("Echec de l'opération");
        this.loaderFormSignal.set(false);
      },
    });
  }
}
