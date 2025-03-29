import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardModule, ColComponent } from '@coreui/angular';
import { RowComponent } from '@coreui/angular-pro';
import { NumberFormatService } from '../../../../../core/services/numberFormat.service';

@Component({
  selector: 'app-menu-items',
  standalone: true,
  imports: [
    CardModule,
    RowComponent,
    ColComponent,
    CommonModule,
  ],
  templateUrl: './menu-items.component.html',
  styleUrl: './menu-items.component.scss'
})
export class MenuItemsComponent {
  dishes: any[] = [
    {
      name: "Phở",
      description: "Món ăn bình dân, nước phở đậm đà, thịt bò thượng hạng đạt chuẩn 5 sao",
      price: 50000,
      update_description: "Cập nhật 10 phút trước",
      img: "/assets/images/dishes/dish-default.png",
    },
    {
      name: "Phở",
      description: "Món ăn bình dân, nước phở đậm đà, thịt bò thượng hạng đạt chuẩn 5 sao",
      price: 50000,
      update_description: "Cập nhật 10 phút trước",
      img: "/assets/images/dishes/dish-default.png",
    },
    {
      name: "Bánh Pía",
      description: "Bánh ngọt phổ biến ở miền nam Việt Nam, có hương vị thơm ngon, thích hợp ăn tráng miệng",
      price: 7000,
      update_description: "Cập nhật 10 phút trước",
      img: "/assets/images/dishes/dish-default-2.jpg",
    },
    {
      name: "Bánh Pía",
      description: "Bánh ngọt phổ biến ở miền nam Việt Nam, có hương vị thơm ngon, thích hợp ăn tráng miệng",
      price: 7000,
      update_description: "Cập nhật 10 phút trước",
      img: "/assets/images/dishes/dish-default-2.jpg",
    }
  ]

  
  constructor(
    private numberFormatService: NumberFormatService,
  ){}
  changePriceVND(price: number) {
    return this.numberFormatService.formatNumber(price)
  }
}
