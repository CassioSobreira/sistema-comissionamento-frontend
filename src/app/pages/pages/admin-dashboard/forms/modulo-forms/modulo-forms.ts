import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, forkJoin, of } from 'rxjs';
import { tap, map, switchMap, finalize } from 'rxjs/operators';

// Imports do PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect'; // Para selecionar entradas
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';

// Serviços e Modelos
import { ModulosService, Modulo, Entrada } from '../../../../../../services/modulos.service'; 

@Component({
  selector: 'app-modulo-forms',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    MultiSelectModule, 
    ButtonModule  ],
  templateUrl: './modulo-forms.html',
  styleUrl: './modulo-forms.css'
})
export class ModuloForm implements OnInit {

  moduloForm: FormGroup;
  isEditMode = false;
  currentModuloId: number | null = null;
  todasEntradas: any[] = []; 
  isLoadingEntradas = false; 

  isSaving = false; 

  constructor(
    private modulosService: ModulosService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef 
  ) {
    // Inicializa o formulário
    this.moduloForm = new FormGroup({
      nome_modulo: new FormControl('', [Validators.required]),
      id_entradas: new FormControl<number[]>([]) 
    });
  }

  ngOnInit(): void {
    this.carregarDadosIniciais().subscribe({
      next: (initialData) => {
        this.todasEntradas = initialData.entradas; // Atribui dados do forkJoin
        this.cdr.detectChanges();
        if (this.config.data && this.config.data.modulo) {
          this.isEditMode = true;
          const moduloParaEditar = this.config.data.modulo; 
          this.currentModuloId = moduloParaEditar.id_modulo;

          // Busca os IDs das entradas associadas
          this.carregarEntradasDoModulo(this.currentModuloId!).subscribe({
            next: (entradasAssociadasIds) => {
              // Preenche o formulário completo
              this.moduloForm.patchValue({
                nome_modulo: moduloParaEditar.nome_modulo,
                id_entradas: entradasAssociadasIds
              });
              this.cdr.detectChanges(); // Força a atualização
            },
            error: (err) => {
              this.showError('Falha ao carregar entradas associadas.');
              this.cdr.detectChanges();
            }
          });
        }
      },
      error: (err) => {
        this.showError('Falha ao carregar dados iniciais do formulário.');
        this.cdr.detectChanges();
      }
    });
  }

  carregarDadosIniciais(): Observable<{ entradas: any[] }> {
    return forkJoin({
      entradas: this.carregarTodasEntradas()
    });
  }

  // 7. carregarTodasEntradas usando switchMap/of para retornar dados formatados
  carregarTodasEntradas(): Observable<any[]> {
    this.isLoadingEntradas = true;
    return this.modulosService.getTodasEntradas().pipe(
      switchMap(data => {
        const formattedEntradas = data.map(entrada => ({ label: entrada.nome_entrada, value: entrada.id_entrada }));
        return of(formattedEntradas);
      }),
      finalize(() => {
        this.isLoadingEntradas = false;
      })
    );
  }

  carregarEntradasDoModulo(idModulo: number): Observable<number[]> {
     console.log(`Buscando IDs de entradas associadas ao módulo ${idModulo}...`);
     return this.modulosService.getModuloEntradasIds(idModulo).pipe(
       map(entradasObjArray => entradasObjArray.map(e => e.id_entrada)),
       tap(ids => console.log('IDs das entradas associadas recebidos:', ids))
     );
  }

  onSubmit(): void {
    if (this.moduloForm.invalid) {
      this.showWarn('Por favor, preencha o nome do módulo.');
      return;
    }

    this.isSaving = true; // Ativa o loading
    const formData = this.moduloForm.value;
    const payload = {
        nome_modulo: formData.nome_modulo,
        id_entradas: formData.id_entradas || [] 
    };

    let saveObservable$: Observable<any>;

    if (this.isEditMode && this.currentModuloId) {
      // Lógica de ATUALIZAR Módulo
      saveObservable$ = this.modulosService.updateModuloComEntradas(this.currentModuloId, payload);
    } else {
      // Lógica de CRIAR Módulo
      saveObservable$ = this.modulosService.createModuloComEntradas(payload);
    }

    saveObservable$
      .pipe(
        finalize(() => {
          this.isSaving = false; // Desativa o loading, independente de sucesso ou erro
        })
      )
      .subscribe({
        next: () => {
          const successMsg = this.isEditMode ? 'Módulo atualizado com sucesso!' : 'Módulo criado com sucesso!';
          this.showSuccess(successMsg);
          this.ref.close(true); // Fecha modal indicando sucesso
        },
        error: (err) => {
            const errorMsg = err.error.error || (this.isEditMode ? 'Falha ao atualizar módulo.' : 'Falha ao criar módulo.');
            this.showError(errorMsg);
        }
    });
  }

  closeDialog(): void {
    this.ref.close(); // Fecha o modal sem indicar sucesso
  }

  // Métodos privados para toasts
  private showSuccess(detail: string) {
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: detail, life: 3000 });
  }
  private showError(detail: string) {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: detail });
  }
  private showWarn(detail: string) {
    this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: detail });
  }
}