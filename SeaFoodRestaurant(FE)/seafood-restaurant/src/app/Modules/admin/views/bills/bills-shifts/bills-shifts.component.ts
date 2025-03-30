import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlignDirective, ButtonDirective, CardModule, ColDirective, FormSelectDirective, RowComponent, TableActiveDirective, TableColorDirective } from '@coreui/angular';
import { ColComponent, DatePickerModule, IColumn, IItem, SmartTableComponent, TemplateIdDirective } from '@coreui/angular-pro';
import { NavAdminService } from '../../../../../core/services/nav-routing/nav-admin.service';

@Component({
  selector: 'app-bills-shifts',
  standalone: true,
  imports: [
    CardModule,
    ColComponent,
    RowComponent,
    TemplateIdDirective,
    CommonModule,
    DatePickerModule,
    SmartTableComponent,
    ColDirective,
    AlignDirective,
    TableActiveDirective,
    TableColorDirective,
    FormsModule,
    ButtonDirective,
    FormSelectDirective
  ],
  templateUrl: './bills-shifts.component.html',
  styleUrl: './bills-shifts.component.scss',
  providers: [DatePipe]
})
export class BillsShiftsComponent implements OnInit {
  selectedValue: Date | [Date | null, Date | null] | null = new Date();
  loadedData = false;

  columns: (IColumn | string)[] = [
    { key: 'id', label: 'Mã HĐ', _style: { width: '10%' } },
    { key: 'date', label: 'Ngày', _style: { width: '15%' } },
    { key: 'table_name', label: 'Bàn', _style: { width: '10%' }, _props: { class: 'fw-bold' } },
    { key: 'total', label: 'Tổng tiền', _style: { width: '15%' } },
    { key: 'shift', label: 'Ca', _style: { width: '10%' } },
    { key: 'staff', label: 'Nhân viên', _style: { width: '20%' } },
    { key: 'detail', label: 'Chi tiết', _style: { width: '10%' }, filter: false, sorter: false }
  ];

  originalBillsData: IItem[] = [];
  billsData: IItem[] = [];
  selectedDate = true;
  selectedShift: string = '';

  constructor(
    private datePipe: DatePipe,
    private navAdminService: NavAdminService,
  ) {}

  ngOnInit(): void {
    this.loadDataBills();
  }

  loadDataBills() {
    console.log('--- Bắt đầu loadDataBills ---');
    console.log('Ngày được chọn:', this.selectedValue);
    this.loadedData = false;
    const targetDate = this.selectedValue instanceof Date ? this.selectedValue : new Date();

    const allBills = [
        { id: 1, date: '2024-07-27', table_name: 'Bàn 1', total: '1.000.000', staff: 'Nguyễn Thành Long', shift: 'a' },
        { id: 2, date: '2024-07-27', table_name: 'Bàn 2', total: '1.500.000', staff: 'Tạ Triết', shift: 'b' },
        { id: 3, date: '2024-07-28', table_name: 'Bàn 5', total: '800.000', staff: 'Nguyễn Thành Long', shift: 'a' },
        { id: 4, date: '2024-07-28', table_name: 'Bàn VIP 1', total: '2.500.000', staff: 'Tạ Triết', shift: 'b' },
        // Thêm vài dòng cho ngày hiện tại nếu cần test
        { id: 5, date: new Date().toISOString().split('T')[0], table_name: 'Bàn 3', total: '500.000', staff: 'Lê Minh Anh', shift: 'a' },
        { id: 6, date: new Date().toISOString().split('T')[0], table_name: 'Bàn 4', total: '750.000', staff: 'Nguyễn Thành Long', shift: 'b' },
    ];

    this.originalBillsData = allBills.filter(bill => {
        if (this.selectedValue instanceof Date) {
            const selectedDateString = this.selectedValue.toISOString().split('T')[0];
            return bill.date === selectedDateString;
        }
        return false;
    });
    console.log('originalBillsData (sau khi lọc theo ngày):', JSON.parse(JSON.stringify(this.originalBillsData))); // Log bản sao để tránh vấn đề tham chiếu

    this.applyFilters();
    this.loadedData = true;
    console.log('--- Kết thúc loadDataBills ---');
  }

  onDateChange(event: Date | [Date | null, Date | null] | null): void {
    console.log('--- Bắt đầu onDateChange ---');
    this.selectedDate = !!event;
    if (this.selectedDate) {
      this.loadDataBills();
    } else {
      this.originalBillsData = [];
      this.billsData = [];
      this.selectedShift = '';
      this.loadedData = true;
    }
     console.log('--- Kết thúc onDateChange ---');
  }

  onShiftSelectChange(event: Event | string): void { // Chấp nhận cả event hoặc string nếu dùng ngModelChange
    console.log('--- Bắt đầu onShiftSelectChange ---');
     if (typeof event === 'string') {
        this.selectedShift = event;
    } else {
        this.selectedShift = (event.target as HTMLSelectElement).value;
    }
    console.log('Ca được chọn (selectedShift):', this.selectedShift);
    this.applyFilters();
    console.log('--- Kết thúc onShiftSelectChange ---');
  }

  applyFilters(): void {
    console.log('--- Bắt đầu applyFilters ---');
    console.log('Dữ liệu gốc trước khi lọc ca (originalBillsData):', JSON.parse(JSON.stringify(this.originalBillsData)));
    console.log('Ca đang chọn để lọc (selectedShift):', this.selectedShift);

    let filteredData = [...this.originalBillsData];
    if (this.selectedShift === 'a' || this.selectedShift === 'b') {
      filteredData = filteredData.filter(bill => bill['shift'] === this.selectedShift);
      console.log('Dữ liệu sau khi lọc theo ca:', JSON.parse(JSON.stringify(filteredData)));
    } else {
       console.log('Không lọc theo ca cụ thể (hiển thị tất cả của ngày đã chọn).');
    }
    this.billsData = filteredData;
    console.log('Dữ liệu cuối cùng gán cho bảng (billsData):', JSON.parse(JSON.stringify(this.billsData)));
    console.log('--- Kết thúc applyFilters ---');
  }

  goToBillDetail(billId: IItem) {
    this.navAdminService.goToBillDetail(billId['id'].toString());
  }
}