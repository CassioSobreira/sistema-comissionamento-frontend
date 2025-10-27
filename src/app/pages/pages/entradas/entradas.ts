import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { EntradasService, Entrada } from '../../../../services/entradas.service';

import { MenuBar } from '../../../components/shared-components/components/menu/menu-bar/menu-bar';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner'; // 1. IMPORTE AQUI
@Component({
  selector: 'app-entradas',
  imports: [
    CommonModule,
    MenuBar,
    ButtonModule,
    ProgressSpinnerModule
  ],
  templateUrl: './entradas.html',
  styleUrl: './entradas.css'
})
export class Entradas implements OnInit {

  entradas: Entrada[] = [];
  idModulo: number | null = null;
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private entradasService: EntradasService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Lê o ID do módulo da URL. O '+' converte a string para número.
    const idParam = this.route.snapshot.paramMap.get('id_modulo');
    if (idParam) {
      this.idModulo = +idParam;
      this.carregarEntradas();
    } else {
      console.error('ID do módulo não encontrado na URL.');
      // Opcional: redirecionar para a home se não houver ID
      this.router.navigate(['/home']);
    }
  }

  carregarEntradas(): void {
    if (!this.idModulo) return;

    this.isLoading = true;
    this.entradasService.getEntradasPorModulo(this.idModulo)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges(); // Garante a atualização da tela
        })
      )
      .subscribe({
        next: (data) => {
          this.entradas = data;
        },
        error: (err) => {
          console.error('Erro ao carregar entradas:', err);
          // Adicionar lógica de toast de erro aqui, se desejar
        }
      });
  }

  // Função para voltar à tela de seleção de módulos
  voltarParaModulos(): void {
    this.router.navigate(['/home']);
  }

  // Função para navegar para a criação do documento (próximo passo)
  selecionarEntrada(idEntrada: number): void {
    // Exemplo de como você navegaria para a página de criação de documento
    console.log(`Navegando para o documento da entrada com ID: ${idEntrada}`);
    // this.router.navigate(['/documento', idEntrada, 'criar']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
