import { Component, inject, Input, TemplateRef } from '@angular/core';
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { FormDialogService } from '../../form-dialog.service';
import { OPEN } from './form-action-const';

@Component({
  selector: 'app-form-dialog',
  standalone: true,
  imports: [],
  templateUrl: './form-dialog.component.html',
  styleUrl: './form-dialog.component.scss',
})
export class FormDialogComponent {
  private readonly modalService = inject(NgbModal);
  private readonly formDialogService = inject(FormDialogService);

  @Input() formDialogOptions: NgbModalOptions = {
    size: 'lg',
    backdrop: 'static',
  };
  @Input() formDialogTitle = '';
  @Input() formDialogOpenBtnTitle = '';
  @Input() formDialogOpenBtnCss = 'btn btn-primary';
  @Input() formDialogOpenBtnPrefixIcon = 'fa fa-plus';
  @Input() formDialogOpenBtnSuffixIcon = '';

  closeResult = '';

  open(content: TemplateRef<any>) {
    this.formDialogService.formdialogSignal.set(OPEN);
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
}
