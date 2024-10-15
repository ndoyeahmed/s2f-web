import { Component, effect, inject, Input, TemplateRef } from '@angular/core';
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
import { ProduitDTO } from '../../../../shared/models/produit-dto.model';
import { ToastrService } from 'ngx-toastr';
import { FormDialogService } from '../../../../shared/form-dialog.service';
import { OPEN } from '../../../../shared/components/form-dialog/form-action-const';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, CategorieFormComponent],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent {
  @Input() productEdit!: ProduitDTO;

  private readonly modalService = inject(NgbModal);
  productService = inject(ProductsService);
  private readonly toastr = inject(ToastrService);
  private readonly formDialogService = inject(FormDialogService);
  closeResult = '';
  loader = false;

  productForm!: FormGroup;
  formDialogOptions = {
    size: 'sm',
    backdrop: 'static',
  } as NgbModalOptions;

  categories: CategorieDTO[] = [];

  constructor(private readonly fb: FormBuilder) {
    effect(() => {
      const status = this.formDialogService.formdialogSignal();
      if (status === OPEN) {
        if (this.productEdit?.id) {
          this.initEditProductForm(this.productEdit);
        } else {
          this.initAddProductForm();
        }
      }
    });
  }

  initAddProductForm() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      category: [0, Validators.required],
      // quantite: [0, [Validators.min(0)]],
    });
  }

  initEditProductForm(product: ProduitDTO) {
    this.productForm = this.fb.group({
      name: [product.libelle, Validators.required],
      description: [product.description, Validators.required],
      price: [product.prix, [Validators.required, Validators.min(0)]],
      category: [Number(product.categorieDto.id), Validators.required],
      // quantite: [0, [Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.getAllCategories();
    if (this.productEdit?.id) {
      this.initEditProductForm(this.productEdit);
    } else {
      this.initAddProductForm();
    }
  }

  getAllCategories() {
    this.productService.getAllCategories().subscribe(
      (data: CategorieDTO[]) => {
        this.categories = data;
      },
      (err) => {
        this.toastr.error('Erreur lors du chargement des catégories');
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
      const product = {
        id: this.productEdit?.id ? this.productEdit.id : null,
        libelle: this.productForm.value.name,
        prix: this.productForm.value.price,
        description: this.productForm.value.description,
        categorieDto: {
          id: Number(this.productForm.value.category),
        } as CategorieDTO,
      } as ProduitDTO;

      this.productService.addProductAndRefresh(product, this.productForm);
    }
  }
}
