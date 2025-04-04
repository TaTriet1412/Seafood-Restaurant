import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardBodyComponent, CardComponent, CardFooterComponent, CardHeaderComponent, ColComponent, GutterDirective, RowComponent } from '@coreui/angular';
import { NavAdminService } from '../../../../../core/services/nav-routing/nav-admin.service';
import { TableService } from '../../../../../core/services/table.service';
import { firstValueFrom } from 'rxjs';
import { TableRes } from '../../../../../share/dto/response/table-response';

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
export class TablesManagementComponent implements OnInit {
  isInactivePage = false;
  originalTable: TableRes[] = []

  tables = [...this.originalTable]; // Dùng bản sao của danh sách ban đầu

  constructor(
    private tableService: TableService,
    private navAdminService: NavAdminService,
  ) { }

  async ngOnInit(): Promise<void> {
    const fetchedTables = await firstValueFrom(this.tableService.getTables())

    this.originalTable = fetchedTables
    this.tables = [...this.originalTable]; // Dùng bản sao của danh sách ban đầu
  }

  onSelectChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;

    if (selectedValue === 'all') {
      this.tables = [...this.originalTable]; // Hiển thị tất cả các bàn
      this.isInactivePage = false
    } else if (selectedValue === 'active') {
      this.filterActiveTable(true)
      this.isInactivePage = false
    } else if (selectedValue === 'inactive') {
      this.filterActiveTable(false)
      this.isInactivePage = true
    }
  }

  filterActiveTable(flag: boolean): void {
    this.tables = flag ? this.originalTable.filter(table => (this.isActiveTable(table.currentOrderSessionId)))
      : this.originalTable.filter(table => !(this.isActiveTable(table.currentOrderSessionId)));
  }


  goToTableOrder(tableId: string) {
    this.navAdminService.goToTableOrder(tableId);
  }

  openTable(tableId: string) {
    this.tables = this.tables.map(table => {
      if(table.id.toString() == tableId) {
        table.currentOrderSessionId = -1
      }
      return table;
    })

    if (this.isInactivePage) this.filterActiveTable(false)
  }

  isActiveTable(currOrderId: number | null) {
    return currOrderId != null;
  }

}