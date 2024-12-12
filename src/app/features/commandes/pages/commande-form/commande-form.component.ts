import { CommandeProduitDTO } from './../../../../shared/models/commande-product.model';
import { ResponseDTOPaging } from './../../../../shared/models/response-dto-paging.model';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientFormComponent } from '../client-form/client-form.component';
import { CommandeService } from '../../commande.service';
import { ProductsService } from '../../../products/products.service';
import { ProduitDTO } from '../../../../shared/models/produit-dto.model';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogService } from '../../../../shared/confirm-dialog.service';
import { fade, fadeSlide } from '../../../../shared/animations/animations';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ClientDTO } from '../../../../shared/models/client-dto.model';
import { ClientService } from '../../client.service';
import moment from 'moment';

@Component({
  selector: 'app-commande-form',
  standalone: true,
  imports: [FormsModule ,ReactiveFormsModule, ClientFormComponent, ConfirmDialogComponent,],
  templateUrl: './commande-form.component.html',
  styleUrl: './commande-form.component.scss',
  animations: [fade, fadeSlide],
})
export class CommandeFormComponent {
  @Output() afterSave: EventEmitter<boolean> = new EventEmitter();
  form!: FormGroup;
  commandeNumber = '';
  commandeDate = moment().format('DD/MM/YYYY');
  products: ProduitDTO[] = [];
  orderedProducts: CommandeProduitDTO[] = [];

  seletedProductId = 0;
  seletedProduct!: ProduitDTO;
  seletedClientId = 0;
  seletedClient!: ClientDTO;

  formDialogOptions: NgbModalOptions = {
    size: 'lg',
    backdrop: 'static',
  };

  editedPrice = 0;
  editedQuantity = 0;

  clients: ClientDTO[] = [];

  constructor(
    private readonly commandeService: CommandeService,
    private readonly productService: ProductsService,
    private readonly clientService: ClientService,
    private readonly fb: FormBuilder,
    private readonly toastr: ToastrService,
    private readonly modalService: NgbModal,
    private readonly confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit() {
    this.getNewCommandeNumber();
    this.getAllProducts();
    this.getAllClientNotArchived();
    this.initForm();
  }

  getAllClientNotArchived() {
    this.clientService.getAllClientNotArchived().subscribe(
      (data: ClientDTO[]) => {
        this.clients = data;
      },
      (err: any) => console.log('error getting clients')
    );
  }

  getNewCommandeNumber() {
    this.commandeService.getNewCommandeNumber().subscribe(
      (data: any) => this.commandeNumber = data.response,
      (err: any) => console.log('error getting new commande number')
    );
  }

  getAllProducts() {
    this.productService.getAllProductsNotArchived().subscribe(
      (data: ResponseDTOPaging) => {
        this.products = data.result;
      },
      (err: any) => console.log('error getting products')
    );
  }

  onSelectProduct(event: any) {
    this.seletedProductId = Number(event?.target.value);
    this.seletedProduct = this.products.filter((prod) => prod.id === this.seletedProductId)[0];
  }

  onSelectClient(event: any) {
    this.seletedClientId = Number(event?.target.value);
    this.seletedClient = this.clients.filter((client) => client.id === this.seletedClientId)[0];
  }

    initForm() {
      this.form = this.fb.group({
        client: [this.seletedClientId, Validators.required],
        product: [this.seletedProductId],
        price: [null],
        quantite: [null],
        totalapayer: [{disabled: true, value: null}],
        montantrecu: [null, Validators.required],
        montantrestant: [{disabled: true, value: null}],
      });
    }

    updateTotalAPayerAndRestant() {
      let totalAPayer = 0;
      this.orderedProducts.forEach((product) => {
        totalAPayer += product.quantite * product.prixVente;
      });
      this.form.controls['totalapayer'].setValue(totalAPayer);
      const montantRecu = Number(this.form.controls['montantrecu'].value);
      this.setMontantRestant(montantRecu, totalAPayer);
    }

    setMontantRestant(montantRecu: number, totalAPayer: number) {
      if (montantRecu && totalAPayer && montantRecu <= totalAPayer) {
        this.form.controls['montantrestant'].setValue(totalAPayer-montantRecu);
      } else if (montantRecu > totalAPayer) {
        this.form.controls['montantrestant'].setValue(0);
      } else {
        this.form.controls['montantrestant'].setValue(totalAPayer);
      }
    }

    onAddAmount(event: any) {
      const montantRecu = Number(this.form.controls['montantrecu'].value);
      const totalAPayer = Number(this.form.controls['totalapayer'].value);
      this.setMontantRestant(montantRecu, totalAPayer);
    }

    onAddProduct() {
      if (!this.checkProductAlreadyOrdered()) {
        if (Number(this.form.controls['product'].value)!==0 && this.form.controls['quantite'].value && this.form.controls['price'].value) {
          const orderedProduct = {
            id: 0,
            quantite: Number(this.form.controls['quantite'].value),
            prixVente: Number(this.form.controls['price'].value),
            produit: {...this.seletedProduct },
          } as CommandeProduitDTO;
          this.orderedProducts.push(orderedProduct);
          this.form.controls['price'].reset();
          this.form.controls['product'].setValue(0);
          this.form.controls['quantite'].reset();
          this.seletedProductId = 0;
          this.updateTotalAPayerAndRestant();
        }
        else {
          this.toastr.error('Le produit, le prix et la quantité du produit sont obligatoire');
        }
      } else {
        this.toastr.error('Le produit à déja été selectionner. Veulleir le modifier ou le supprimer des produits à commander');
      }
    }

    onDeleteOrderedProduct(productId: any) {
      this.confirmDialogService.openConfirmDialog(
        `Voulez-vous vraiment supprimer cet élément ?`,
        () => {
          // Fonction exécutée si l'utilisateur clique sur "Oui"
          this.orderedProducts = this.orderedProducts.filter((prod) => prod.produit.id!== Number(productId));
        },
        () => {
          // Fonction exécutée si l'utilisateur clique sur "Non"
          console.log('Suppression annulée');
        }
      );

    }

    getTotalPrice(price: any, quantite: any) {
      if (price && quantite) {
        return price * quantite;
      } else {
        return 0;
      }
    }
    checkProductAlreadyOrdered() {
      return this.orderedProducts.some((prod) => prod.produit.id === this.seletedProductId);
    }

    afterClientSaved(event: any) {
      this.getAllClientNotArchived();
    }

    onSubmit() {
      if (this.form.valid && this.seletedClient && this.seletedProduct && this.orderedProducts && this.orderedProducts.length > 0) {
        this.commandeService.loaderFormSignal.set(true);
        const commandeData = {
          numero: this.commandeNumber,
          clientId: this.seletedClientId,
          montantRecu: Number(this.form.controls['montantrecu'].value),
          orderedProducts: this.orderedProducts.map((prod) => ({
            quantite: prod.quantite,
            prixVente: prod.prixVente,
            produitId: prod.produit.id})),
          date: moment()
        };
        this.commandeService.saveCommande(commandeData).subscribe(
          (data: any) => {
            this.toastr.success('Commande sauvegardée avec succès');
            this.form.reset();
            this.orderedProducts = [];
            this.seletedProductId = 0;
            this.seletedClientId = 0;
            this.commandeService.loaderFormSignal.set(false);
            this.modalService.dismissAll();
            this.afterSave.next(true);
          },
          (err: any) => {
            this.toastr.error('Erreur lors de la sauvegarde de la commande');
            this.commandeService.loaderFormSignal.set(false);
            console.log('error saving commande', err);
          }
        );
      }
    }
}
