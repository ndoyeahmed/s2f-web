import { Component, inject } from '@angular/core';
import { FormDialogComponent } from '../../../../shared/components/form-dialog/form-dialog.component';
import { ProductFormComponent } from '../product-form/product-form.component';
import { TableSkeletonPlaceholderComponent } from '../../../../shared/components/table-skeleton-placeholder/table-skeleton-placeholder.component';
import { ProductsService } from '../../products.service';
import { ProductFilterPayload } from '../../../../shared/models/product-filter-payload.model';
import { ProduitDTO } from '../../../../shared/models/produit-dto.model';
import { ToastrService } from 'ngx-toastr';
import { fade, fadeSlide } from '../../../../shared/animations/animations';
import { ConfirmDialogService } from '../../../../shared/confirm-dialog.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    FormDialogComponent,
    ProductFormComponent,
    TableSkeletonPlaceholderComponent,
    ConfirmDialogComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  animations: [fade, fadeSlide],
})
export default class ProductListComponent {

  productService = inject(ProductsService);
  private readonly toastr = inject(ToastrService);
  private readonly confirmDialogService = inject(ConfirmDialogService);

  products!: ProduitDTO[];

  productPayloadFilter = {
    page: 0,
    size: 5,
  } as ProductFilterPayload;

  ngOnInit() {
    // this.loadProducts();
  }

  // Charger la page précédente
  previousPage() {
    const currentPage = this.productService.currentPageSignal();
    if (currentPage > 0) {
      const productPayloadFilter = {
        page: currentPage - 1,
        size: 5,
      } as ProductFilterPayload;
      this.productService.getAllProductsByFilters(
        productPayloadFilter.page,
        productPayloadFilter.size
      );
    }
  }

  // Charger la page suivante
  nextPage() {
    const currentPage = this.productService.currentPageSignal();
    const totalPages = this.productService.totalPagesSignal();
    if (currentPage + 1 < totalPages) {
      const productPayloadFilter = {
        page: currentPage + 1,
        size: 5,
      } as ProductFilterPayload;
      this.productService.getAllProductsByFilters(
        productPayloadFilter.page,
        productPayloadFilter.size
      );
    }
  }

  archiveProduct(product: ProduitDTO) {
    this.productService.archiveProduct(product.id).subscribe(
      (response) => {
        this.toastr.success('Produit supprimé avec succès');
        const productPayloadFilter = {
          page: 0,
          size: 5,
        } as ProductFilterPayload;
        this.productService.getAllProductsByFilters(
          productPayloadFilter.page,
          productPayloadFilter.size
        );
      },
      (error) => this.toastr.error("Echec de l'opération")
    );
  }

  onDeleteProduct(product: ProduitDTO) {
    this.confirmDialogService.openConfirmDialog(
      `Voulez-vous vraiment supprimer ${product.libelle} ?`,
      () => {
        // Fonction exécutée si l'utilisateur clique sur "Oui"
        this.archiveProduct(product);
      },
      () => {
        // Fonction exécutée si l'utilisateur clique sur "Non"
        console.log('Suppression annulée');
      }
    );
  }
  
}
