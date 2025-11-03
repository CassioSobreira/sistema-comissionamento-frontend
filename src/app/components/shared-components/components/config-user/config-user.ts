import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

export interface Usuario {
  nome: string;
  email: string;
  cargo: string;
  sexo: string;
  modulo: string;
}

@Component({
  selector: 'app-config-user',
  templateUrl: './config-user.html',
  styleUrls: ['./config-user.css'], 
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule
  ]
})
export class ConfigUser { // Nome da classe atualizado
  
  visible: boolean = false;
  usuarioMostrado: Usuario | null = null;

  public abrirModal(usuario: Usuario) {
    this.usuarioMostrado = usuario;
    this.visible = true;
  }


  onModalHide() {
    this.usuarioMostrado = null;
  }
}
