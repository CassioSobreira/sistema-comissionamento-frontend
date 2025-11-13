import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs'; 
// Nossos Serviços e Interfaces
import { EntradasService, Entrada } from '../../../../services/entradas.service';
import { DocumentosService, DocumentoPayload } from '../../../../services/documentos.service';
import { AuthService } from '../../../../services/auth.service';
// Componentes PrimeNG
import { MenuBar } from '../../../components/shared-components/components/menu/menu-bar/menu-bar';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect'; 
import { AdminService, Usuario } from '../../../../services/admin.service';
import { ModulosService, Modulo } from '../../../../services/modulos.service';
import { ColaboradorService, Colaborador } from '../../../../services/colaboradores.service';

// Interface local para os campos do formulário
interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'multiselect'; 
  required?: boolean;
  optionsUrl?: string; 
  optionsValueField?: string;
  optionsLabelField?: string;
}

@Component({
  selector: 'app-documento-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MenuBar,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    ProgressSpinnerModule,
    SelectModule,
    MultiSelectModule
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
    private authService: AuthService,
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
      usuarios: this.adminService.getUsuarios() // Busca todos os usuários para o MultiSelect
    }).subscribe({
      next: ({ template, usuarios }) => {
        this.templateInfo = template;
        this.formFields = template.campo_json; // Pega os campos do JSON

        // Formata os usuários para o MultiSelect de Assinantes
        this.todosUsuarios = usuarios.map(u => ({ label: u.nome, value: u.id_usuario }));
        
        this.buildForm(); // Constrói o formulário dinâmico
        this.carregarOpcoesDinamicas();
        //this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar dados.' });
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });  
  }

  carregarTemplate(): void {
    this.entradasService.buscarEntradaPorId(this.idEntrada!).subscribe({
      next: (data) => {
        this.templateInfo = data;
        this.formFields = data.campo_json; // Pega os campos do JSON
        this.buildForm();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar o template do documento.' });
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Constrói o FormGroup dinamicamente a partir do JSON
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
      this.isLoading = false; // Se não há selects dinâmicos, termina o loading
      this.cdr.detectChanges();
      return;
    }

    // Monta um objeto de chamadas de API
    for (const field of camposSelect) {
      if (field.optionsUrl === '/admin/usuarios') {
         chamadasAPI[field.name] = this.adminService.getUsuarios();
      }
      else if (field.optionsUrl === '/colaboradores') {
         chamadasAPI[field.name] = this.colaboradorService.getColaboradores(); 
      }
      else if (field.optionsUrl === '/modulos/todos') {
        chamadasAPI[field.name] = this.adminService.getTodosModulos(); // (Use o método que já existe)
      }
    }

    // Se não houver chamadas de API (ex: apenas selects 'custom'), termina o loading
    if (Object.keys(chamadasAPI).length === 0) {
        this.isLoading = false;
        this.cdr.detectChanges();
        return;
    }

    // Executa todas as chamadas em paralelo
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
        this.cdr.detectChanges(); // Força a atualização final
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
    if (!this.idEntrada) return;
    if (!this.idModulo) return;

    this.isSaving = true;

    // Separa os 'assinantes' do resto dos campos do formulário
    const { assinantes, ...dados_preenchidos } = this.form.value;

    // ERROS 2 E 3 CORRIGIDOS no payload:
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
            queryParams: { protocolo: response.numero_protocolo } // Passa o protocolo pela URL
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
    this.location.back(); // Simplesmente volta para a página anterior  }
}
}