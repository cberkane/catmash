import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { connectFirestoreEmulator, getFirestore, provideFirestore } from "@angular/fire/firestore";
import { of, throwError } from "rxjs";

import { environment } from "@src/environments/environment";
import { CatStorageService } from "./cat-storage.service";
import { Cat, CatRemoteData } from "../types/cat";

describe("CatStorageService", () => {
  let service: CatStorageService;
  const localFirebase = () => {
    const store = getFirestore();
    connectFirestoreEmulator(store, "localhost", 8080);
    return store;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(localFirebase),
      ],
    });
    service = TestBed.inject(CatStorageService);
  });

  describe("fetchCats$", () => {
    const remoteData: CatRemoteData[] = [
      { id: "1", url: "url1" },
      { id: "2", url: "url2" },
      { id: "3", url: "url3" },
      { id: "4", url: "url4" },
      { id: "5", url: "url5" },
      { id: "6", url: "url6" },
    ];
    const persistedCats: Cat[] = [
      { id: "1", imageUrl: "url1", score: 10, appearances: 11 },
      { id: "2", imageUrl: "url2", score: 9, appearances: 10 },
      { id: "3", imageUrl: "url3", score: 8, appearances: 9 },
    ];

    it("Should merge remote data and persisted cats", () => {
      spyOn(service, "fetchCatsData$").and.returnValue(of(remoteData));
      spyOn(service, "fetchPersistedCats$").and.returnValue(of(persistedCats));

      service.fetchCats$().subscribe({
        next: (cats) => {
          expect(cats.length).toBe(6);
          expect(cats.find((cat) => cat.id === "1")?.score).toBe(10);
          expect(cats.find((cat) => cat.id === "2")?.score).toBe(9);
          expect(cats.find((cat) => cat.id === "3")?.score).toBe(8);
          expect(cats.find((cat) => cat.id === "4")?.score).toBe(0);
          expect(cats.find((cat) => cat.id === "5")?.score).toBe(0);
          expect(cats.find((cat) => cat.id === "6")?.score).toBe(0);
        },
      });
    });

    it("Should return cats with default values if no persisted cats", () => {
      spyOn(service, "fetchCatsData$").and.returnValue(of(remoteData));
      spyOn(service, "fetchPersistedCats$").and.returnValue(of([]));

      service.fetchCats$().subscribe({
        next: (cats) => {
          expect(cats.length).toBe(6);
          expect(cats.every((cat) => !!cat.id)).toBeTruthy();
          expect(cats.every((cat) => !!cat.imageUrl)).toBeTruthy();
          expect(cats.every((cat) => cat.score === 0)).toBeTruthy();
          expect(cats.every((cat) => cat.appearances === 0)).toBeTruthy();
        },
      });
    });

    it("Should handle remote data fetch error", () => {
      spyOn(service, "fetchCatsData$").and.returnValue(throwError(() => new Error("Network error")));
      spyOn(service, "fetchPersistedCats$").and.returnValue(of(persistedCats));

      service.fetchCats$().subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
        },
      });
    });

    it("Should handle persisted cats fetch error", () => {
      spyOn(service, "fetchCatsData$").and.returnValue(of(remoteData));
      spyOn(service, "fetchPersistedCats$").and.returnValue(throwError(() => new Error("Firestore error")));

      service.fetchCats$().subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
        },
      });
    });
  });
});
