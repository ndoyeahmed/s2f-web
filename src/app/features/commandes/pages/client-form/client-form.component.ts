import { Component, effect, EventEmitter, inject, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalOptions, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ClientDTO } from '../../../../shared/models/client-dto.model';
import { MesureDTO } from '../../../../shared/models/mesure-dto.model';
import { ClientService } from '../../client.service';
import { ConfirmDialogService } from '../../../../shared/confirm-dialog.service';
import { FormDialogService } from '../../../../shared/form-dialog.service';
import { OPEN } from '../../../../shared/components/form-dialog/form-action-const';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss'
})
export class ClientFormComponent implements OnInit{
  private readonly modalService = inject(NgbModal);
  private readonly clientService = inject(ClientService);
  private readonly toastr = inject(ToastrService);
  private readonly confirmDialogService = inject(ConfirmDialogService);
  private readonly formDialogService = inject(FormDialogService);
  constructor(private readonly fb: FormBuilder){
    effect(() => {
      const status = this.formDialogService.formdialogSignal();
      if (status === OPEN) {
        if (this.clientEdit?.id) {
          this.initEditClientForm(this.clientEdit);
        } else {
          this.initAddClient();
        }
      }
    });
  }
  @Input() clientEdit!: ClientDTO;

  ngOnInit(): void {
    if (this.clientEdit?.id) {
      this.initEditClientForm(this.clientEdit);
    } else {
      this.initAddClient();
    }
  }

  clientForm!: FormGroup;

  @Output() afterSave = new EventEmitter();

  formDialogOptions: NgbModalOptions = {
    size: 'lg',
    backdrop: 'static',
  };
  @Input() formDialogTitle = 'Ajouter un nouveau client';
  @Input() formDialogOpenBtnTitle = 'Nouveau';
  @Input() formDialogOpenBtnCss = 'btn btn-default border';
  @Input() formDialogOpenBtnPrefixIcon = 'fa fa-plus';
  @Input() formDialogOpenBtnSuffixIcon = '';

  closeResult = '';

  mesures: MesureDTO[] = [];
  client: ClientDTO = { nom: '', prenom: '', telephone: '', id: 0, archive: false ,mesures: []};

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

  /* ngOnInit(): void {
    this.getAllMesures();
    if (this.productEdit?.id) {
      this.initEditProductForm(this.productEdit);
    } else {
      this.initAddProductForm();
    }
  }

  getAllMesures() {
    this.clientService.getAllMesures().subscribe(
      (data: CategorieDTO[]) => {
        this.categories = data;
      },
      (err: any) => {
        this.toastr.error('Erreur lors du chargement des catégories');
      }
    );
  } */

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

  addNewMesure() {
    this.mesures.push(
      {
        id: this.mesures.length + 1,
        libelle: '',
        valeur: 0,
        archive: false,
      }
    );
  }

  deleteMesure(id: number) {
    this.mesures = this.mesures.filter(mesure => id != mesure.id);
  }

  save(modal: any) {
    if (this.client.nom !== '' && this.client.prenom !== '' && this.client.telephone !== '') {
      const clientRequest = {...this.client, mesures: this.mesures};

      this.clientService.addClient(clientRequest).subscribe(
        (response: any) => {
          this.toastr.success('client ajouté avec succès');
          this.mesures = [];
          this.client = { nom: '', prenom: '', telephone: '', id: 0, archive: false, mesures: this.mesures };
          this.afterSave.emit(true);
          modal.close();
        },
        (err) => this.toastr.error("Échec de l'ajout du client")
      );
    } else {
      this.toastr.error('Veuillez remplir les champs obligatoire');
    }
  }

  initEditClientForm(client: ClientDTO) {
    this.clientForm = this.fb.group({
      name: [client.nom, Validators.required],
      description: [client.prenom, Validators.required],
      price: [client.telephone, [Validators.required, Validators.min(0)]],
      mesures : [client.mesures]
    });
  }

  initAddClient(){
    if (this.client.nom !== '' && this.client.prenom !== '' && this.client.telephone !== '') {
      const clientRequest = {...this.client, mesures: this.mesures};
      this.clientService.addClient(clientRequest).subscribe(
        (response) => {
          this.toastr.success('client ajouté avec succès');
          this.mesures = [];
          this.client = { nom: '', prenom: '', telephone: '', id: 0, archive: false,mesures: [] };
          this.afterSave.emit(true);
          //modal.close();
        },
        (err) => {
          this.toastr.error("Echec de l'opération");
        }
      );
    } else {
      this.toastr.error('Veuillez remplir les champs obligatoire');
    }
  }
// Exemple d'ouverture en mode édition
openEditModal(content: TemplateRef<any>, client: ClientDTO) {
  this.clientEdit = client;
  this.onSubmit();
  this.open(content);
}

// Exemple d'ouverture en mode ajout
openAddModal(content: TemplateRef<any>) {
  //this.clientEdit = undefined;
  this.open(content);
}

  private resetForm() {
    this.clientForm.reset();
    this.mesures = [];
    this.client = { nom: '', prenom: '', telephone: '', id: 0, archive: false, mesures: this.mesures };
  }

  onSubmit() {
    if (this.clientForm.valid) {
      const client = {
        id: this.clientEdit?.id ? this.clientEdit.id : null,
        nom: this.clientForm.value.nom,
        prenom: this.clientForm.value.prenom,
        telephone: this.clientForm.value.telephone,
        mesures: this.clientForm.value.mesures,
       /*  mesures: [{
          id: Number(this.clientForm.value.mesures),
        }] as MesureDTO, */
      } as ClientDTO;

      this.clientService.addClientAndRefresh(client, this.clientForm);
    }
  }
}
