import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  set(key: string, param: any): void {
    localStorage.setItem(key, JSON.stringify(param));
  }
  get(key: string): any {
    return JSON.parse(localStorage.getItem(key));
  }
  remove(key: string): void {
    localStorage.removeItem(key);
  }
  clear(): void {
    localStorage.clear();
  }
  setSession(key: string, param: any): void {
    sessionStorage.setItem(key, JSON.stringify(param));
  }
  getSession(key: string): any {
    return JSON.parse(sessionStorage.getItem(key));
  }
  removeSession(key: string): any {
    sessionStorage.removeItem(key);
  }
  cleaSession(): void {
    sessionStorage.clear();
  }
}
