// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { rootConfig } from './app/root.config';
import { RootComponent } from './app/root.component';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './app/services/auth.interceptor';

// ⚡ Bootstrapping de l'application avec les intercepteurs
bootstrapApplication(RootComponent, {
  ...rootConfig,
  providers: [
    ...(rootConfig.providers || []), // Garde les providers existants
    provideHttpClient(withInterceptorsFromDi()), // Permet l'utilisation d'intercepteurs DI
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, // Enregistrement de l'intercepteur
  ],
}).catch((err) => console.error(err));
