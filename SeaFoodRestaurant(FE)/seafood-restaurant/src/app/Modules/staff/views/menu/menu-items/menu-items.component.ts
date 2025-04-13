import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CardModule, ColComponent } from '@coreui/angular';
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
  selector: 'app-menu-items',
  standalone: true,
  imports: [
    CardModule,
    RowComponent,
    ColComponent,
    CommonModule, // Keep for *ngFor, *ngIf etc.
  ],
  templateUrl: './menu-items.component.html',
  styleUrl: './menu-items.component.scss',
  // Consider adding OnPush for performance if inputs are the primary driver of change
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuItemsComponent implements OnInit {
  componentError: string | null = null;
  dishes: any[] = []; // Use the Dish interface


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
}