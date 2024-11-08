import {Component, inject, OnInit} from '@angular/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {CategoryService} from './category.service';
import {Category, CategoryName} from './category.model';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map} from 'rxjs';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    FontAwesomeModule
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements  OnInit {
  //for better user experience, lets make bar reactive for each category
  isHome = false;
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.fetchCategories();
    this.currentActivatedCategory.activated = false;//we don't want that any of categories activated.
    this.listenRouter();//we need to listen it so that it know that is it on home url or not.
  }

  categoryService = inject(CategoryService);

  categories: Category[] | undefined;

  currentActivatedCategory = this.categoryService.getCategoryByDefault();

  private fetchCategories() {
    this.categories = this.categoryService.getCategories();
  }


  private listenRouter() {
    this.router.events.pipe(
      filter((change): change is NavigationEnd => change instanceof NavigationEnd)
    ).subscribe({
      next: (change: NavigationEnd) => {
        this.isHome = change.url.split("?")[0] === "/";

        if (this.isHome && change.url.indexOf("?") === -1) {
          const categoryByTechnicalName = this.categoryService.getCategoryByTechnicalName("ALL");
          this.categoryService.changeCategory(categoryByTechnicalName!);
        }
      },
    });

    //now let's detect the category param in the url.
    this.activatedRoute.queryParams.pipe(map(params => params['category'])).subscribe({
      next:(categoryName: CategoryName) => {
       const categoryByTechnicalName=this.categoryService.getCategoryByTechnicalName(categoryName);
       //we introduce it so that we can use conditions below.

       if(categoryByTechnicalName){
          this.activateCategory(categoryByTechnicalName);
          this.categoryService.changeCategory(categoryByTechnicalName);
       }
      }
    });
  }

//first we sure it is close, then we are assigning the new category then we are making it true.
  private activateCategory(category: Category) {
    this.currentActivatedCategory.activated=false;
    this.currentActivatedCategory=category;//assign the new one.
    this.currentActivatedCategory.activated=true;

  }

  onChangeCategory(category:Category){
    this.activateCategory(category);

    //[] represents the empty url.
    this.router.navigate([], {
      queryParams:{"category":category.technicalName}, relativeTo:this.activatedRoute //like this it is loading anyway even in same url.
    })
  };
}
