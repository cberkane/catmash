import { Component, OnInit, inject } from "@angular/core";

import { CatService } from "@src/app/cats/services/cat.service";
import { Cat, CatMatch } from "@src/app/cats/types/cat";
import { VotingCardComponent } from "../../components/voting-card/voting-card.component";

@Component({
  standalone: true,
  selector: "app-voting-page",
  templateUrl: "./voting-page.component.html",
  styleUrl: "./voting-page.component.scss",
  imports: [
    VotingCardComponent,
  ],
})
export class VotingPageComponent implements OnInit {
  catService = inject(CatService);

  cat1: Cat;
  cat2: Cat;
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.loadNewOpponents();
  }

  loadNewOpponents(): void {
    this.loading = true;
    this.error = null;
    this.catService.selectCatOpponents$().subscribe({
      next: ([cat1, cat2]) => {
        this.cat1 = cat1;
        this.cat2 = cat2;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        if (err instanceof Error) this.error = err.message;
        else this.error = "An unexpected error occurred. Please try again later.";
      },
    });
  }

  async onVote(match: CatMatch): Promise<void> {
    try {
      await this.catService.recordVote(match);
      this.loadNewOpponents();
    } catch (err) {
      if (err instanceof Error) {
        this.error = err.message;
      }
    }
  }
}
