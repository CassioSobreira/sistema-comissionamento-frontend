import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core'; // 1. Imports Adicionados
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api'; // 2. Imports dos Serviços
import { ColaboradorService, Colaborador } from '../../../../../../services/colaboradores.service'; // 3. Import do seu Serviço
import { Subject, takeUntil, finalize } from 'rxjs'; // 4. Imports do RxJS
import { ModulosService, Modulo } from '../../../../../../services/modulos.service';

interface Option {
  name: string;
  code: string | number;
}

@Component({
  selector: 'modal-usuario',
  templateUrl: './modal-usuario.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    MultiSelectModule
  ]
  // O MessageService é injetado, mas fornecido na página 'colaboradores'
})
export class ModalUsuario implements OnInit, OnDestroy { // 5. Adicionado OnDestroy

  // 6. Outputs para notificar o componente "Pai"
  @Output() usuarioAdicionado = new EventEmitter<void>();
  @Output() usuarioAtualizado = new EventEmitter<void>();

  private destroy$ = new Subject<void>();

  // --- Estado do Modal ---
  visible: boolean = false;
  isEditMode: boolean = false; // 7. Flag de controle
  private currentColaboradorId: number | null = null;
  isLoading: boolean = false;

  // --- Campos do Formulário ---
  nome: string = '';
  email: string = '';
  selectedCargos: Option[] = [];
  selectedModulos: Option[] = [];
  selectedSexos: Option[] = [];

  // --- Opções dos Dropdowns ---
  cargosOptions!: Option[];
  modulosOptions!: Option[];
  sexoOptions!: Option[];

  // 8. Injeção dos Serviços
  constructor(
  private colaboradorService: ColaboradorService,
  private messageService: MessageService,
  private modulosService: ModulosService   //  novo
) {}

ngOnInit() {
  this.cargosOptions = [
    { name: 'Desenvolvedor Jr', code: 'DEV_JR' },
    { name: 'Desenvolvedor Pleno', code: 'DEV_PL' },
    { name: 'Gerente de Projetos', code: 'GP' },
    { name: 'Analista de Sistemas', code: 'AS' },
    { name: 'Analista de Qualidade', code: 'AQ' },
    { name: 'Analista de Suporte', code: 'ASUP' }
  ];

  this.sexoOptions = [
    { name: 'Masculino', code: 'Masculino' },
    { name: 'Feminino', code: 'Feminino' },
    { name: 'Outro', code: 'Outro' }
  ];

  // Buscar do backend: GET /modulos/todos
  this.modulosService.getTodosModulos()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (modulos: Modulo[]) => {
        this.modulosOptions = modulos.map(m => ({
          name: m.nome_modulo,   // o que aparece no multiselect
          code: m.id_modulo      // o ID que vamos mandar pro back
        }));
      },
      error: () => {
        this.showError('Falha ao carregar módulos.');
        this.modulosOptions = [];
      }
    });
}


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // 9. --- NOVOS MÉTODOS PÚBLICOS ---

  /**
   * Chamado pelo 'colaboradores.ts' (Pai) para ADICIONAR.
   */
  public abrirModalParaAdicionar() {
    this.isEditMode = false;
    this.currentColaboradorId = null;
    this.resetForm();
    this.visible = true;
  }

  /**
   * Chamado pelo 'colaboradores.ts' (Pai) para EDITAR.
   */
  public abrirModalParaEditar(colaborador: Colaborador) {
    this.isEditMode = true;
    this.currentColaboradorId = colaborador.id_colaborador;

    // Preenche o formulário com os dados do colaborador
    this.nome = colaborador.nome;
    this.email = colaborador.email;

    // Converte as strings dos dados do colaborador de volta para os objetos de Option
    // Isso é crucial para o p-multiselect entender qual opção está selecionada
    this.selectedCargos = this.cargosOptions.filter(opt => opt.name === colaborador.cargo);
    this.selectedSexos = this.sexoOptions.filter(opt => opt.name === colaborador.sexo);
    this.selectedModulos = this.modulosOptions.filter(opt => opt.name === colaborador.modulo);

    this.visible = true;
  }

  /**
   * Limpa o formulário para um novo registo.
   */
  private resetForm() {
    this.nome = '';
    this.email = '';
    this.selectedCargos = [];
    this.selectedModulos = [];
    this.selectedSexos = [];
  }

  // 10. --- LÓGICA DE 'SAVE' ATUALIZADA ---

  /**
   * Chamado pelo botão 'Salvar' ou 'Atualizar' no modal.
   */
  save() {
    this.isLoading = true;
    const id_modulos = (this.selectedModulos || [])
    .map(opt => Number(opt.code))
    .filter(v => !Number.isNaN(v));

  console.log('selectedModulos =>', this.selectedModulos);
  console.log('id_modulos =>', id_modulos);

    // Transforma os dados do formulário (que usam Option[]) num formato compatível com 'Colaborador'
    const dadosParaApi: any = {
      nome: this.nome,
      email: this.email,
      // Pega o 'name' da primeira (e única) opção selecionada, ou nulo
      cargo: this.selectedCargos.length > 0 ? this.selectedCargos[0].name : null,
      sexo: this.selectedSexos.length > 0 ? this.selectedSexos[0].name : null,
      id_modulos,
      modulo: this.selectedModulos.length > 0 ? this.selectedModulos[0].name : null,
    };

    if (this.isEditMode && this.currentColaboradorId) {
      // --- LÓGICA DE ATUALIZAÇÃO (UPDATE) ---
      this.colaboradorService.updateColaborador(this.currentColaboradorId, dadosParaApi)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => this.isLoading = false) // Para o loading
        )
        .subscribe({
          next: () => {
            this.showSuccess('Colaborador atualizado com sucesso.');
            this.usuarioAtualizado.emit(); // Notifica o "Pai"
            this.visible = false;
          },
          error: (err) => this.showError('Falha ao atualizar colaborador.')
        });

    } else {
      // --- LÓGICA DE CRIAÇÃO (CREATE) ---
      this.colaboradorService.createColaborador(dadosParaApi)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => this.isLoading = false) // Para o loading
        )
        .subscribe({
          next: () => {
            this.showSuccess('Colaborador adicionado com sucesso.');
            this.usuarioAdicionado.emit(); // Notifica o "Pai"
            this.visible = false;
          },
          error: (err) => {
            console.error('Erro ao criar colaborador:', err);
            this.showError('Falha ao adicionar colaborador.')
          }
        });
    }
  }

  // --- Funções Auxiliares de Notificação ---
  private showSuccess(message: string): void {
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: message, life: 3000 });
  }

  private showError(message: string): void {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: message, life: 3000 });
  }
}

