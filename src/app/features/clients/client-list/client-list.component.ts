import { Component, EventEmitter, inject, Input, Output, TemplateRef } from '@angular/core';
import { FormDialogComponent } from '../../../shared/components/form-dialog/form-dialog.component';
import { ClientFormComponent } from '../../commandes/pages/client-form/client-form.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { TableSkeletonPlaceholderComponent } from '../../../shared/components/table-skeleton-placeholder/table-skeleton-placeholder.component';
import { fade, fadeSlide } from '../../../shared/animations/animations';
import { ClientServiceService } from '../client-service.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogService } from '../../../shared/confirm-dialog.service';
import { ClientDTO } from '../../../shared/models/client-dto.model';
import { ClientFilter } from '../../../shared/client-filter';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { MesureDTO } from '../../../shared/models/mesure-dto.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    ClientFormComponent,
    TableSkeletonPlaceholderComponent,
    ConfirmDialogComponent,
    FormsModule ,ReactiveFormsModule
  ],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.scss',
  animations: [fade, fadeSlide],
})
export class ClientListComponent {
  clientService = inject(ClientServiceService);
  private readonly toastr = inject(ToastrService);
  private readonly modalService = inject(NgbModal);
  private readonly confirmDialogService = inject(ConfirmDialogService);
  mesures: MesureDTO[] = [];
  client: ClientDTO = { nom: '', prenom: '', telephone: '', id: 0, archive: false ,mesures: []};

  clientForm!: FormGroup;
  subscriptions = [] as Subscription[];
  formDialogOptions: NgbModalOptions = {
    size: 'lg',
    backdrop: 'static',
  };
  searchForm: any;

  @Output() afterSave = new EventEmitter();
  closeResult = '';

  clients!: ClientDTO[];
  clientFilter = {
    page: 0,
    size: 5,
  } as ClientFilter;
  @Input() clientEdit!: ClientDTO;

  constructor(private readonly fb: FormBuilder){}

  // Charger la page précédente
  previousPage() {
    const currentPage = this.clientService.currentPageSignal();
    if (currentPage > 0) {
      const productPayloadFilter = {
        page: currentPage - 1,
        size: 5,
      } as ClientFilter;
      this.clientService.getAllClientsByFilters(
        productPayloadFilter.page,
        productPayloadFilter.size
      );
    }
  }
  ngOnInit() {
    this.getAllClientNotArchived();
  }

  // Charger la page suivante
  nextPage() {
    const currentPage = this.clientService.currentPageSignal();
    const totalPages = this.clientService.totalPagesSignal();
    if (currentPage + 1 < totalPages) {
      const clientFilter = {
        page: currentPage + 1,
        size: 5,
      } as ClientFilter;
      this.clientService.getAllClientsByFilters(
        clientFilter.page,
        clientFilter.size
      );
    }
  }

  afterClientSaved(event: any) {
    this.getAllClientNotArchived();
  }
  getAllClientNotArchived() {
    this.clientService.getAllClientNotArchived().subscribe(
      (data: ClientDTO[]) => {
        this.clients = data;
      },
      (err: any) => console.log('error getting clients')
    );
  }

  ////////////////////////filter////////////////////////
  onSelectedFilterType(event: any) {
  }
  /* onSearch() {
    const currentPage = this.clientService.currentPageSignal();
    const totalPages = this.clientService.totalPagesSignal();

    if (this.searchForm.valid) {
      this.subscriptions.push(
        this.clientService
          .getAllClientsByFilters(this.searchForm.value.filterType, this.searchForm.value.searchTerm)
          .subscribe(
            (data: any) => {
              const clientFilter = {
                page: currentPage + 1,
                size: 5,
              } as ClientFilter;
              // Traitez les données reçues ici
              console.log(data);
            },
            (error: any) => {
              console.error(error);
              this.ngOnInit(); // Relance l'initialisation en cas d'erreur
            }
          )
      );
    }
  } */
    onSearch() {
      if (this.searchForm.valid) {
        this.clientService.getAllClientsByFilters(
          this.searchForm.value.filterType,
          this.searchForm.value.searchTerm
        );
      }else {
        console.error('Recherche invalide');
      }
    }


  clear() {
    this.searchForm.reset();
    this.ngOnInit();
  }
    archiveMesure(mesure: MesureDTO) {
      this.clientService.archiveMesure(mesure.id).subscribe(
        (response) => {
          this.toastr.success('Mesure supprimé avec succès');
          const productPayloadFilter = {
            page: 0,
            size: 5,
          } as ClientFilter;
          this.clientService.getAllClientsByFilters(
            productPayloadFilter.page,
            productPayloadFilter.size
          );
        },
        (error) => this.toastr.error("Echec de l'opération")
      );
    }

}
