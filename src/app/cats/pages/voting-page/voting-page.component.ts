import { Component, OnInit, inject } from "@angular/core";

import { VotingCardComponent } from "@src/app/cats/components/voting-card/voting-card.component";
import { CatService } from "@src/app/cats/services/cat.service";
import { Cat, CatMatch } from "@src/app/cats/types/cat";
import { BottomNavComponent } from "@src/app/shared/components/bottom-nav/bottom-nav.component";
import { NavItem } from "@src/app/shared/types/nav-item";

@Component({
  standalone: true,
  selector: "app-voting-page",
  templateUrl: "./voting-page.component.html",
  styleUrl: "./voting-page.component.scss",
  imports: [VotingCardComponent, BottomNavComponent],
})
export class VotingPageComponent implements OnInit {
  catService = inject(CatService);

  cat1: Cat;
  cat2: Cat;
  loading = false;
  error: string | null = null;
  navItem: NavItem = {
    route: "/ranking",
    label: "Voir le classement",
  };

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
        this.navItem.info = `${this.catService.getPlayedMatches()} parties jouées`;
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
