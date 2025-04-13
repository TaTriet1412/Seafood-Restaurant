import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CardModule, ColComponent, GutterDirective } from '@coreui/angular';
import { RowComponent } from '@coreui/angular-pro';
import { NumberFormatService } from '../../../../../core/services/numberFormat.service';
import { firstValueFrom } from 'rxjs';
// import { HttpClient, HttpErrorResponse } from '@angular/common/http'; // Removed - Not used directly
// import { DomSanitizer } from '@angular/platform-browser'; // Removed - Not used
import { DishService } from '../../../../../core/services/dish.service';
import { HttpClient } from '@angular/common/http';
import { ImageService } from '../../../../../core/services/image.service';
import { forkJoin } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { DishRes } from '../../../../../share/dto/response/dish-response';


@Component({
  selector: 'app-dishes-management',
  standalone: true,
  imports: [
    CardModule,
    RowComponent,
    ColComponent,
    CommonModule, // Keep for *ngFor, *ngIf etc.
    GutterDirective
  ],
  templateUrl: './dishes-management.component.html',
  styleUrl: './dishes-management.component.scss'
})
export class DishesManagementComponent implements OnInit {
  componentError: string | null = null;
  dishes: any[] = []; // Use the Dish interface
  originalDishes: any[] = []; // Store the original dishes for filtering

  constructor(
    private spinner: NgxSpinnerService,
    private imageService: ImageService,
    private numberFormatService: NumberFormatService,
    private dishService: DishService,
  ) { }

  changePriceVND(price: number): string {
    return this.numberFormatService.formatNumber(price);
  }

  async ngOnInit(): Promise<void> {
    // No need for markForCheck here unless OnPush is used and needed specifically
    // this.cdf.markForCheck();
    this.spinner.show()
    this.componentError = null; // Reset error on init
    console.log('Fetching dishes...');

    try {
      const fetchedDishes = await firstValueFrom(this.dishService.getDishes());

      const imageObservables = fetchedDishes.map((dish: DishRes) =>
        this.imageService.getImage(dish.image)
      );

      console.log('Fetched dishes:', fetchedDishes);

      forkJoin(imageObservables).subscribe(imageUrls => {
        this.dishes = fetchedDishes.map((dish, index) => ({
          ...dish,
          image: imageUrls[index]
        }));

        console.log('Dishes fetched successfully:', this.dishes);
      });
    } catch (error: any) { // Catch specific errors if possible (e.g., HttpErrorResponse)
      console.error('Error fetching dishes:', error);
      this.componentError = `Failed to load menu items. ${error.message || 'Please try again later.'}`;
      this.dishes = []; // Clear dishes on error
    } finally {
      setTimeout(() => {
        this.spinner.hide()
      }, 750);
      // If using OnPush, you might need markForCheck here after state updates
      // this.cdf.markForCheck();
    }
  }

  onSelectChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;

    if (selectedValue === 'all') {
      this.dishes = [...this.originalDishes]; // Hiển thị tất cả các bàn
    } else if (selectedValue === 'active') {
      this.dishes = this.originalDishes.filter(dish => dish.able); // Chỉ hiển thị bàn đang hoạt động
    } else if (selectedValue === 'inactive') {
      this.dishes = this.originalDishes.filter(dish => !dish.able); // Chỉ hiển thị bàn đang trống
    }
  }

  async toggleBtnDishState(dishId: number) {

    await firstValueFrom (this.dishService.toggleAbleDish(dishId));
    this.dishes.filter(
      dish => {
        if(dish['id'] == dishId) {
          dish['able'] = !dish['able']
        }
      }
    )
  }
}