import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Subject, takeUntil, finalize } from 'rxjs';
import { MenuBar } from '../../../components/shared-components/components/menu/menu-bar/menu-bar';
import { ColaboradorService, Colaborador } from '../../../../services/colaboradores.service';

import { Table, TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModal } from './components/button-modal/button-modal';
@Component({
  selector: 'app-colaboradores',
  standalone: true,
  imports: [
    CommonModule,
    MenuBar,
    TableModule,
    FormsModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    ButtonModal
  ],
  templateUrl: './colaboradores.html',
  styleUrls: ['./colaboradores.css']
})
export class Colaboradores implements OnInit, OnDestroy {

  isLoadingColaboradores = false;
  colaboradores: Colaborador[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private colaboradorService: ColaboradorService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarColaboradores();
  }
  
  carregarColaboradores() {
    this.isLoadingColaboradores = true;
    this.colaboradorService.getColaboradores()
      .pipe(
        takeUntil(this.destroy$),
        // finalize GARANTE que o loading será desativado
        finalize(() => {
          this.isLoadingColaboradores = false;
          this.cdr.detectChanges(); 
        })
      )
      .subscribe({
        next: (data) => {
          this.colaboradores = data;
        },
        error: (err) => {
          this.showError('Falha ao carregar a lista de colaboradores.');
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private showError(message: string): void {
    console.error(message);
  }
}