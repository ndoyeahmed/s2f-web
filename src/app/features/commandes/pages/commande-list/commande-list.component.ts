import { Component, inject, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { FormDialogComponent } from '../../../../shared/components/form-dialog/form-dialog.component';
import { TableSkeletonPlaceholderComponent } from '../../../../shared/components/table-skeleton-placeholder/table-skeleton-placeholder.component';
import { ConfirmDialogService } from '../../../../shared/confirm-dialog.service';
import { CommandeService } from '../../commande.service';
import { CommandeDTO } from '../../../../shared/models/commande-dto.model';
import { ProductFilterPayload } from '../../../../shared/models/product-filter-payload.model';
import { EventEmitter } from 'stream';
import { fade, fadeSlide } from '../../../../shared/animations/animations';

@Component({
  selector: 'app-commande-list',
  standalone: true,
  imports: [
    FormDialogComponent,
    TableSkeletonPlaceholderComponent,
    ConfirmDialogComponent,
  ],
  templateUrl: './commande-list.component.html',
  styleUrl: './commande-list.component.scss',
  animations: [fade, fadeSlide],
})
export class CommandeListComponent {

  @Input() etatCommande: string = 'ENCOURS';
  commandeService = inject(CommandeService);
  private readonly toastr = inject(ToastrService);
  private readonly confirmDialogService = inject(ConfirmDialogService);

  products!: CommandeDTO[];
  productPayloadFilter = {
    page: 0,
    size: 5,
  } as ProductFilterPayload;

  ngOnInit() {
    this.commandeService.getAllCommandeByFilters(this.etatCommande,
      this.productPayloadFilter.page,
      this.productPayloadFilter.size
    );
  }

  // Charger la page précédente
  previousPage() {
    const currentPage = this.commandeService.currentPageSignal();
    if (currentPage > 0) {
      const productPayloadFilter = {
        page: currentPage - 1,
        size: 5,
      } as ProductFilterPayload;
      this.commandeService.getAllCommandeByFilters(this.etatCommande,
        productPayloadFilter.page,
        productPayloadFilter.size
      );
    }
  }

  // Charger la page suivante
  nextPage() {
    const currentPage = this.commandeService.currentPageSignal();
    const totalPages = this.commandeService.totalPagesSignal();
    if (currentPage + 1 < totalPages) {
      const productPayloadFilter = {
        page: currentPage + 1,
        size: 5,
      } as ProductFilterPayload;
      this.commandeService.getAllCommandeByFilters(this.etatCommande,
        productPayloadFilter.page,
        productPayloadFilter.size
      );
    }
  }

  archiveCommande(commande: CommandeDTO) {
    this.commandeService.archiveCommande(commande.id).subscribe(
      (response) => {
        this.toastr.success('Commande supprimé avec succès');
        const productPayloadFilter = {
          page: 0,
          size: 5,
        } as ProductFilterPayload;
        this.commandeService.getAllCommandeByFilters(this.etatCommande,
          productPayloadFilter.page,
          productPayloadFilter.size
        );
      },
      (error: any) => this.toastr.error("Echec de l'opération")
    );
  }

  onDeleteCommande(commande: CommandeDTO) {
    this.confirmDialogService.openConfirmDialog(
      `Voulez-vous vraiment supprimer la commande : ${commande.numero} ?`,
      () => {
        // Fonction exécutée si l'utilisateur clique sur "Oui"
        this.archiveCommande(commande);
      },
      () => {
        // Fonction exécutée si l'utilisateur clique sur "Non"
        console.log('Suppression annulée');
      }
    );
  }
}
