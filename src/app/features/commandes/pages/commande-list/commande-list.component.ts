import { Component, inject, Input, Output, TemplateRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TableSkeletonPlaceholderComponent } from '../../../../shared/components/table-skeleton-placeholder/table-skeleton-placeholder.component';
import { CommandeService } from '../../commande.service';
import { CommandeDTO } from '../../../../shared/models/commande-dto.model';
import { ProductFilterPayload } from '../../../../shared/models/product-filter-payload.model';
import { fade, fadeSlide } from '../../../../shared/animations/animations';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { CommandeProduitDTO } from '../../../../shared/models/commande-product.model';

@Component({
  selector: 'app-commande-list',
  standalone: true,
  imports: [
    TableSkeletonPlaceholderComponent,
  ],
  templateUrl: './commande-list.component.html',
  styleUrl: './commande-list.component.scss',
  animations: [fade, fadeSlide],
})
export class CommandeListComponent {

  @Input() etatCommande: string = 'ENCOURS';
  commandeService = inject(CommandeService);
  private readonly toastr = inject(ToastrService);
  private readonly modalService = inject(NgbModal);

  productPayloadFilter = {
    page: 0,
    size: 5,
  } as ProductFilterPayload;
  confirmMsg = '';
  archivedCommandId = 0;
  editEtatCommande: any;
  detailCommandes: CommandeProduitDTO[] = [];

  ngOnInit() {
    this.commandeService.getAllCommandeByFilters(this.etatCommande,
      this.productPayloadFilter.page,
      this.productPayloadFilter.size
    );
  }

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

  archiveCommande(commandeId: number) {
    this.commandeService.archiveCommande(commandeId).subscribe(
      (response) => {
        this.toastr.success('Commande supprimé avec succès');
        const productPayloadFilter = {
          page: 0,
          size: 5,
        } as ProductFilterPayload;
        this.modalService.dismissAll();
        this.commandeService.getAllCommandeByFilters(this.etatCommande,
          productPayloadFilter.page,
          productPayloadFilter.size
        );
      },
      (error: any) => this.toastr.error("Echec de l'opération")
    );
  }

  onDeleteCommande(commande: CommandeDTO, content: TemplateRef<any>) {
    this.archivedCommandId = commande.id;
    this.confirmMsg = `Voulez-vous vraiment supprimer la commande : ${commande.numero} ?`;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  showDetails(commande: CommandeDTO, content: TemplateRef<any>) {
    this.editEtatCommande = commande;
    this.getDetailsCommandeByCommandeId(commande.id);
    const formDialogOptions: NgbModalOptions = {
      size: 'lg',
      backdrop: 'static',
    };
    this.modalService.open(content, formDialogOptions);
  }

  getDetailsCommandeByCommandeId(commandeId: number) {
    this.commandeService.getDetailsCommandeByCommandeId(commandeId).subscribe(
      (response: any) => {
        this.detailCommandes = response;
      },
      (error: any) => this.toastr.error("Echec de récupération des détails de la commande")
    );
  }

  onChangeEtatCommande(commande: CommandeDTO, content: TemplateRef<any>) {
    this.editEtatCommande = commande;
    this.confirmMsg = `Voulez-vous vraiment changer l'etat de la commande : ${commande.numero} ?`;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  onSelectionChangeEtatCommande(event: any) {
    this.editEtatCommande.etatCommande = event.target.value;
  }

  changeEtat() {
    this.commandeService.updateCommande(this.editEtatCommande).subscribe(
      (response: any) => {
        this.toastr.success('Etat de la commande modifié avec succès');
        const productPayloadFilter = {
          page: 0,
          size: 5,
        } as ProductFilterPayload;
        this.commandeService.getAllCommandeByFilters(this.etatCommande,
          productPayloadFilter.page,
          productPayloadFilter.size
        );
        this.modalService.dismissAll();
      },
      (error: any) => this.toastr.error("Echec de l'opération")
    );
  }

  formatDate(date: any) {
    return moment(date).format('DD/MM/YYYY');
  }
}
