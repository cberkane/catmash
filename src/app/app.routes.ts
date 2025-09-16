import { Routes } from "@angular/router";
import { VotingPageComponent } from "./cats/pages/voting-page/voting-page.component";
import { RankingPageComponent } from "./cats/pages/ranking-page/ranking-page.component";

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "voting",
  },
  {
    path: "voting",
    component: VotingPageComponent,
  },
  {
    path: "ranking",
    component: RankingPageComponent,
  },
  {
    path: "**",
    loadComponent: () => import("./shared/pages/not-found-page/not-found-page.component").then((m) => m.NotFoundPageComponent),
  },
];
