import { RouterConfig } from '@angular/router';
import { AboutComponent } from './index';
import { CanActivateAuthGuard } from '../shared/index';

export const AboutRoutes: RouterConfig = [
  {
    path: 'about',
    component: AboutComponent,
    canActivate: [CanActivateAuthGuard]
  }
];
