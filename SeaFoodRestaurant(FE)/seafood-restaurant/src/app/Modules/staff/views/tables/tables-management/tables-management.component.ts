import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardBodyComponent, CardComponent, CardFooterComponent, CardHeaderComponent, ColComponent, GutterDirective, RowComponent } from '@coreui/angular';
import { NavStaffService } from '../../../../../core/services/nav-routing/nav-staff.service';

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
  originalTables = [
    { active: true, number: 1 }, // Bàn số 1 đang hoạt động
    { active: false, number: 2 }, // Bàn số 2 đang trống
    { active: true, number: 3 }, // Bàn số 3 đang hoạt động
    { active: false, number: 4 }, // Bàn số 4 đang trống
  ];
  tables = [...this.originalTables]; // Dùng bản sao của danh sách ban đầu

  constructor(
    private navStaffService: NavStaffService,
  ) { }

  onSelectChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;

    if (selectedValue === 'all') {
      this.tables = [...this.originalTables]; // Hiển thị tất cả các bàn
    } else if (selectedValue === 'active') {
      this.tables = this.originalTables.filter(card => card.active); // Chỉ hiển thị bàn đang hoạt động
    } else if (selectedValue === 'inactive') {
      this.tables = this.originalTables.filter(card => !card.active); // Chỉ hiển thị bàn đang trống
    }
  }

  goToTableOrder(tableId: string) {
    this.navStaffService.goToTableOrder(tableId);
  }
}