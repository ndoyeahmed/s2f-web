import { CategorieDTO } from './../../../../shared/models/categorie-dto.model';
import {
  Component,
  EventEmitter,
  inject,
  Output,
  TemplateRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { ProductsService } from '../../products.service';

@Component({
  selector: 'app-categorie-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './categorie-form.component.html',
  styleUrl: './categorie-form.component.scss',
})
export class CategorieFormComponent {
  private readonly modalService = inject(NgbModal);
  private readonly produitService = inject(ProductsService);

  @Output() afterSave = new EventEmitter();

  formDialogOptions: NgbModalOptions = {
    size: 'sm',
    backdrop: 'static',
  };
  formDialogTitle = 'Ajouter une catégorie';
  formDialogOpenBtnTitle = 'Nouveau';
  formDialogOpenBtnCss = 'btn btn-default border';
  formDialogOpenBtnPrefixIcon = 'fa fa-plus';
  formDialogOpenBtnSuffixIcon = '';

  closeResult = '';

  category: CategorieDTO = { libelle: '', id: 0, archive: false };

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

  save(modal: any) {
    console.log(this.category);
    if (this.category.libelle !== '') {
      this.produitService.addCategory(this.category).subscribe(
        (response) => {
          console.log(response);
          // TODO: notif done successfully
          this.afterSave.emit(true);
          modal.close();
        },
        (err) => {
          console.log(err);
          // TODO: notif error
        }
      );
    } else {
      // TODO: notification erreur
    }
  }
}
