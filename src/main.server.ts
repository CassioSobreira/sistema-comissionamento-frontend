import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/apps/app';
import { config } from './app/apps/app.config.server';

const bootstrap = () => bootstrapApplication(App, config);

export default bootstrap;