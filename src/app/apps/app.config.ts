import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { ConfirmationService, MessageService } from 'primeng/api';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http'; // Importação adicionada
import { authInterceptor } from '../../interceptors/auth-interceptor';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { DialogService } from 'primeng/dynamicdialog'; // <--- IMPORTE ESTE SERVIÇO
export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: Aura
            }
        }),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),
    MessageService,
    ConfirmationService,
    DialogService,
    provideHttpClient(withInterceptors([authInterceptor])) // Provider adicionado
  ]
};

