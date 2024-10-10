import { Component, inject, TemplateRef } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { CategorieFormComponent } from '../categorie-form/categorie-form.component';
import { CategorieDTO } from '../../../../shared/models/categorie-dto.model';
import { ProductsService } from '../../products.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, CategorieFormComponent],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent {
  private readonly modalService = inject(NgbModal);
  private readonly productService = inject(ProductsService);
  closeResult = '';

  productForm: FormGroup;
  formDialogOptions = {
    size: 'sm',
    backdrop: 'static',
  } as NgbModalOptions;

  categories: CategorieDTO[] = [];

  constructor(private readonly fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      quantite: [0, [Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories() {
    this.productService.getAllCategories().subscribe(
      (data: CategorieDTO[]) => {
        console.log(data);
        this.categories = data;
      },
      (err) => {
        console.log(err);
        // TODO: notif error loading categories
      }
    );
  }

  onCategoriesChange(event: boolean) {
    if (event) {
      this.getAllCategories();
    }
  }

  open(content: TemplateRef<any>) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  closeModal() {
    this.modalService.dismissAll();
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

  onSubmit() {
    if (this.productForm.valid) {
      const formData = new FormData();
      formData.append('name', this.productForm.get('name')?.value);
      formData.append(
        'description',
        this.productForm.get('description')?.value
      );
      formData.append('price', this.productForm.get('price')?.value);
      formData.append('category', this.productForm.get('category')?.value);

      // Envoyer les données via un service (à implémenter)
      console.log('Formulaire valide, produit soumis :', formData);
    }
  }
}
