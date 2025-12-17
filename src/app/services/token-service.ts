import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
// servicio para gestionar los tokens 
export class TokenService {
  // constantes de los tokens
  CONST_ACCESS_TOKEN = 'accessToken';
  CONST_REFRESH_TOKEN = 'refreshToken';
  CONST_SESSION_USERNAME = 'sessionUsername';

  // accessToken
  getAccessToken(): string | null {
    return localStorage.getItem(this.CONST_ACCESS_TOKEN);
  }
  setAccessToken(accessToken: string): void {
    localStorage.setItem(this.CONST_ACCESS_TOKEN, accessToken);
  }
  deleteAccessToken(): void {
    localStorage.removeItem(this.CONST_ACCESS_TOKEN);
  }
  // refreshToken
  getRefreshToken(): string | null {
    return localStorage.getItem(this.CONST_REFRESH_TOKEN);
  }
  setRefreshToken(refreshToken: string): void {
    localStorage.setItem(this.CONST_REFRESH_TOKEN, refreshToken);
  }
  deleteRefreshToken(): void {
    localStorage.removeItem(this.CONST_REFRESH_TOKEN);
  }

  // sessionUsername
  getSessionUsername(): string | null {
    return localStorage.getItem(this.CONST_SESSION_USERNAME);
  }
  setSessionUsername(sessionUsername: string): void {
    localStorage.setItem(this.CONST_SESSION_USERNAME, sessionUsername);
  }
  deleteSessionUsername(): void {
    localStorage.removeItem(this.CONST_SESSION_USERNAME);
  }
}
