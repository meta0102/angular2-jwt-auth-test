import {Injectable} from '@angular/core';
import {Http, Headers, Request, RequestOptions, RequestOptionsArgs, RequestMethod, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {IAuthConfig, AuthConfig, JwtHelper} from './index';

/**
 * Allows for explicit authenticated HTTP requests.
 */

@Injectable()
export class AuthHttp {

  private config: IAuthConfig;
  private jwtHelper: JwtHelper;
  tokenStream: Observable<string>;

  constructor(options: AuthConfig, private http: Http, private requestOptions?: RequestOptions) {
    this.config = options.getConfig();

    this.tokenStream = new Observable<string>((obs: any) => {
      obs.next(this.config.tokenGetter());
    });

    this.jwtHelper = new JwtHelper;
  }

  setGlobalHeaders(headers: Array<Object>, request: Request | RequestOptionsArgs): void {
    if (!request.headers) {
      request.headers = new Headers();
    }
    headers.forEach((header: Object) => {
      let key: string = Object.keys(header)[0];
      let headerValue: string = (<any>header)[key];
      request.headers.set(key, headerValue);
    });
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    if (typeof url === 'string') {
      return this.get(url, options); // Recursion: transform url from String to Request
    }

    // from this point url is always an instance of Request;
    let req: Request = <Request>url;
    let token: string = this.config.tokenGetter();
    if (this.jwtHelper.isTokenExpired(token)) {
      if (!this.config.noJwtError) {
        return new Observable<Response>((obs: any) => {
          obs.error(new Error('No JWT present or has expired'));
        });
      }
    } else {
      req.headers.set(this.config.headerName, this.config.headerPrefix + token);
    }
    return this.http.request(req);
  }

  private mergeOptions(defaultOpts: RequestOptions, providedOpts: RequestOptionsArgs): RequestOptions {
    let newOptions = defaultOpts || new RequestOptions();
    if (this.config.globalHeaders) {
      this.setGlobalHeaders(this.config.globalHeaders, providedOpts);
    }

    newOptions = newOptions.merge(new RequestOptions(providedOpts));
    return newOptions;
  }

  private requestHelper(requestArgs: RequestOptionsArgs, additionalOptions: RequestOptionsArgs): Observable<Response> {
    let options = new RequestOptions(requestArgs);
    if (additionalOptions) {
      options = options.merge(additionalOptions);
    }
    return this.request(new Request(this.mergeOptions(this.requestOptions, options)));
  }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.requestHelper({ url: url, method: RequestMethod.Get }, options);
  }

  post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.requestHelper({ url: url, body: body, method: RequestMethod.Post }, options);
  }

  put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.requestHelper({ url: url, body: body, method: RequestMethod.Put }, options);
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.requestHelper({ url: url, method: RequestMethod.Delete }, options);
  }

  patch(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.requestHelper({ url: url, body: body, method: RequestMethod.Patch }, options);
  }

  head(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.requestHelper({ url: url, method: RequestMethod.Head }, options);
  }
}
