import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MenuBar } from '../../../components/shared-components/components/menu/menu-bar/menu-bar';
// PrimeNG
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

// Seus componentes e serviços
import { CalendarComponent } from '../../../components/shared-components/components/calendar-component/calendar-component';
import { AdminService, Usuario, Entrada } from '../../../../services/admin.service';

@Component({
  selector: 'app-agendamento-reuniao',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CalendarComponent,

    // PrimeNG
    MultiSelectModule,
    DialogModule,
    ButtonModule,
    ProgressSpinnerModule,
    MenuBar,
    DatePipe
  ],
  templateUrl: './agendamento-reuniao.html',
  styleUrls: ['./agendamento-reuniao.css']
})
export class AgendamentoReuniao implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  dataSelecionada: Date | null = null;
  usuariosSelecionados: any[] = [];
  usuarios: any[] = [];

  isLoadingUsuarios = false;
  displayResumo = false;

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.isLoadingUsuarios = true;

    this.adminService.getUsuarios()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.usuarios = data;
          this.isLoadingUsuarios = false;
          this.cdr.detectChanges();
          console.log(data);
        },
        error: (err) => {
          const errorMsg = err.error?.message || 'Falha ao carregar usuários.';
          console.error(errorMsg);
          this.isLoadingUsuarios = false;
          this.cdr.detectChanges();
        }
        
      });
  }

  abrirResumo() {
    this.displayResumo = true;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
