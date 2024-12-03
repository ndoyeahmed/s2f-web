import { Component, EventEmitter, inject, Output, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalOptions, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ClientDTO } from '../../../../shared/models/client-dto.model';
import { MesureDTO } from '../../../../shared/models/mesure-dto.model';
import { ClientService } from '../../client.service';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss'
})
export class ClientFormComponent {
  private readonly modalService = inject(NgbModal);
  private readonly clientService = inject(ClientService);
  private readonly toastr = inject(ToastrService);

  @Output() afterSave = new EventEmitter();

  formDialogOptions: NgbModalOptions = {
    size: 'lg',
    backdrop: 'static',
  };
  formDialogTitle = 'Ajouter un nouveau client';
  formDialogOpenBtnTitle = 'Nouveau';
  formDialogOpenBtnCss = 'btn btn-default border';
  formDialogOpenBtnPrefixIcon = 'fa fa-plus';
  formDialogOpenBtnSuffixIcon = '';

  closeResult = '';

  mesures: MesureDTO[] = [];
  client: ClientDTO = { nom: '', prenom: '', telephone: '', id: 0, archive: false };

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
        (response) => {
          this.toastr.success('client ajouté avec succès');
          this.mesures = [];
          this.client = { nom: '', prenom: '', telephone: '', id: 0, archive: false };
          this.afterSave.emit(true);
          modal.close();
        },
        (err) => {
          this.toastr.error("Echec de l'opération");
        }
      );
    } else {
      this.toastr.error('Veuillez remplir les champs obligatoire');
    }
  }
}
