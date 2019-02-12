import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './Auth-Data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private token: string ;
  private tokenTimer: any ;
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
  createUser(email: string, password: string) {
    const authData: AuthData = {
      email,
      password
    };
    this.http.post('http://localhost:3000/api/users/signup', authData)
    .subscribe(response => {
      console.log(response);
    });
  }

  loginUser(email: string, password: string) {
    const authData: AuthData = {
      email,
      password
    };
    this.http.post<{ token: string, expiresIn: number }>('http://localhost:3000/api/users/login', authData)
    .subscribe(response => {
      this.token = response.token;
      if (this.token) {
        const expiresInDurration = response.expiresIn;
        this.setAuthTimer(expiresInDurration);
        this.isAuthenticated = true;
        this.authStatusListnner.next(true);
        const now = new Date();
        const expirationDate = new Date (now.getTime() + expiresInDurration * 1000);
        this.saveAuthData(this.token, expirationDate);
        this.router.navigate(['/']);
      }
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
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListnner.next(true);
    }
  }
  private setAuthTimer(duration: number) {
    console.log('duration : ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logOut();
    }, duration * 1000);
  }
  logOut() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListnner.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }
  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate)
    };
  }
}
