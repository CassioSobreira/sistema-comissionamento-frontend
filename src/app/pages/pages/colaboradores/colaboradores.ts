import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core'; // 1. Adicionado ViewChild
import { CommonModule } from '@angular/common'; 
import { Subject, takeUntil, finalize } from 'rxjs';
import { MenuBar } from '../../../components/shared-components/components/menu/menu-bar/menu-bar';
import { ColaboradorService, Colaborador } from '../../../../services/colaboradores.service';

// --- Importações do PrimeNG ---
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Table, TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api'; // 2. Imports dos Serviços

// --- Componentes Filhos ---
import { ButtonModal } from './components/button-modal/button-modal';
import { ModalUsuario } from "./components/modal-usuario/modal-usuario";

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
    ButtonModal,
    ModalUsuario,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule
  ],
  templateUrl: './colaboradores.html',
  styleUrls: ['./colaboradores.css'],
  providers: [ConfirmationService, MessageService] // 3. Adicionados Providers
})
export class Colaboradores implements OnInit, OnDestroy {

  // 4. Adicionado @ViewChild para referenciar #modalUsuario no HTML
  @ViewChild('modalUsuario') modalUsuario!: ModalUsuario;

  isLoadingColaboradores = false;
  colaboradores: Colaborador[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private colaboradorService: ColaboradorService,
    private cdr: ChangeDetectorRef,
    // 5. Serviços Injetados
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.carregarColaboradores();
  }
  
  carregarColaboradores() {
    this.isLoadingColaboradores = true;
    this.colaboradorService.getColaboradores()
      .pipe(
        takeUntil(this.destroy$),
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
          // Atualizado para usar o MessageService
          this.showError('Falha ao carregar a lista de colaboradores.');
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // 6. ---- FUNÇÕES ADICIONADAS ----

  /**
   * Chamada pelo botão 'Editar' na tabela.
   * Usa a referência @ViewChild para chamar um método público no componente 'modal-usuario'.
   */
  abrirModalEditar(colaborador: Colaborador) {
    this.modalUsuario.abrirModalParaEditar(colaborador);
  }

  /**
   * Chamada pelo botão 'Deletar' na tabela.
   * Usa o ConfirmationService do PrimeNG para pedir confirmação.
   */
  confirmarDelete(colaborador: Colaborador) {
    this.confirmationService.confirm({
        message: `Tem certeza que deseja apagar o colaborador <strong>${colaborador.nome}</strong>?`,
        header: 'Confirmar Exclusão',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim, apagar',
        rejectLabel: 'Cancelar',
        accept: () => {
            // Lógica de exclusão real
            this.isLoadingColaboradores = true;
            // Assumindo que seu serviço tem o método 'deleteColaborador'
            this.colaboradorService.deleteColaborador(colaborador.id_colaborador)
              .pipe(
                takeUntil(this.destroy$),
                finalize(() => {
                  this.isLoadingColaboradores = false;
                  this.cdr.detectChanges();
                })
              )
              .subscribe({
                next: () => {
                  this.showSuccess('Colaborador apagado com sucesso.');
                  this.carregarColaboradores(); // Recarrega a lista
                },
                error: (err) => {
                  this.showError('Falha ao apagar o colaborador.');
                }
              });
        },
        reject: () => {
            // Opcional: notificar que a ação foi cancelada
            this.messageService.add({ severity: 'info', summary: 'Cancelado', detail: 'Ação cancelada.', life: 3000 });
        }
    });
  }

  /**
   * Helper para mostrar notificações de sucesso.
   */
  private showSuccess(message: string): void {
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: message, life: 3000 });
  }

  /**
   * Helper para mostrar notificações de erro.
   * (Atualiza sua função existente)
   */
  private showError(message: string): void {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: message, life: 3000 });
    console.error(message); // Mantém o log no console
  }
}

