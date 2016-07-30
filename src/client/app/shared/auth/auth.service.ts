import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { AuthConfig, JwtHelper } from './index';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(private authConfig: AuthConfig, private http: Http) { }

  login(): Observable<boolean> {
    // let headers = new Headers();
    // headers.append('Content-Type', 'application/json');

    return this.http
      .get('app/shared/auth/token.json')
      .map(res => res.json())
      .map((res) => {
        if (res.success) {
          localStorage.setItem(this.authConfig.tokenName, res.auth_token);
          //this.loggedIn = true;
        }

        return res.success;
      });
  }

  isLoggedIn(): boolean {
    let jwtHelper = new JwtHelper();
    let token = this.authConfig.tokenGetter();
    return token && !jwtHelper.isTokenExpired(token, null);
  }
}
