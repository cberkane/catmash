import { Component, inject, OnInit, OnDestroy } from "@angular/core";

import { Cat } from "@src/app/cats/types/cat";
import { CatService } from "@src/app/cats/services/cat.service";
import { Subscription } from "rxjs";

@Component({
  standalone: true,
  selector: "app-ranking-page",
  templateUrl: "./ranking-page.component.html",
  styleUrl: "./ranking-page.component.scss",
  imports: [],
})
export class RankingPageComponent implements OnInit, OnDestroy {
  catService = inject(CatService);

  ranking: Cat[];
  loading = false;
  error: string | null = null;

  private subscription = new Subscription();

  ngOnInit(): void {
    this.loadRanking();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadRanking(): void {
    this.loading = true;
    const sub = this.catService.getCatRanking$().subscribe({
      next: (ranking) => {
        this.ranking = ranking;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        if (error instanceof Error) this.error = error.message;
        else this.error = "An unexpected error occurred. Please try again later.";
      },
    });
    this.subscription.add(sub);
  }
}
