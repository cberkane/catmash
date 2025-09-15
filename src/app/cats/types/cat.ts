export interface Cat {
  id: string;
  imageUrl: string;
  score: number;
  appearances: number;
}

export interface CatAppearance {
  catId: string;
  appearedAt: string;
}

export interface CatRemoteData {
  id: string;
  url: string;
}

export interface CatMatch {
  winner: Cat;
  loser: Cat;
}
