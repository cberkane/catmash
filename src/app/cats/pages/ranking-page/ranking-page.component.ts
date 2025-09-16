import { NgClass, SlicePipe } from "@angular/common";
import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { Subject, takeUntil } from "rxjs";

import { RankingCardComponent } from "@src/app/cats/components/ranking-card/ranking-card.component";
import { CatService } from "@src/app/cats/services/cat.service";
import { Cat } from "@src/app/cats/types/cat";
import { BottomNavComponent } from "@src/app/shared/components/bottom-nav/bottom-nav.component";
import { StateWrapperComponent } from "@src/app/shared/components/state-wrapper/state-wrapper.component";
import { NavItem } from "@src/app/shared/types/nav-item";

@Component({
  standalone: true,
  selector: "app-ranking-page",
  templateUrl: "./ranking-page.component.html",
  styleUrl: "./ranking-page.component.scss",
  imports: [
    SlicePipe, 
    NgClass, 
    BottomNavComponent,
    RankingCardComponent, 
    StateWrapperComponent,
  ],
})
export class RankingPageComponent implements OnInit, OnDestroy {
  catService = inject(CatService);

  cats: Cat[];
  loading = false;
  error: string | null = null;
  navItem: NavItem = {
    route: "/voting",
    label: "Retourner au vote",
  };

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadRanking();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadRanking(): void {
    this.loading = true;
    this.catService.getCatRanking$()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (ranking) => {
        this.cats = ranking;
        this.loading = false;
        this.navItem.info = `${this.catService.getPlayedMatches()} parties jouées`;
      },
      error: (error) => {
        this.loading = false;
        if (error instanceof Error) this.error = error.message;
        else this.error = "Une erreur inattendue est survenue. Veuillez réessayer plus tard.";
      },
    });
  }
}
