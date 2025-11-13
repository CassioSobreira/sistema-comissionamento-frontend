import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil, finalize} from 'rxjs/operators';

// Serviços da Aplicação
import { AdminService, Usuario, Entrada } from '../../../../services/admin.service';
import { ModulosService, Modulo, ModuloDetalhado } from '../../../../services/modulos.service'; // Importe o ModulosService
// Módulos e Serviços do PrimeNG
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { InputTextModule } from 'primeng/inputtext'; // Módulo para o pInputText
import { IconFieldModule } from 'primeng/iconfield'; // NOVO: Para o <p-iconfield>
import { InputIconModule } from 'primeng/inputicon'; // NOVO: Para o <p-inputicon>

// Componentes de Modal (que você precisará criar no futuro)
import { UsuarioForm } from './forms/usuario-form/usuario-form';
import { ModuloForm } from './forms/modulo-forms/modulo-forms'; // Importe ModuloFormComponent
// import { EntradaFormComponent } from './entrada-form/entrada-form.component';
import { MenuBar } from '../../../components/shared-components/components/menu/menu-bar/menu-bar';
import { error } from 'console';
import { EntradaForms } from './forms/entrada-forms/entrada-forms';
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TabsModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    MenuBar,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    // EntradaFormComponent // Importe o componente de formulário de entrada quando criado
  ],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
})
export class AdminDashboard implements OnInit, OnDestroy {

  usuarios: Usuario[] = [];
  entradas: Entrada[] = [];
  modulos: ModuloDetalhado[] = [];
  abaAtiva: number = 0;
  isLoadingUsuarios = false;
  isLoadingEntradas = false;
  isLoadingModulos = false;

  // controla a aba ativa do componente p-tabs; inicializado como '0' para abrir a primeira aba por padrão
  

  private destroy$ = new Subject<void>();
  ref: DynamicDialogRef | undefined; // Para controlar os modais

  constructor(
    private adminService: AdminService,
    private modulosService: ModulosService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.carregarUsuarios();
    this.carregarEntradas();
    this.carregarModulos();
  }

  // --- LÓGICA DE CARREGAMENTO DE DADOS ---

  //CARREFA LISTA DE USUARIOS 
  carregarUsuarios(): void {
    this.isLoadingUsuarios = true;
    this.adminService.getUsuarios().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.usuarios = data;
        this.isLoadingUsuarios = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        const errorMsg = err.error.message || 'Falha ao carregar a lista de usuários.';
        this.showError(errorMsg);
        this.isLoadingUsuarios = false;
        this.cdr.detectChanges();
      }
    });
  }

  //CARREGA LIStA DE MODULOS
  carregarModulos(): void {
    this.isLoadingModulos = true;
    this.modulosService.getModulosComEntradas().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.modulos = data;
          this.isLoadingModulos = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          const errorMsg = err.error.message || 'Falha ao carregar a lista de módulos.';
          this.showError(errorMsg);
          this.isLoadingModulos = false;
          this.cdr.detectChanges();
        }
      });
    }

    //CARREGA LISTA DE ENTRADAS
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

  //ABERTURA MODAL DE USUARIOS
  abrirModalUsuario(usuario?: Usuario): void {
    const dialogRef = this.dialogService.open(UsuarioForm, {
      header: usuario ? `Editar Usuário: ${usuario.nome}` : 'Criar Novo Usuário',
      width: '40%',
      contentStyle: {          
        "overflow": "auto"            
      },
      data: { usuario } // Passa o usuário para o modal (será undefined se for criação)
    });

    this.ref = dialogRef ?? undefined;

    // Escuta o fechamento do modal
    if (this.ref) {
      this.ref.onClose.subscribe((foiSalvo: boolean) => {
        // Se o modal retornou 'true', significa que a operação foi um sucesso
        if (foiSalvo) {
          this.carregarUsuarios(); // Recarrega a lista
        }
      });
    }
}

  //FUNCAO DELETAR USUARIO E O ABERTURA DO MODAL DE EXCLUSAO
  deletarUsuario(usuario: Usuario): void {
    this.confirmationService.confirm({
      message: `Você tem certeza que deseja deletar o usuário "${usuario.nome}"?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, deletar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text p-button-secondary',
      accept: () => {
        this.adminService.excluirUsuario(usuario.id_usuario).pipe(takeUntil(this.destroy$)).subscribe({
          next: () => {
            this.showSuccess('Usuário deletado com sucesso!');
            this.carregarUsuarios(); // Recarrega a lista
          },
          error: (err) => {
            const errorMsg = err.error.message || 'Falha ao deletar usuário.';
            this.showError(errorMsg)
          }
        });
      }
    });
  }

  // --- AÇÕES DE CRUD (ENTRADAS) ---

  abrirModalEntrada(entrada?: Entrada): void {
    // A lógica para abrir o modal de criação/edição de entrada virá aqui
    //console.log("Abrindo modal para:", entrada ? `Editar ${entrada.nome_entrada}` : "Criar Nova Entrada");
    //this.showInfo('Funcionalidade de edição a ser implementada.');
    const dialogRef = this.dialogService.open(EntradaForms, {
      header: entrada ? `Editar Entrada: ${entrada.nome_entrada}` : 'Criar Nova Entrada',
      width: '40%',
      contentStyle: {          
        "overflow": "auto"            
      },
      data: { entrada } // Passa o usuário para o modal (será undefined se for criação)
    });

    this.ref = dialogRef ?? undefined;

    // Escuta o fechamento do modal
    if (this.ref) {
      this.ref.onClose.subscribe((foiSalvo: boolean) => {
        // Se o modal retornou 'true', significa que a operação foi um sucesso
        if (foiSalvo) {
          this.carregarEntradas(); // Recarrega a lista
        }
      });
    }
  }

  deletarEntrada(entrada: Entrada): void {
    this.confirmationService.confirm({
      message: `Você tem certeza que deseja deletar o template "${entrada.nome_entrada}"?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, deletar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text p-button-secondary',
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

  // --- AÇÕES DE CRUD (MODULOS) ---

  abrirModalModulo(modulo?: ModuloDetalhado): void {
    // Note que passamos ModuloDetalhado, mas o form pode precisar só de Modulo básico
    const moduloData = modulo ? { id_modulo: modulo.id_modulo, nome_modulo: modulo.nome_modulo } : undefined;

    this.ref = this.dialogService.open(ModuloForm, {
      header: modulo ? `Editar Módulo: ${modulo.nome_modulo}` : 'Criar Novo Módulo',
      width: '40%', 
      contentStyle: { "overflow": "auto" },
      data: { modulo: moduloData } // Passa os dados básicos do módulo
    }) ?? undefined;

    this.ref?.onClose.subscribe((foiSalvo: boolean) => {
      if (foiSalvo) {
        this.carregarModulos(); // Recarrega a lista de módulos
      }
    });
  }

  deletarModulo(modulo: ModuloDetalhado): void {
    this.confirmationService.confirm({
      message: `Você tem certeza que deseja deletar o módulo "${modulo.nome_modulo}"?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, deletar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text p-button-secondary',
      accept: () => {
        this.modulosService.deleteModulo(modulo.id_modulo).pipe(takeUntil(this.destroy$)).subscribe({
          next: () => {
            this.showSuccess('Módulo deletado com sucesso!');
            this.carregarModulos(); // Recarrega a lista
          },
          error: (err) => {
            const errorMsg = err.error.message || 'Falha ao deletar módulo.';
            this.showError(errorMsg);
          }
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