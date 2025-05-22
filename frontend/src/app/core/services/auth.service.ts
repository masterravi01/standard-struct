import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { APIConstant } from '../constants/APIConstant';
import { Router } from '@angular/router';
import { UserInfoService } from './user-info.service';
import { BehaviorSubject, from, Observable, throwError } from 'rxjs';
import { catchError, tap, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public tokenRefreshInProgressSubject = new BehaviorSubject<boolean>(false);

  constructor(
    private crudService: CrudService,
    private router: Router,
    private userInfoService: UserInfoService
  ) {}

  get tokenRefreshInProgress(): Observable<boolean> {
    return this.tokenRefreshInProgressSubject.asObservable();
  }

  async logout(redirectTo: boolean = true): Promise<void> {
    try {
      const response = await this.crudService.post(APIConstant.LOGOUT);
      console.log(response);
      this.userInfoService.clearUserInfo();
      if (redirectTo) {
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  isAuthenticated(): boolean {
    return this.userInfoService.getUserInfo() !== null;
  }

  refreshToken(): Observable<any> {
    this.tokenRefreshInProgressSubject.next(true);
    return from(this.crudService.post(APIConstant.REFRESH_TOKEN)).pipe(
      tap((response: any) => {
        console.log(response);
        this.userInfoService.setUserInfo(response.data);
      }),
      catchError((error) => {
        console.error('Error refreshing token:', error);
        return throwError(() => error);
      }),
      finalize(() => {
        this.tokenRefreshInProgressSubject.next(false);
      })
    );
  }

  async login(credentials: any): Promise<void> {
    try {
      const response = await this.crudService.post(
        APIConstant.LOGIN,
        credentials
      );
      let userData = response.data;
      this.userInfoService.setUserInfo(userData);
      this.router.navigate([`/dashboard`]);
    } catch (error: any) {
      console.error('Error during login:', error);
    }
  }

  getUserInfo(): any {
    return this.userInfoService.getUserInfo();
  }

  async getUserProfile(): Promise<any> {
    try {
      const response = await this.crudService.post(APIConstant.GET_USER);
      console.log(response);
      return response;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  clearLocalStorageAndRedirect(): void {
    this.userInfoService.clearUserInfo();
    this.router.navigate(['/login']);
  }
}
