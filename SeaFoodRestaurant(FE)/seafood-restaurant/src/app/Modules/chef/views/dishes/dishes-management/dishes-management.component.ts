import { Component } from '@angular/core';
import { CardModule, ColComponent, GutterDirective } from '@coreui/angular';
import { RowComponent } from '@coreui/angular-pro';
import { NumberFormatService } from '../../../../../core/services/numberFormat.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dishes-management',
  standalone: true,
  imports: [
    CardModule,
    RowComponent,
    ColComponent,
    CommonModule,
    GutterDirective,
    
  ],
  templateUrl: './dishes-management.component.html',
  styleUrl: './dishes-management.component.scss'
})
export class DishesManagementComponent {
  originalDishes: any[] = [
    {
      id: 1,
      name: "Phở",
      description: "Món ăn bình dân, nước phở đậm đà, thịt bò thượng hạng đạt chuẩn 5 sao",
      price: 50000,
      update_description: "Cập nhật 10 phút trước",
      img: "/assets/images/dishes/dish-default.png",
      active: true,
    },
    {
      id: 2,
      name: "Phở",
      description: "Món ăn bình dân, nước phở đậm đà, thịt bò thượng hạng đạt chuẩn 5 sao",
      price: 50000,
      update_description: "Cập nhật 10 phút trước",
      img: "/assets/images/dishes/dish-default.png",
      active: true,
    },
    {
      id: 3,
      name: "Bánh Pía",
      description: "Bánh ngọt phổ biến ở miền nam Việt Nam, có hương vị thơm ngon, thích hợp ăn tráng miệng",
      price: 7000,
      update_description: "Cập nhật 10 phút trước",
      img: "/assets/images/dishes/dish-default-2.jpg",
      active: false,
    },
    {
      id: 4,
      name: "Bánh Pía",
      description: "Bánh ngọt phổ biến ở miền nam Việt Nam, có hương vị thơm ngon, thích hợp ăn tráng miệng",
      price: 7000,
      update_description: "Cập nhật 10 phút trước",
      img: "/assets/images/dishes/dish-default-2.jpg",
      active: true,
    }
  ]

  dishes = [...this.originalDishes]

  constructor(
    private numberFormatService: NumberFormatService,
  ){}

  changePriceVND(price: number) {
    return this.numberFormatService.formatNumber(price)
  }

  onSelectChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;

    if (selectedValue === 'all') {
      this.dishes = [...this.originalDishes]; // Hiển thị tất cả các bàn
    } else if (selectedValue === 'active') {
      this.dishes = this.originalDishes.filter(dish => dish.active); // Chỉ hiển thị bàn đang hoạt động
    } else if (selectedValue === 'inactive') {
      this.dishes = this.originalDishes.filter(dish => !dish.active); // Chỉ hiển thị bàn đang trống
    }
  }

  toggleBtnDishState(dishId: number) {
    this.dishes.filter(
      dish => {
        if(dish['id'] == dishId) {
          dish['active'] = !dish['active']
        }
      }
    )
  }

}
