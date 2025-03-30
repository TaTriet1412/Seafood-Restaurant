import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardBodyComponent, CardComponent, CardFooterComponent, CardHeaderComponent, ColComponent, GutterDirective, RowComponent } from '@coreui/angular';

@Component({
  selector: 'app-tables-management',
  standalone: true,
  imports: [
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    RowComponent,
    ColComponent,
    CardBodyComponent,
    GutterDirective,
    CommonModule,
  ],
  templateUrl: './tables-management.component.html',
  styleUrls: ['./tables-management.component.scss'],
})
export class TablesManagementComponent {
  originalCards = [
    { active: true, number: 1 }, // Bàn số 1 đang hoạt động
    { active: false, number: 2 }, // Bàn số 2 đang trống
    { active: true, number: 3 }, // Bàn số 3 đang hoạt động
    { active: false, number: 4 }, // Bàn số 4 đang trống
  ];
  cards = [...this.originalCards]; // Dùng bản sao của danh sách ban đầu

  onSelectChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;

    if (selectedValue === 'all') {
      this.cards = [...this.originalCards]; // Hiển thị tất cả các bàn
    } else if (selectedValue === 'active') {
      this.cards = this.originalCards.filter(card => card.active); // Chỉ hiển thị bàn đang hoạt động
    } else if (selectedValue === 'inactive') {
      this.cards = this.originalCards.filter(card => !card.active); // Chỉ hiển thị bàn đang trống
    }
  }

}