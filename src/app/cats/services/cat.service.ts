import { inject, Injectable } from "@angular/core";
import { forkJoin, map, Observable } from "rxjs";

import { Cat, CatAppearance, CatMatch } from "@src/app/cats/types/cat";
import { CatStorageService } from "@src/app/cats/services/cat-storage.service";

@Injectable({
  providedIn: "root",
})
export class CatService {
  private readonly MAX_RECENT_HISTORY = 8;
  private catStorage = inject(CatStorageService);

  /**
   * Expose an observable that emits the ranking of cats sorted by score and appearances
   */
  getCatRanking$(): Observable<Cat[]> {
    return this.catStorage.fetchCats$().pipe(
      map((cats) =>
        cats.sort((a, b) => {
          if (b.score === a.score) {
            return a.appearances - b.appearances;
          }
          return b.score - a.score;
        })
      )
    );
  }

  /**
   * Expose an observable that emits two cat opponents for voting
   */
  selectCatOpponents$(): Observable<[Cat, Cat]> {
    return forkJoin([
      this.catStorage.fetchCats$(),
      this.catStorage.fetchCatAppearances$()
    ]).pipe(
      map(([cats, appearances]) => this.selectCatOpponents(cats, appearances))
    );
  }

  /**
   * Select two cat opponents for voting, avoiding recently seen and most appeared cats.
   */
  private selectCatOpponents(cats: Cat[], appearances: CatAppearance[]): [Cat, Cat] {
    const unseenCats = this.getUnseenCats(cats, appearances);
    const leastAppearedCats = this.getLeastAppeared(unseenCats);
    if (leastAppearedCats.length < 2) {
      const secondCat = unseenCats[Math.floor(Math.random() * unseenCats.length)];
      return [leastAppearedCats[0], secondCat];
    }

    leastAppearedCats.sort(() => Math.random() - 0.5);
    return [leastAppearedCats[0], leastAppearedCats[1]];
  }

  /**
   * Get unseen cats by filtering out recently appeared cats.
   */
  private getUnseenCats(cats: Cat[], appearances: CatAppearance[]): Cat[] {
    const recentAppearances = appearances.slice(0, this.MAX_RECENT_HISTORY);
    return cats.filter((c) => !recentAppearances.some((h) => h.catId === c.id));
  }

  /**
   * Get cats with the least number of appearances.
   */
  private getLeastAppeared(cats: Cat[]): Cat[] {
    const minAppearance = Math.min(...cats.map((cat) => cat.appearances));
    return cats.filter((c) => c.appearances === minAppearance);
  }

  /**
   * Register a vote for a cat, updating scores and appearances.
   */
  async recordVote({ winner, loser }: CatMatch): Promise<void> {
    try {
      winner.score += 1;
      winner.appearances += 1;
      loser.appearances += 1;
      await this.catStorage.updateCats([winner, loser]);

      const newAppearences: CatAppearance[] = [
        { catId: winner.id, appearedAt: new Date().toISOString() },
        { catId: loser.id, appearedAt: new Date().toISOString() },
      ];
      await this.catStorage.updateCatAppearances(newAppearences);
      this.countPlayedMatches();
    } catch (error) {
      console.error("Error recording vote:", error);
      throw new Error("Failed to register the vote. Please try again later.");
    }
  }

  getPlayedMatches(): number {
    const playedMatches = localStorage.getItem("playedMatches");
    return Number(playedMatches ?? "0");
  }

  private countPlayedMatches(): void {
    const playedMatches = localStorage.getItem("playedMatches");
    if (!playedMatches) localStorage.setItem("playedMatches", "0");

    const count = parseInt(playedMatches ?? "0", 10) + 1;
    localStorage.setItem("playedMatches", count.toString());
  }
}
