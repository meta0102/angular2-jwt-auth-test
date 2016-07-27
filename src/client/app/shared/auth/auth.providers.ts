import {provide} from '@angular/core';
import {Http, RequestOptions} from '@angular/http';
import {AuthHttp, AuthConfig} from './index';

export const AUTH_PROVIDERS: any = [
  provide(AuthHttp, {
    useFactory: (http: Http, options: RequestOptions) => {
      return new AuthHttp(new AuthConfig(), http, options);
    },
    deps: [Http, RequestOptions]
  })
];

export function provideAuth(config = {}): any[] {
  return [
    provide(AuthHttp, {
      useFactory: (http: Http, options: RequestOptions) => {
        return new AuthHttp(new AuthConfig(config), http, options);
      },
      deps: [Http, RequestOptions]
    })
  ];
}