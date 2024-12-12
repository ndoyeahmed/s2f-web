import { Component } from '@angular/core';
import { NgbModalOptions, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { CommandeListComponent } from '../commande-list/commande-list.component';
import { FormDialogComponent } from '../../../../shared/components/form-dialog/form-dialog.component';
import { CommandeFormComponent } from '../commande-form/commande-form.component';

@Component({
  selector: 'app-commandes',
  standalone: true,
  imports: [
    NgbNavModule,
    CommandeListComponent,
    FormDialogComponent,
    CommandeFormComponent,
  ],
  templateUrl: './commandes.component.html',
  styleUrl: './commandes.component.scss',
})
export default class CommandesComponent {
  active = 1;
  formDialogOptions: NgbModalOptions = {
    size: 'xl',
    backdrop: 'static',
  };

  afterSave(event: boolean) {
    if (event) {
      this.active = 1;
    }
  }
}
