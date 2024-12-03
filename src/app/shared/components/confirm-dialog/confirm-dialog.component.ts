import {
  Component,
  effect,
  inject,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ConfirmDialogService } from '../../confirm-dialog.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
  @ViewChild('confirmDialog') confirmDialog!: TemplateRef<any>;
  private readonly modalService = inject(NgbModal);
  confirmDialogService = inject(ConfirmDialogService);

  formDialogOptions: NgbModalOptions = {
    size: 'sm',
    backdrop: 'static',
  };

  modalReference: any;

  constructor() {
    effect(() => {
      const confirmState = this.confirmDialogService.confirmSignal();
      if (confirmState.message) {
        this.openModal();
      }
    });
  }

  openModal() {
    this.modalReference = this.modalService.open(this.confirmDialog, this.formDialogOptions);
  }

  confirm() {
    this.confirmDialogService.confirmSignal().yesFn();
    this.modalReference.close();
    // this.modalService.dismissAll();
  }

  dismiss() {
    this.confirmDialogService.confirmSignal().noFn();
    this.modalReference.close();
    // this.modalService.dismissAll();
  }
}
