import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './Auth-Data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.MongoApiUrl + '/users';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private token: string ;
  private tokenTimer: any ;
  private userId: string ;
  private authStatusListnner = new Subject<boolean>();
  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }
  getAuthStatusListnner() {
    return this.authStatusListnner.asObservable();
  }
  getIsAuth() {
    return this.isAuthenticated;
  }
  getUserId() {
    return this.userId;
  }
  createUser(email: string, password: string) {
    const authData: AuthData = {
      email,
      password
    };
    this.http.post( BACKEND_URL + '/signup', authData)
    .subscribe(response => {
      console.log(response);
      this.router.navigate(['/']);
    }, err => {
      this.authStatusListnner.next(false);
    });
  }

  loginUser(email: string, password: string) {
    const authData: AuthData = {
      email,
      password
    };
    this.http.post<{ token: string, expiresIn: number, userId: string }>(BACKEND_URL + '/login', authData)
    .subscribe(response => {
      this.token = response.token;
      if (this.token) {
        const expiresInDurration = response.expiresIn;
        this.setAuthTimer(expiresInDurration);
        this.isAuthenticated = true;
        this.userId = response.userId;
        this.authStatusListnner.next(true);
        const now = new Date();
        const expirationDate = new Date (now.getTime() + expiresInDurration * 1000);
        this.saveAuthData(this.token, expirationDate, this.userId);
        this.router.navigate(['/']);
      }
    }, err => {
      this.authStatusListnner.next(false);
    });
  }
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn) {
      this.token = authInformation.token;
      this.userId = authInformation.userId;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListnner.next(true);
    }
  }
  logOut() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListnner.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }
  private setAuthTimer(duration: number) {
    console.log('duration : ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logOut();
    }, duration * 1000);
  }
  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expiration');
  }
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
      userId
    };
  }
}
