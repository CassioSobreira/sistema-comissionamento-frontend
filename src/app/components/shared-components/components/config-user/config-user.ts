// Em: config-user.ts

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner'; 

// 1. IMPORTE O AuthService (em vez do AdminService)
import { AuthService } from '../../../../../services/auth.service';

// 2. Interface para os dados
interface DadosUsuario {
  id: number;
  nome: string;
  email: string;
  perfil: string;
  modulos: string[];
}

@Component({
  selector: 'app-config-user',
  templateUrl: './config-user.html',
  styleUrls: ['./config-user.css'], 
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    ProgressSpinnerModule
  ]
})
export class ConfigUser { // Sem OnInit, pois carregamos ao abrir

  visible: boolean = false;
  usuario: DadosUsuario | null = null;
  erro: string | null = null;
  isLoading = false; // Começa como false

  constructor(
    // 3. INJETE O AuthService
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  /**
   * 4. MÉTODO PÚBLICO
   * Chamado pela MenuBar para abrir o modal.
   */
  public abrirModal() {
    this.visible = true;
    this.carregarDadosUsuario(); // Busca os dados ao abrir
  }

  /**
   * 5. LÓGICA DE BUSCA DE DADOS
   * (Movida do ngOnInit para cá)
   */
  carregarDadosUsuario(): void {
    this.isLoading = true;
    this.usuario = null; // Limpa dados antigos
    this.erro = null;
    
    this.authService.getMeusDados().subscribe({
      next: (response) => {
        this.usuario = response.usuario;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.erro = err.error.error || 'Falha ao carregar dados do usuário.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }  
    });
  }

  onModalHide() {
    this.visible = false;
    this.usuario = null;
    this.erro = null;
  }
}