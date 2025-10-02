import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Serviços da Aplicação
import { AdminService, Usuario, Entrada } from '../../../../services/admin.service';

// Módulos e Serviços do PrimeNG
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

// Componentes de Modal (que você precisará criar no futuro)
import { UsuarioFormComponent } from './forms/usuario-form/usuario-form';
// import { EntradaFormComponent } from './entrada-form/entrada-form.component';
import { MenuBar } from '../../../components/shared-components/components/menu/menu-bar/menu-bar';
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TabsModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    MenuBar
  ],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
  providers: [DialogService, ConfirmationService, MessageService]
})
export class AdminDashboard implements OnInit, OnDestroy {

  usuarios: Usuario[] = [];
  entradas: Entrada[] = [];
  abaAtiva: number = 0;
  isLoadingUsuarios = false;
  isLoadingEntradas = false;

  // controla a aba ativa do componente p-tabs; inicializado como '0' para abrir a primeira aba por padrão
  

  private destroy$ = new Subject<void>();
  ref: DynamicDialogRef | undefined; // Para controlar os modais

  constructor(
    private adminService: AdminService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.carregarUsuarios();
    this.carregarEntradas();
  }

  // --- LÓGICA DE CARREGAMENTO DE DADOS ---

  carregarUsuarios(): void {
    this.isLoadingUsuarios = true;
    this.adminService.getUsuarios().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.usuarios = data;
        this.isLoadingUsuarios = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.showError('Falha ao carregar a lista de usuários.');
        this.isLoadingUsuarios = false;
        this.cdr.detectChanges();
      }
    });
  }

  carregarEntradas(): void {
    this.isLoadingEntradas = true;
    this.adminService.getEntradas().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.entradas = data;
        this.isLoadingEntradas = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.showError('Falha ao carregar a lista de templates.');
        this.isLoadingEntradas = false;
        this.cdr.detectChanges();
      }
    });
  }

  // --- AÇÕES DE CRUD (USUÁRIOS) ---

  abrirModalUsuario(usuario?: Usuario): void {
    const dialogRef = this.dialogService.open(UsuarioFormComponent, {
      header: usuario ? `Editar Usuário: ${usuario.nome}` : 'Criar Novo Usuário',
      width: '40%',
      contentStyle: { "overflow": "auto" },
      data: { usuario } // Passa o usuário para o modal (será undefined se for criação)
    });

    this.ref = dialogRef ?? undefined;

    // Escuta o fechamento do modal
    if (this.ref) {
      this.ref.onClose.subscribe((foiSalvo: boolean) => {
        // Se o modal retornou 'true', significa que a operação foi um sucesso
        if (foiSalvo) {
          this.carregarUsuarios(); // Recarrega a lista
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Operação realizada com sucesso!' });
        }
      });
    }
}

  deletarUsuario(usuario: Usuario): void {
    this.confirmationService.confirm({
      message: `Você tem certeza que deseja deletar o usuário "${usuario.nome}"?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, deletar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.adminService.excluirUsuario(usuario.id_usuario).pipe(takeUntil(this.destroy$)).subscribe({
          next: () => {
            this.showSuccess('Usuário deletado com sucesso!');
            this.carregarUsuarios(); // Recarrega a lista
          },
          error: (err) => this.showError('Falha ao deletar usuário.')
        });
      }
    });
  }

  // --- AÇÕES DE CRUD (ENTRADAS) ---

  abrirModalEntrada(entrada?: Entrada): void {
    // A lógica para abrir o modal de criação/edição de entrada virá aqui
    console.log("Abrindo modal para:", entrada ? `Editar ${entrada.nome_entrada}` : "Criar Nova Entrada");
    this.showInfo('Funcionalidade de edição a ser implementada.');
  }

  deletarEntrada(entrada: Entrada): void {
    this.confirmationService.confirm({
      message: `Você tem certeza que deseja deletar o template "${entrada.nome_entrada}"?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, deletar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.adminService.deleteEntrada(entrada.id_entrada).pipe(takeUntil(this.destroy$)).subscribe({
          next: () => {
            this.showSuccess('Template deletado com sucesso!');
            this.carregarEntradas(); // Recarrega a lista
          },
          error: (err) => this.showError('Falha ao deletar template.')
        });
      }
    });
  }


  // --- MÉTODOS PRIVADOS PARA FACILITAR AS NOTIFICAÇÕES (TOASTS) ---
  
  private showSuccess(detail: string) {
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: detail, life: 3000 });
  }

  private showError(detail: string) {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: detail });
  }
  
  private showInfo(detail: string) {
    this.messageService.add({ severity: 'info', summary: 'Info', detail: detail });
  }

  // --- GERENCIAMENTO DE MEMÓRIA ---
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.ref) {
        this.ref.close();
    }
  }
}