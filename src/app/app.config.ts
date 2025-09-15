import { provideHttpClient } from "@angular/common/http";
import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { getFirestore, provideFirestore } from "@angular/fire/firestore";
import { provideAngularSvgIcon } from "angular-svg-icon";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";

import { routes } from "./app.routes";
import { environment } from "./../environments/environment";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAngularSvgIcon(),
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
};
