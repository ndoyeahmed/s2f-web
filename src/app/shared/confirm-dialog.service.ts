import { CLOSE, OPEN } from './components/form-dialog/form-action-const';
import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';

interface ConfirmDialogData {
  message: string;
  yesFn: () => void;
  noFn: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  private confirmData = signal<ConfirmDialogData>({
    message: '',
    yesFn: () => {},
    noFn: () => {},
  });

  confirmSignal = this.confirmData.asReadonly();

  openConfirmDialog(message: string, yesFn: () => void, noFn: () => void) {
    this.confirmData.set({
      message,
      yesFn,
      noFn,
    });
  }

  closeDialog() {
    this.confirmData.set({
      message: '',
      yesFn: () => {},
      noFn: () => {},
    });
  }
}
