import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardModule, ColComponent } from '@coreui/angular';
import { RowComponent } from '@coreui/angular-pro';
import { NumberFormatService } from '../../../../../core/services/numberFormat.service';
import { firstValueFrom } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

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
export class MenuItemsComponent implements OnInit {
  isLoadingAllImages: boolean = true; // Overall loading state
  componentError: string | null = null; 
  dishes: any[] = [
    {
      name: "Phở",
      description: "Món ăn bình dân, nước phở đậm đà, thịt bò thượng hạng đạt chuẩn 5 sao",
      price: 50000,
      update_description: "Cập nhật 10 phút trước",
      img: "http://localhost:8080/seafood_restaurant/images?path=template/blank_service.png",
    },
    {
      name: "Phở",
      description: "Món ăn bình dân, nước phở đậm đà, thịt bò thượng hạng đạt chuẩn 5 sao",
      price: 50000,
      update_description: "Cập nhật 10 phút trước",
      img: "http://localhost:8080/seafood_restaurant/images?path=template/blank_service.png",
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
    private http: HttpClient,
    private numberFormatService: NumberFormatService,
    private sanitizer: DomSanitizer,
  ){}
  changePriceVND(price: number) {
    return this.numberFormatService.formatNumber(price)
  }

  async ngOnInit(): Promise<void> {
    this.isLoadingAllImages = true;
    this.componentError = null;

    // Process all dishes to fetch images where needed
    const imageProcessingPromises = this.dishes.map(async (dish, index) => {
      // Only process images that are full URLs (likely needing backend fetch)
      // Keep local assets (/assets/...) as they are
      if (typeof dish.img === 'string' && (dish.img.startsWith('http://') || dish.img.startsWith('https://'))) {
        try {
            // Indicate loading for this specific image
            this.dishes[index] = { ...dish, isLoadingImage: true, imageError: false };

            // Fetch the image as a Blob - JWT should be added by an interceptor
            const blob = await firstValueFrom(this.http.get(dish.img, { responseType: 'blob' }));

            // Create a safe URL from the Blob
            const objectURL = URL.createObjectURL(blob);
            const safeImageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);

            // Update the dish in the array with the safe URL
            // Important: create a new object reference for change detection if needed
            this.dishes[index] = { ...dish, img: safeImageUrl, isLoadingImage: false };

            // Note: Object URLs should be revoked when no longer needed to free memory,
            // typically in ngOnDestroy or when the image source changes.
            // However, for a list that persists, managing this can be complex.
            // Browsers often handle garbage collection, but be mindful of potential memory leaks
            // in long-lived components with many blob URLs.

        } catch (error) {
            console.error(`Error fetching image for dish "${dish.name}" from ${dish.img}:`, error);
            // Handle error: Mark image as failed, maybe keep original URL or use a fallback
            let errorMessage = 'Image load failed';
            if (error instanceof HttpErrorResponse) {
                errorMessage = `Image load failed: ${error.status}`;
            }
             // Update the dish in the array to reflect the error
            this.dishes[index] = { ...dish, isLoadingImage: false, imageError: true /*, img: '/assets/images/error-placeholder.png' */ }; // Keep original img or set placeholder
        }
      } else {
          // If it's already a SafeResourceUrl or a local path, no action needed
          // Ensure loading/error flags are reset if they were somehow set
          this.dishes[index] = { ...dish, isLoadingImage: false, imageError: false };
          return Promise.resolve(); // Return a resolved promise for non-fetched items
      }
    });

    try {
      // Wait for all image fetch/processing attempts to complete
      await Promise.all(imageProcessingPromises);
      console.log('All image processing finished.');
    } catch (overallError) {
        // This catch might not be strictly necessary if individual errors are handled above,
        // but can catch errors in the mapping/setup phase.
        console.error('An unexpected error occurred during image processing setup:', overallError);
        this.componentError = 'Failed to process some images.';
    } finally {
      this.isLoadingAllImages = false; // Set overall loading to false
    }
  }

}
