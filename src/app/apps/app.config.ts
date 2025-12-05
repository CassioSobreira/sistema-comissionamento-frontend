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
            },
            translation: {
              dayNames: ["domingo","segunda-feira","terça-feira","quarta-feira","quinta-feira","sexta-feira","sábado"],
              dayNamesShort: ["dom","seg","ter","qua","qui","sex","sáb"],
              dayNamesMin: ["D","S","T","Q","Q","S","S"],
              monthNames: ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"],
              monthNamesShort: ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"],
              today: "Hoje",
              clear: "Limpar"
        }}),
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

