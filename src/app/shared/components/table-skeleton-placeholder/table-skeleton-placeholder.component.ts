import { Component, Input } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-table-skeleton-placeholder',
  standalone: true,
  imports: [NgxSkeletonLoaderModule],
  templateUrl: './table-skeleton-placeholder.component.html',
  styleUrl: './table-skeleton-placeholder.component.scss',
})
export class TableSkeletonPlaceholderComponent {
  @Input() columnHeader!: string[];
}
