import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuBar } from '../../../components/shared-components/components/menu/menu-bar/menu-bar';
import { ApiService } from '../../../../services/api';
import { CommonModule } from '@angular/common'; // Importe o CommonModule
import { ChangeDetectorRef } from '@angular/core';
import { ModulosService, Modulo } from '../../../../services/modulos.service';

@Component({
  selector: 'app-home-page',
  imports: [MenuBar, CommonModule],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage implements OnInit {
  
  mensagemBoasVindas: string = '';
  erro: string = '';

  modulosDoUsuario: Modulo[] = [];
  isLoadingModulos = false;

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef, 
    private modulosService: ModulosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarModulos();
    this.apiService.getHomeData().subscribe({
      next: (response) => {
        // Em caso de sucesso, exibe a mensagem
        this.mensagemBoasVindas = response.message;
        this.cdr.detectChanges();
      },
      error: (err) => {
        // Se o token for inválido, o back-end retornará 401
        // e o interceptor provavelmente já redirecionou para o login.
        console.error('Falha ao buscar dados da home:', err);
        this.erro = 'Sua sessão pode ter expirado. Por favor, faça login novamente.';
      }
    });
    this.cdr.detectChanges();

  }

  carregarModulos(): void {
    this.isLoadingModulos = true;
    this.modulosService.getModulosDoUsuario().subscribe({
      next: (data) => {
        this.modulosDoUsuario = data;
        this.isLoadingModulos = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Falha ao carregar módulos:', err);
        this.isLoadingModulos = false;
        // Lógica para mostrar um toast de erro
        this.cdr.detectChanges();
      }
    });
  }

  navegarParaEntradas(idModulo: number): void {
    this.router.navigate(['/modulos', idModulo, 'entradas']);
  }
}