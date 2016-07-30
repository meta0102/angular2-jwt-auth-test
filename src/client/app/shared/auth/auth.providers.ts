import { provide } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { AuthConfig } from './index';

// Export AuthHttp provider with default settings
export const AUTH_PROVIDERS: any = [  
  provideAuthConfig()
];

// Provide AuthConfig with default or specified settings.
export function provideAuthConfig(config = {}): any {
  return provide(AuthConfig, {
    useFactory: () => {
      return new AuthConfig(config);
    }
  });
}
