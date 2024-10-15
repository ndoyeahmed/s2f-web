import { Injectable, signal } from '@angular/core';
import { CLOSE } from './components/form-dialog/form-action-const';

@Injectable({
  providedIn: 'root',
})
export class FormDialogService {
  formdialogSignal = signal<string>(CLOSE);
  constructor() {}
}
