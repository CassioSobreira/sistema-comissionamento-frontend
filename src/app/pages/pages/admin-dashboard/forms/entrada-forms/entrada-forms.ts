// Em: src/app/components/forms/entrada-form/entrada-form.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms'; // Importe FormBuilder e FormArray
import { finalize, Observable } from 'rxjs';
import { AbstractControl} from '@angular/forms'; // Garanta que AbstractControl e FormGroup estão importados

// Imports do PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect'; 
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';

// Serviços
import { AdminService } from '../../../../../../services/admin.service'; // Ajuste o caminho
import { Entrada } from '../../../../../../services/entradas.service'; // Interface

@Component({
  selector: 'app-entrada-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    ButtonModule,
    MultiSelectModule
  ],
  templateUrl: './entrada-forms.html',
})
export class EntradaForms implements OnInit {

  entradaForm: FormGroup;
  isEditMode = false;
  currentEntradaId: number | null = null;
  isSaving = false;

  fontesDeDados = [
    { label: 'Lista de Usuários', value: '/admin/usuarios', valueField: 'id_usuario', labelField: 'nome' },
    { label: 'Lista de Colaboradores', value: '/colaboradores', valueField: 'id_colaborador', labelField: 'nome' },
    { label: 'Lista de Módulos', value: '/modulos/todos', valueField: 'id_modulo', labelField: 'nome_modulo' },
    { label: 'Criar Lista Customizada', value: 'custom' } 
  ];

  // Opções para o dropdown "Tipo de Campo"
  tiposDeCampo = [
    { label: 'Texto Curto', value: 'text' },
    { label: 'Texto Longo (Parágrafo)', value: 'textarea' },
    { label: 'Número', value: 'number' },
    { label: 'Lista de Opções (Dropdown))', value: 'select' },
    { label: 'Seleção Múltipla (MultiSelect)', value: 'multiselect' }
  ];

  constructor(
    private fb: FormBuilder, // Injeta o FormBuilder
    private adminService: AdminService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private messageService: MessageService
  ) {
    // Inicializa o formulário principal
    this.entradaForm = this.fb.group({
      nome_entrada: ['', Validators.required],
      // 'campos' é um FormArray. Ele começa vazio.
      campos: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // Modo de Edição: Preenche o formulário
    if (this.config.data && this.config.data.entrada) {
      this.isEditMode = true;
      const entrada: Entrada = this.config.data.entrada; // Assumindo que Entrada tem todos os campos
      this.currentEntradaId = entrada.id_entrada;

      this.entradaForm.patchValue({
        nome_entrada: entrada.nome_entrada,
        template_html: entrada.template_html
      });
      
      // Preenche o FormArray 'campos' com os dados do campo_json
      if (entrada.campo_json && Array.isArray(entrada.campo_json)) {
        entrada.campo_json.forEach(campo => {
          this.campos.push(this.criarGrupoDeCampo(campo));
        });
      }
    }
  }

  // Helper para acessar o FormArray 'campos' de forma fácil
  get campos(): FormArray {
    return this.entradaForm.get('campos') as FormArray;
  }

  // Cria o FormGroup para um novo campo (uma linha no form builder)
  private criarGrupoDeCampo(dados: any = {}): FormGroup {
    return this.fb.group({
      label: [dados.label || '', Validators.required], // Ex: "Nome do Cliente"
      name: [dados.name || '', Validators.required],   // Ex: "cliente_nome" (será a chave do JSON)
      type: [dados.type || 'text', Validators.required], // Ex: "text"
      required: [dados.required || false],
      optionsUrl: [dados.optionsUrl || null], // Ex: "/colaboradores"
      optionsValueField: [dados.optionsValueField || null],
      optionsLabelField: [dados.optionsLabelField || null]
    });
  }

  // Função chamada pelo botão "Adicionar Campo"
  adicionarCampo(): void {
    this.campos.push(this.criarGrupoDeCampo());
  }

  // Função chamada pelo botão "Remover" de um campo
  removerCampo(index: number): void {
    this.campos.removeAt(index);
  }

  // Salva o formulário
  onSubmit(): void {
    if (this.entradaForm.invalid) {
      this.showWarn('Preencha todos os campos obrigatórios.');
      return;
    }

    this.isSaving = true;
    const formData = this.entradaForm.getRawValue();

    // O valor de 'campos' JÁ É o campo_json que precisamos!
    const payload = {
      nome_entrada: formData.nome_entrada,
      campo_json: formData.campos
    };

    let saveObservable$: Observable<any>;

    if (this.isEditMode && this.currentEntradaId) {
      saveObservable$ = this.adminService.updateEntrada(this.currentEntradaId, payload);
    } else {
      saveObservable$ = this.adminService.createEntrada(payload);
    }

    saveObservable$.pipe(
      finalize(() => this.isSaving = false)
    ).subscribe({
      next: () => {
        const msg = this.isEditMode ? 'Template atualizado com sucesso!' : 'Template criado com sucesso!';
        this.showSuccess(msg);
        this.ref.close(true); // Fecha o modal e avisa o dashboard para recarregar
      },
      error: (err) => this.showError(err.error.error || 'Falha ao salvar o template.')
    });
  }

  /**
   * Chamado quando o admin seleciona uma "Fonte de Dados" para um campo 'select'.
   * Preenche automaticamente os campos 'optionsValueField' e 'optionsLabelField'
   * com base na seleção.
   *
   * @param event O evento (onChange) do PrimeNG. O valor selecionado está em event.value
   * @param campoControl O FormGroup da linha específica do FormArray que está sendo alterada
   */
  onFonteDeDadosChange(event: { value: any }, campoControl: AbstractControl): void {
    
    const selectedUrl = event.value; // Pega o valor selecionado (ex: '/colaboradores')
    const formGroup = campoControl as FormGroup; // Converte o AbstractControl para FormGroup

    if (selectedUrl) {
      // 1. Encontra o objeto correspondente na nossa lista de fontes de dados
      const fonteSelecionada = this.fontesDeDados.find(f => f.value === selectedUrl);

      if (fonteSelecionada) {
        // 2. Preenche os campos ocultos com os valores corretos
        formGroup.patchValue({
          optionsValueField: fonteSelecionada.valueField,
          optionsLabelField: fonteSelecionada.labelField
        });
      }
    } else {
      // 3. Se o usuário limpar a seleção, limpa os campos ocultos também
      formGroup.patchValue({
        optionsValueField: null,
        optionsLabelField: null
      });
    }
  }

  private showSuccess(detail: string) {
    this.messageService.add({ 
      severity: 'success', 
      summary: 'Sucesso', 
      detail: detail,
      life: 3000
    });
  }

  private showError(detail: string) {
    this.messageService.add({ 
      severity: 'error', 
      summary: 'Erro', 
      detail: detail 
    });
  }

  private showWarn(detail: string) {
    this.messageService.add({ 
      severity: 'warn', 
      summary: 'Atenção', 
      detail: detail 
    });
  }
}