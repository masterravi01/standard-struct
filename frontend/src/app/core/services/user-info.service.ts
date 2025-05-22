import { inject, Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { UserType, EmployeeType } from '../constants/EmployeeConstant';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserInfoService {
  private readonly storageKey = environment.storageKey;
  private readonly encryptionKey = environment.crypto_encryption_Key; // Use a secure key management approach

  private refreshUserSubject = new BehaviorSubject<boolean>(false);
  public refreshUser$: Observable<boolean> =
    this.refreshUserSubject.asObservable();

  private encryptData(data: any): string {
    return CryptoJS.AES.encrypt(
      JSON.stringify(data),
      this.encryptionKey
    ).toString();
  }

  private decryptData(encryptedData: string): any {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

  setUserInfo(data: any, isUpdatRole?: boolean): void {
    try {
      if (!data?.user?.employeeType) throw new Error('Invalid user data');
      if (!isUpdatRole) {
        data.user.isAdmin = [EmployeeType.CEO, EmployeeType.HR].includes(
          data.user.employeeType
        );
      }
      const encryptedData = this.encryptData(data);
      localStorage.setItem(this.storageKey, encryptedData);
      if (isUpdatRole) {
        // Prefer service-based updates over reload
        this.refreshUserSubject.next(true);
      }
    } catch (error) {
      console.error('Error saving user info:', error);
    }
  }

  getUserInfo(): any {
    try {
      const encryptedData = localStorage.getItem(this.storageKey);
      if (!encryptedData) return null;
      return this.decryptData(encryptedData);
    } catch (error) {
      console.error('Error loading user info:', error);
      return null;
    }
  }

  isUserAdmin(): any {
    try {
      // Decrypt and parse data
      const userInfo = this.getUserInfo();

      if (userInfo?.user.employeeType === EmployeeType.EMPLOYEE) {
        return false;
      } else {
        if (!userInfo?.user.isAdmin) {
          userInfo.user.isAdmin = true;
          this.updateUserInfo(userInfo);
          return true;
        }
        return true;
      }
    } catch (e) {
      console.error('Error decrypting user info:', e);
      alert('Failed to load user information. Please log in again.');
      return null;
    }
  }

  // Add functionality to switch roles (for admins)
  switchRole(): void {
    const userInfo = this.getUserInfo();
    if (userInfo && userInfo.user.isAdmin) {
      userInfo.user.isAdmin = false;
    } else if (userInfo) {
      userInfo.user.isAdmin = true;
    }
    this.updateUserInfo(userInfo, true);
  }

  clearUserInfo(): void {
    localStorage.removeItem(this.storageKey);
  }

  updateUserInfo(userInfo: any, isReload?: Boolean): void {
    const encryptedData = this.encryptData(userInfo);
    localStorage.setItem(this.storageKey, encryptedData);
    if (isReload) {
      window.location.reload();
    } else {
      this.refreshUserSubject.next(!this.refreshUserSubject.getValue());
    }
  }

  getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocation not supported.');
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.log(error.code, error.PERMISSION_DENIED);

          reject('Unable to fetch location.');
        }
      );
    });
  }
}
