import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notification } from '../models/notification.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificacaoService {

  private notifSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notifSubject.asObservable();

  get notifications(): Notification[] {
    return this.notifSubject.value;
  }

  adicionar(n: Notification) {
    const atual = this.notifications;
    this.notifSubject.next([n, ...atual]);
  }

  marcarComoLida(id: number) {
    const atual = this.notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    this.notifSubject.next(atual);
  }

  limpar() {
    this.notifSubject.next([]);
  }
}
