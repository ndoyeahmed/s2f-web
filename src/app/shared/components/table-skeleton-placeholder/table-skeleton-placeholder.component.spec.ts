import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSkeletonPlaceholderComponent } from './table-skeleton-placeholder.component';

describe('TableSkeletonPlaceholderComponent', () => {
  let component: TableSkeletonPlaceholderComponent;
  let fixture: ComponentFixture<TableSkeletonPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableSkeletonPlaceholderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableSkeletonPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
