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
    FormDialogComponent,
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
  constructor(private readonly fb: FormBuilder){}
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
  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }
  open(content: TemplateRef<any>) {
    this.modalService.open(content, this.formDialogOptions).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
  ngOnInit() {
    this.getAllClientNotArchived();
    if (this.clientEdit?.id) {
      this.initEditClientForm(this.clientEdit);
    } else {
      this.initAddClient();
    }
    //this.initForm();
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
  openEditModal(content: TemplateRef<any>, client: ClientDTO) {
    this.clientEdit = client;
    this.open(content);
  }

    initEditClientForm(client: ClientDTO) {
      this.clientForm = this.fb.group({
        name: [client.nom, Validators.required],
        description: [client.prenom, Validators.required],
        price: [client.telephone, [Validators.required, Validators.min(0)]],
        mesures : [...client.mesures]
      });
    }

    initAddClient(){
      if (this.client.nom !== '' && this.client.prenom !== '' && this.client.telephone !== '') {
        const clientRequest = {...this.client, mesures: this.mesures};
        this.clientService.addClient(clientRequest).subscribe(
          (response: any) => {
            this.toastr.success('client ajouté avec succès');
            this.mesures = [];
            this.client = { nom: '', prenom: '', telephone: '', id: 0, archive: false,mesures: [] };
            this.afterSave.emit(true);
            //modal.close();
          },
          (err: any) => {
            this.toastr.error("Echec de l'opération");
          }
        );
      } else {
        this.toastr.error('Veuillez remplir les champs obligatoire');
      }
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

    onDeleteProduct(mesure: MesureDTO) {
      this.confirmDialogService.openConfirmDialog(
        `Voulez-vous vraiment supprimer ${mesure.libelle} ?`,
        () => {
          // Fonction exécutée si l'utilisateur clique sur "Oui"
          this.archiveMesure(mesure);
        },
        () => {
          // Fonction exécutée si l'utilisateur clique sur "Non"
          console.log('Suppression annulée');
        }
      );
    }
}
