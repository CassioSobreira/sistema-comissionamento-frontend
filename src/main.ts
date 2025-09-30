import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/apps/app.config';
import { App } from './app/apps/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
