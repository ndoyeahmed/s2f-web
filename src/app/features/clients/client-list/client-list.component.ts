import { Component, inject } from '@angular/core';
import { FormDialogComponent } from '../../../shared/components/form-dialog/form-dialog.component';
import { ClientFormComponent } from '../../commandes/pages/client-form/client-form.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { TableSkeletonPlaceholderComponent } from '../../../shared/components/table-skeleton-placeholder/table-skeleton-placeholder.component';
import { fade, fadeSlide } from '../../../shared/animations/animations';
import { ClientServiceService } from '../client-service.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogService } from '../../../shared/confirm-dialog.service';
import { ClientDTO } from '../../../shared/models/client-dto.model';
import { ClientFilter } from '../../../shared/client-filter';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    FormDialogComponent,
    ClientFormComponent,
    TableSkeletonPlaceholderComponent,
    ConfirmDialogComponent,
  ],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.scss',
  animations: [fade, fadeSlide],
})
export class ClientListComponent {
  clientService = inject(ClientServiceService);
  private readonly toastr = inject(ToastrService);
  private readonly confirmDialogService = inject(ConfirmDialogService);

  clients!: ClientDTO[];
  clientFilter = {
    page: 0,
    size: 5,
  } as ClientFilter;

  // Charger la page précédente
  previousPage() {
    const currentPage = this.clientService.currentPageSignal();
    if (currentPage > 0) {
      const productPayloadFilter = {
        page: currentPage - 1,
        size: 5,
      } as ClientFilter;
      this.clientService.getAllClientsByFilters(
        productPayloadFilter.page,
        productPayloadFilter.size
      );
    }
  }

  // Charger la page suivante
  nextPage() {
    const currentPage = this.clientService.currentPageSignal();
    const totalPages = this.clientService.totalPagesSignal();
    if (currentPage + 1 < totalPages) {
      const productPayloadFilter = {
        page: currentPage + 1,
        size: 5,
      } as ClientFilter;
      this.clientService.getAllClientsByFilters(
        productPayloadFilter.page,
        productPayloadFilter.size
      );
    }
  }


  /* archiveProduct(product: ProduitDTO) {
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
  } */

}
