import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private sub: Subject<any> = new Subject();
  getSub() {
    return this.sub;
  }
  publish(data: any) {
    this.sub.next(data);
  }
}
