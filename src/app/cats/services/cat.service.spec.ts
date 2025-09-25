import { TestBed } from "@angular/core/testing";
import { of, throwError } from "rxjs";

import { CatService } from "./cat.service";
import { CatStorageService } from "./cat-storage.service";
import { Cat, CatAppearance } from "../types/cat";

describe("CatService", () => {
  let catService: CatService;
  let catStorageSpy: jasmine.SpyObj<CatStorageService>;

  const catsFixtures: Cat[] = [
    { id: "1", imageUrl: "url1", score: 10, appearances: 11 },
    { id: "2", imageUrl: "url2", score: 9, appearances: 10 },
    { id: "3", imageUrl: "url3", score: 8, appearances: 9 },
    { id: "4", imageUrl: "url4", score: 6, appearances: 9 },
    { id: "5", imageUrl: "url5", score: 5, appearances: 8 },
    { id: "6", imageUrl: "url6", score: 4, appearances: 8 },
    { id: "7", imageUrl: "url7", score: 3, appearances: 7 },
    { id: "8", imageUrl: "url8", score: 2, appearances: 7 }, // MAX_RECENT_HISTORY = 8
    { id: "9", imageUrl: "url9", score: 1, appearances: 5 },
    { id: "10", imageUrl: "url10", score: 0, appearances: 5 },  
    { id: "11", imageUrl: "url11", score: 0, appearances: 4 }, // Least appearances
    { id: "12", imageUrl: "url12", score: 0, appearances: 4 },
    { id: "13", imageUrl: "url13", score: 0, appearances: 4 },
    { id: "14", imageUrl: "url14", score: 0, appearances: 4 },
  ];
  const appearancesFixtures: CatAppearance[] = [
    { catId: "1", appearedAt: "2025-01-10" },
    { catId: "2", appearedAt: "2025-01-10" },
    { catId: "3", appearedAt: "2025-01-09" },
    { catId: "4", appearedAt: "2025-01-09" },
    { catId: "5", appearedAt: "2025-01-08" },
    { catId: "6", appearedAt: "2025-01-08" },
    { catId: "7", appearedAt: "2025-01-07" },
    { catId: "8", appearedAt: "2025-01-07" }, // MAX_RECENT_HISTORY = 8
    { catId: "9", appearedAt: "2025-01-06" },
    { catId: "10", appearedAt: "2025-01-06" },
  ];
  const catsFixturesOneLeft = [
    ...catsFixtures, 
    { id: "15", imageUrl: "url15", score: 0, appearances: 1 }
  ];
  const catFixturesEvenScores = [
    { id: "101", imageUrl: "url101", score: 15, appearances: 12 },
    { id: "102", imageUrl: "url102", score: 15, appearances: 11 },
    { id: "103", imageUrl: "url103", score: 15, appearances: 10 },
    ...catsFixtures,
  ];

  beforeEach(() => {
    catStorageSpy = jasmine.createSpyObj<CatStorageService>("CatStorageService", [
      "fetchCats$", 
      "fetchCatAppearances$",
    ]);
    TestBed.overrideProvider(CatStorageService, { useValue: catStorageSpy });
    catService = TestBed.inject(CatService);
  });

  describe("selectCatOpponents$", () => {
    it("Should select two different cats for voting", () => {
      catStorageSpy.fetchCats$.and.returnValue(of(catsFixtures));
      catStorageSpy.fetchCatAppearances$.and.returnValue(of(appearancesFixtures));

      catService.selectCatOpponents$().subscribe({
        next: (cats) => {
          expect(cats.length).toBe(2);
          expect(cats[0].id).not.toBe(cats[1].id);
        },
      });
    });

    it("Should select two different cats for voting with no appearances", () => {
      catStorageSpy.fetchCats$.and.returnValue(of(catsFixtures));
      catStorageSpy.fetchCatAppearances$.and.returnValue(of([]));

      catService.selectCatOpponents$().subscribe({
        next: (cats) => {
          expect(cats.length).toBe(2);
          expect(cats[0].id).not.toBe(cats[1].id);
        },
      });
    });

    it("Should select cats with the least appearances", () => {
      catStorageSpy.fetchCats$.and.returnValue(of(catsFixtures));
      catStorageSpy.fetchCatAppearances$.and.returnValue(of(appearancesFixtures));

      catService.selectCatOpponents$().subscribe({
        next: (cats) => {
          expect(cats[0].appearances).toBeLessThanOrEqual(4);
          expect(cats[1].appearances).toBeLessThanOrEqual(4);
        },
      });
    });

    it("Should not select recently appeared cats", () => {
      catStorageSpy.fetchCats$.and.returnValue(of(catsFixtures));
      catStorageSpy.fetchCatAppearances$.and.returnValue(of(appearancesFixtures));

      catService.selectCatOpponents$().subscribe({
        next: (cats) => {
          const recentCatIds = ["1", "2", "3", "4", "5", "6", "7", "8"];
          expect(recentCatIds).not.toContain(cats[0].id);
          expect(recentCatIds).not.toContain(cats[1].id);
        },
      });
    });

    it("Should handle edge case when only 1 eligible cat exists", () => {
      catStorageSpy.fetchCats$.and.returnValue(of(catsFixturesOneLeft));
      catStorageSpy.fetchCatAppearances$.and.returnValue(of(appearancesFixtures));
      
      catService.selectCatOpponents$().subscribe({
        next: (cats) => {
          expect(cats.length).toBe(2);
          expect(cats[0].id).toBe("15");
          expect(cats[1].id).not.toBe("15");
        },
      });
    });

    it("Should handle fetchCats$ error", () => {
      catStorageSpy.fetchCats$.and.returnValue(throwError(() => new Error("Fetch cats error")));
      catStorageSpy.fetchCatAppearances$.and.returnValue(of(appearancesFixtures));

      catService.selectCatOpponents$().subscribe({
        error: (err) => {
          expect(err).toBeTruthy();
        },
      });
    });

    it("Should handle fetchCatAppearances$ error", () => {
      catStorageSpy.fetchCats$.and.returnValue(of(catsFixtures));
      catStorageSpy.fetchCatAppearances$.and.returnValue(throwError(() => new Error("Fetch appearances error")));

      catService.selectCatOpponents$().subscribe({
        error: (err) => {
          expect(err).toBeTruthy();
        },
      });
    });
  });

  describe("getCatRanking$", () => {
    it("Should return cats sorted by score", () => {
      catStorageSpy.fetchCats$.and.returnValue(of(catsFixtures));

      catService.getCatRanking$().subscribe({
        next: (ranking) => {
          const [first, second, third] = ranking;
          expect(first.id).toBe("1");
          expect(second.id).toBe("2");
          expect(third.id).toBe("3");

          expect(second.score).toBeGreaterThanOrEqual(third.score);
          expect(first.score).toBeGreaterThanOrEqual(second.score);
        },
      });
    });

    it("Should sort cats with the same score by their appearances", () => {
      catStorageSpy.fetchCats$.and.returnValue(of(catFixturesEvenScores));

      catService.getCatRanking$().subscribe({
        next: (ranking) => {
          const [first, second, third] = ranking;
          expect(first.id).toBe("103");
          expect(second.id).toBe("102");
          expect(third.id).toBe("101");

          expect(first.appearances).toBeLessThanOrEqual(second.appearances);
          expect(second.appearances).toBeLessThanOrEqual(third.appearances);
        },
      });
    });

    it("Should handle fetchCats$ error", () => {
      catStorageSpy.fetchCats$.and.returnValue(throwError(() => new Error("Fetch cats error")));

      catService.getCatRanking$().subscribe({
        error: (err) => {
          expect(err).toBeTruthy();
        },
      });
    });
  });
});
