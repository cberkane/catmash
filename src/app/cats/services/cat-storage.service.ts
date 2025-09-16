import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, first, forkJoin, map, Observable, throwError } from "rxjs";
import { collection, collectionData, CollectionReference, doc, Firestore, query, writeBatch, orderBy } from "@angular/fire/firestore";

import { Cat, CatAppearance, CatRemoteData } from "@src/app/cats/types/cat";
import { environment } from "@src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class CatStorageService {
  private firestore = inject(Firestore);
  private http = inject(HttpClient);

  private catsCollection = collection(this.firestore, "cats") as CollectionReference<Cat>;
  private appearancesCollection = collection(this.firestore, "cat_appearances") as CollectionReference<CatAppearance>;

  /**
   * Get cats data from remote source
   */
  fetchCatsData$(): Observable<CatRemoteData[]> {
    return this.http.get<{ images: CatRemoteData[] }>(environment.remoteApiUrl).pipe(
      map((res) => res.images),
      catchError(() => throwError(() => new Error("Une erreur est survenue lors de la récupération des images.")))
    );
  }

  /**
   * Fetch persisted cats from Firestore
   */
  fetchPersistedCats$(): Observable<Cat[]> {
    const request = query(this.catsCollection);
    return collectionData(request).pipe(
      first((res) => !!res),
      catchError(() => throwError(() => new Error("Une erreur est survenue lors de la récupération des chats.")))
    );
  }

  /**
   * Fetch cat appearances from Firestore
   */
  fetchCatAppearances$(): Observable<CatAppearance[]> {
    const request = query(this.appearancesCollection, orderBy("appearedAt", "desc"));
    return collectionData(request).pipe(
      first((res) => !!res),
      catchError(() => throwError(() => new Error("Une erreur est survenue lors de la récupération de l'historique des matchs.")))
    );
  }

  /**
   * Get all cats, merging remote data with persisted data
   */
  fetchCats$(): Observable<Cat[]> {
    return forkJoin([
      this.fetchCatsData$(),
      this.fetchPersistedCats$()
    ]).pipe(
      map(([catsData, persistedCats]) => this.mergeCats(catsData, persistedCats))
    );
  }

  /**
   * Merge cat data from remote source with persisted cats in Firestore
   */
  private mergeCats(remoteData: CatRemoteData[], persistedCats: Cat[]): Cat[] {
    const catsMap = new Map(persistedCats.map(cat => [cat.id, cat]));
    return remoteData.map((data) => {
      const match = catsMap.get(data.id);
      if (match) return match;

      return {
        id: data.id,
        imageUrl: data.url,
        score: 0,
        appearances: 0,
      };
    });
  }

  /**
   * Update multiple cats in Firestore using a batch operation
   */
  async updateCats(cats: Cat[]): Promise<void> {
    const batch = writeBatch(this.firestore);
    cats.forEach((cat) => {
      const docRef = doc(this.catsCollection, cat.id);
      batch.set(docRef, cat);
    });
    await batch.commit();
  }

  /**
   * Update multiple cat appearances in Firestore using a batch operation
   */
  async updateCatAppearances(appearances: CatAppearance[]): Promise<void> {
    const batch = writeBatch(this.firestore);
    appearances.forEach((appearance) => {
      const docRef = doc(this.appearancesCollection, appearance.catId);
      batch.set(docRef, appearance);
    });
    await batch.commit();
  }
}
