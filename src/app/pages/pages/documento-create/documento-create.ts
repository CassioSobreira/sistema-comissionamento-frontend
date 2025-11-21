import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { finalize, forkJoin, Observable } from 'rxjs'; 

// Nossos Serviços e Interfaces
import { EntradasService, Entrada } from '../../../../services/entradas.service';
import { DocumentosService, DocumentoPayload } from '../../../../services/documentos.service';

// Componentes PrimeNG
import { MenuBar } from '../../../components/shared-components/components/menu/menu-bar/menu-bar';
import { InputTextModule } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect'; 
import { AdminService } from '../../../../services/admin.service';
import { ModulosService } from '../../../../services/modulos.service';
import { ColaboradorService } from '../../../../services/colaboradores.service';
import { DatePickerModule } from 'primeng/datepicker'; 

// Interface local para os campos do formulário
interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'multiselect' | 'date'; 
  required?: boolean;
  optionsUrl?: string; 
  optionsValueField?: string;
  optionsLabelField?: string;
  customOptions?: string; 
}

@Component({
  selector: 'app-documento-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MenuBar,
    InputTextModule,
    Textarea,
    ButtonModule,
    ProgressSpinnerModule,
    SelectModule,
    MultiSelectModule,
    DatePickerModule
  ],
  templateUrl: './documento-create.html',
})
export class DocumentoCreateComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  formFields: FormField[] = [];
  templateInfo: Entrada | null = null;
  idEntrada: number | null = null;
  idModulo: number | null = null;
  isLoading = true;
  isSaving = false;
  todosUsuarios: any[] = [];
  opcoesDropdownDinamicas: Map<string, any[]> = new Map();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location, 
    private entradasService: EntradasService,
    private documentosService: DocumentosService,
    private adminService: AdminService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private modulosService: ModulosService,
    private colaboradorService: ColaboradorService
  ) {}

  ngOnInit(): void {
    const idEntradaParam = this.route.snapshot.paramMap.get('id_entrada');
    const idModuloParam = this.route.snapshot.paramMap.get('id_modulo');  

    if (!idEntradaParam) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'ID da entrada não encontrado.' });
      this.router.navigate(['/home']);
      return;
    }

    if (!idModuloParam) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'ID do módulo não encontrado.' });
      this.router.navigate(['/home']);
      return;
    }

    this.idEntrada = +idEntradaParam;
    this.idModulo = +idModuloParam;

    forkJoin({
      template: this.entradasService.buscarEntradaPorId(this.idEntrada),
      usuarios: this.adminService.getUsuariosParaSelecao() 
    }).subscribe({
      next: ({ template, usuarios }) => {
        this.templateInfo = template;
        this.formFields = template.campo_json; 

        // Formata os usuários para o MultiSelect de Assinantes
        this.todosUsuarios = usuarios.map(u => ({ label: u.nome, value: u.id_usuario }));
        
        this.buildForm(); 
        this.carregarOpcoesDinamicas();
        
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar dados.' });
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });  
  }

  buildForm(): void {
    const controls: { [key: string]: FormControl } = {};
    for (const field of this.formFields) {
      const validators = field.required ? [Validators.required] : [];
      controls[field.name] = new FormControl('', validators);
    }

    controls['assinantes'] = new FormControl([], [Validators.required, Validators.minLength(1)]);
    this.form = new FormGroup(controls);
  }

  carregarOpcoesDinamicas(): void {
    const chamadasAPI: { [key: string]: Observable<any[]> } = {};
    
    const camposSelect = this.formFields.filter(f => (f.type === 'select' || f.type === 'multiselect') && f.optionsUrl);

    if (camposSelect.length === 0) {
      this.isLoading = false; 
      this.cdr.detectChanges();
      return;
    }

    for (const field of camposSelect) {
      
      // --- 1. OPÇÕES CUSTOMIZADAS ---
      if (field.optionsUrl === 'custom') {
        if (field.customOptions) { 
          // Divide por linha e remove vazios
          const linhas = field.customOptions.split('\n').filter((l: string) => l.trim() !== '');
          
          const opcoes = linhas.map((linha: string) => {
            // Tenta dividir por vírgula (formato Label,Valor)
            const partes = linha.split(',');
            const label = partes[0].trim();
            // Se não tiver vírgula, valor = label
            const value = partes.length > 1 ? partes[1].trim() : label;
            
            return { label, value };
          });
          
          this.opcoesDropdownDinamicas.set(field.name, opcoes);
        }
      } 
      else {
        // Monta o objeto de chamadas para o forkJoin
        if (field.optionsUrl === '/admin/usuarios') {
           chamadasAPI[field.name] = this.adminService.getUsuariosParaSelecao();
        }
        else if (field.optionsUrl === '/colaboradores') {
           chamadasAPI[field.name] = this.colaboradorService.getColaboradores(); 
        }
        else if (field.optionsUrl === '/modulos/todos') {
          chamadasAPI[field.name] = this.modulosService.getTodosModulos();
        }
      }
    }

    if (Object.keys(chamadasAPI).length === 0) {
        this.isLoading = false;
        this.cdr.detectChanges();
        return;
    }

    // Se houver chamadas de API, executa em paralelo
    forkJoin(chamadasAPI).subscribe({
      next: (resultados) => {
        for (const key in resultados) {
          const campoCorrespondente = this.formFields.find(f => f.name === key);
          const dados = resultados[key]; 

          if (campoCorrespondente && campoCorrespondente.optionsValueField && campoCorrespondente.optionsLabelField) {
            const opcoesFormatadas = dados.map(item => ({
              label: item[campoCorrespondente.optionsLabelField!],
              value: item[campoCorrespondente.optionsValueField!]
            }));
            this.opcoesDropdownDinamicas.set(key, opcoesFormatadas);
          }
        }
        
        this.isLoading = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar opções do formulário.' });
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
  
  onSubmit(): void {
    if (this.form.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha todos os campos obrigatórios.' });
      return;
    }
    if (!this.idEntrada || !this.idModulo) return;

    this.isSaving = true;

    const { assinantes, ...dados_preenchidos } = this.form.value;

    const payload: DocumentoPayload = {
      id_entrada: this.idEntrada,
      id_modulo: this.idModulo,
      dados_preenchidos: dados_preenchidos, 
      assinantes: assinantes
    };

    this.documentosService.criarDocumento(payload).pipe(
      finalize(() => {
        this.isSaving = false;
        this.cdr.detectChanges(); 
      })
    ).subscribe({
      next: (response) => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: `Documento (Protocolo ${response.numero_protocolo}) criado com sucesso!` });
        this.router.navigate(
          ['/documentos', response.id_documento, 'criado'], 
          { 
            queryParams: { protocolo: response.numero_protocolo } 
          }
        );      
      },
      error: (err) => {
        const errorMsg = err.error.error || 'Falha ao salvar o documento.';
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: errorMsg });
      }
    });
  }

  voltar(): void {
    this.location.back(); 
  }
}