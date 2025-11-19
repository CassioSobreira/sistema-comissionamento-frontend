import { Component } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { ButtonModule } from 'primeng/button';
import { PopoverModule } from 'primeng/popover';
import { NotificacaoService } from '../../../../../services/notificacao.service';
import { Notification } from '../../../../../models/notification.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notificacao-component',
  imports: [BadgeModule,
        OverlayBadgeModule,
        ButtonModule,
        PopoverModule,
        CommonModule,
      FormsModule],
  templateUrl: './notificacao-component.html',
  styleUrl: './notificacao-component.css'
})
export class NotificacaoComponent {
  notifications: Notification[] = [];

  constructor(private notifService: NotificacaoService) {}

  ngOnInit() {
    this.notifService.notifications$.subscribe(n => {
      this.notifications = n;
    });
    this.testeNotificacao();
  }

  selectNotification(n: Notification) {
    this.notifService.marcarComoLida(n.id);
  }

  testeNotificacao() {
  this.notifService.adicionar({
    id: Date.now(),
    title: 'Nova Pendência',
    message: 'Um processo foi enviado para você analisar.',
    date: new Date(),
    read: false
  });
  this.notifService.adicionar({
    id: Date.now(),
    title: 'Nova Pendência',
    message: 'Um processo foi enviado para você analisar.',
    date: new Date(),
    read: false
  });this.notifService.adicionar({
    id: Date.now(),
    title: 'Nova Pendência',
    message: 'Um processo foi enviado para você analisar.',
    date: new Date(),
    read: false
  });this.notifService.adicionar({
    id: Date.now(),
    title: 'Nova Pendência',
    message: 'Um processo foi enviado para você analisar.',
    date: new Date(),
    read: false
  });this.notifService.adicionar({
    id: Date.now(),
    title: 'Nova Pendência',
    message: 'Um processo foi enviado para você analisar.',
    date: new Date(),
    read: false
  });
}
}
