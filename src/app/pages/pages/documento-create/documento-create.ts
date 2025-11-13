import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { forkJoin } from 'rxjs'; 
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
import { MultiSelectModule } from 'primeng/multiselect'; 
import { AdminService, Usuario } from '../../../../services/admin.service';

// Interface local para os campos do formulário
interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number'; // Expanda com 'date', 'select', etc.
  required?: boolean;
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
    MultiSelectModule
  ],
  templateUrl: './documento-create.html',
})
export class DocumentoCreateComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  formFields: FormField[] = [];
  templateInfo: Entrada | null = null;
  idEntrada: number | null = null;
  isLoading = true;
  isSaving = false;
  todosUsuarios: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location, 
    private entradasService: EntradasService,
    private documentosService: DocumentosService,
    private adminService: AdminService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id_entrada');
  
    if (!idParam) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'ID da entrada não encontrado.' });
      this.router.navigate(['/home']);
      return;
    }

    this.idEntrada = +idParam;

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
        this.isLoading = false;
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
  onSubmit(): void {
    if (this.form.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha todos os campos obrigatórios.' });
      return;
    }
    if (!this.idEntrada) return;

    this.isSaving = true;

    // Separa os 'assinantes' do resto dos campos do formulário
    const { assinantes, ...dados_preenchidos } = this.form.value;

    // ERROS 2 E 3 CORRIGIDOS no payload:
    const payload: DocumentoPayload = {
      id_entrada: this.idEntrada,
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