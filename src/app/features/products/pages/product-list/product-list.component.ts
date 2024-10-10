import { Component } from '@angular/core';
import { FormDialogComponent } from '../../../../shared/components/form-dialog/form-dialog.component';
import { ProductFormComponent } from '../product-form/product-form.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [FormDialogComponent, ProductFormComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export default class ProductListComponent {}
