import {Injectable} from '@angular/core';

export interface IAuthConfig {
  headerName: string;
  headerPrefix: string;
  tokenName: string;
  tokenGetter: any;
  noJwtError: boolean;
  globalHeaders: Array<Object>;
  noTokenScheme?: boolean;
}

/* If you wish to override the default AuthConfig settings, the easiest
   way to do so is to set the desired values in the relevant method
   in auth.providers.ts
*/
@Injectable()
export class AuthConfig {
  headerName: string;
  headerPrefix: string;
  tokenName: string;
  tokenGetter: any;
  noJwtError: boolean;
  noTokenScheme: boolean;
  globalHeaders: Array<Object>;

  constructor(config: any = {}) {
    this.headerName = config.headerName || 'Authorization';
    if (config.headerPrefix) {
      this.headerPrefix = config.headerPrefix + ' ';
    } else if (config.noTokenScheme) {
      this.headerPrefix = '';
    } else {
      this.headerPrefix = 'Bearer ';
    }
    this.tokenName = config.tokenName || 'id_token';
    this.noJwtError = config.noJwtError || false;
    this.tokenGetter = config.tokenGetter || (() => localStorage.getItem(this.tokenName));
    this.globalHeaders = config.globalHeaders || [];
    this.noTokenScheme = config.noTokenScheme || false;
  }

  getConfig(): IAuthConfig {
    return {
      headerName: this.headerName,
      headerPrefix: this.headerPrefix,
      tokenName: this.tokenName,
      tokenGetter: this.tokenGetter,
      noJwtError: this.noJwtError,
      noTokenScheme: this.noTokenScheme,
      globalHeaders: this.globalHeaders
    }
  }
}
