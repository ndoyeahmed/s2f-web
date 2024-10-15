import { inject, Injectable, signal } from '@angular/core';
import { CategorieDTO } from '../../shared/models/categorie-dto.model';
import { HttpClient } from '@angular/common/http';
import { ProductFilterPayload } from '../../shared/models/product-filter-payload.model';
import { ProduitDTO } from '../../shared/models/produit-dto.model';
import { ResponseDTOPaging } from '../../shared/models/response-dto-paging.model';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormDialogService } from '../../shared/form-dialog.service';
import { CLOSE } from '../../shared/components/form-dialog/form-action-const';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly toastr = inject(ToastrService);
  private readonly modalService = inject(NgbModal);
  private readonly formDialogService = inject(FormDialogService);
  // Signal pour stocker la liste des produits
  productsSignal = signal<ProduitDTO[]>([]);
  currentPageSignal = signal<number>(0); // Page actuelle
  totalElementsSignal = signal<number>(0); // Page actuelle
  totalPagesSignal = signal<number>(0); // Nombre total de pages
  loaderSignal = signal<boolean>(false); // Nombre total de pages
  loaderFormSignal = signal<boolean>(false); // Nombre total de pages
  productPayloadFilter = {
    page: 0,
    size: 5,
  } as ProductFilterPayload;

  constructor(private readonly http: HttpClient) {
    this.getAllProductsByFilters(this.productPayloadFilter);
  }

  addCategory(category: CategorieDTO) {
    return this.http.post(`/api/v1/category`, category);
  }

  getAllCategories() {
    return this.http.get<CategorieDTO[]>(`/api/v1/categories`);
  }

  addProduct(produitDto: ProduitDTO) {
    return this.http.post(`/api/v1/product`, produitDto);
  }

  archiveProduct(produitId: number) {
    return this.http.delete(`/api/v1/product/${produitId}`);
  }

  // Méthode pour ajouter un produit et rafraîchir la liste
  addProductAndRefresh(product: ProduitDTO, form: FormGroup) {
    this.loaderFormSignal.set(true);
    this.addProduct(product).subscribe({
      next: () => {
        form.reset();
        product?.id
          ? this.toastr.success('Produit ajouté avec succès')
          : this.toastr.success('Produit éditer avec succès');
        this.loaderFormSignal.set(false);
        this.modalService.dismissAll();
        this.formDialogService.formdialogSignal.set(CLOSE);
        this.getAllProductsByFilters(this.productPayloadFilter);
      },
      error: (err) => {
        this.toastr.error("Echec de l'opération");
        this.loaderFormSignal.set(false);
      },
    });
  }

  getAllProductsByFilters(produitFilterPayloadr: ProductFilterPayload) {
    return this.http
      .post<ResponseDTOPaging>(`/api/v1/products`, produitFilterPayloadr)
      .subscribe({
        next: (response) => {
          this.productsSignal.set(response.result); // Mettre à jour les produits
          this.currentPageSignal.set(response.page); // Mettre à jour la page courante
          this.totalPagesSignal.set(response.totalPages); // Mettre à jour le total des pages
          this.totalElementsSignal.set(response.totalElements); // Mettre à jour le total des éléments
          this.loaderSignal.set(true);
        },
        error: (err) => {
          this.loaderSignal.set(true);
          this.toastr.error('Erreur lors du chargement des produits');
        },
      });
  }
}
