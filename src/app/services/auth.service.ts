import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLogin = false;

  roleAs: string;

  constructor() { }

  login(value: string) {
    this.isLogin = true;
    this.roleAs = value;
    return of({ success: this.isLogin, role: this.roleAs });
  }

  logout() {
    this.isLogin = false;
    this.roleAs = '';
    return of({ success: this.isLogin, role: '' });
  }

  isLoggedIn() {
    return this.isLogin;
  }

  getRole() {
    return this.roleAs;
  }

}
