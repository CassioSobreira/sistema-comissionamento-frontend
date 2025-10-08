import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { TableFilterBasicDemo } from './components/table/table';
import { Subject, takeUntil } from 'rxjs';
import { MenuBar } from '../../../components/shared-components/components/menu/menu-bar/menu-bar';
import { ColaboradorService, Colaborador } from '../../../../services/colaboradores.service';


@Component({
  selector: 'app-colaboradores',
  standalone: true,
  imports: [
    CommonModule,
    TableFilterBasicDemo,
    MenuBar
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
    this.colaboradorService.getColaboradores().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.colaboradores = data;
        this.isLoadingColaboradores = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.showError('Falha ao carregar a lista de colaboradores.');
        this.isLoadingColaboradores = false;
        this.cdr.detectChanges();
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