// src/app/components/forms/usuario-form/usuario-form.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { tap, Observable, forkJoin, of } from 'rxjs'; // Import forkJoin and of
import { switchMap, finalize } from 'rxjs/operators';

// Imports do PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToggleButtonModule } from 'primeng/togglebutton';

import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect'; 
import { ChangeDetectorRef } from '@angular/core';
// Nossos serviços e modelos
import { AdminService, Usuario, Perfil, Modulo } from '../../../../../../services/admin.service'; // Ajuste o caminho se necessário

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    ButtonModule,
    ToggleSwitchModule,
    MultiSelectModule,
    ToggleButtonModule
  ],
  templateUrl: './usuario-form.html',
})

export class UsuarioForm implements OnInit {

  usuarioForm: FormGroup;
  isEditMode = false;
  currentUserId: number | null = null;
  perfis: any[] = []; // Para o dropdown
  currentUserStatus: string | null = null;
  todosModulos: any[] = []; // Array for MultiSelect options
  isSaving = false;

  constructor(
    private adminService: AdminService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {
    // Inicializa o formulário no construtor
    this.usuarioForm = new FormGroup({
      nome: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      id_perfil: new FormControl(null, [Validators.required]),
      ativo: new FormControl(true), // Controle para o status (ativo/inativo)
      id_modulos: new FormControl<number[]>([])
    });
  }

ngOnInit(): void {

    this.carregarDadosIniciais().subscribe({
      next: (initialData) => {

        this.perfis = initialData.perfis;
        this.todosModulos = initialData.modulos;

        if (this.config.data && this.config.data.usuario) {
          this.isEditMode = true;
          const usuario: Usuario = this.config.data.usuario;
          this.currentUserId = usuario.id_usuario;
          this.currentUserStatus = usuario.status;

          // Desabilita os campos IMEDIATAMENTE após definir isEditMode
          this.usuarioForm.get('nome')?.disable();
          this.usuarioForm.get('email')?.disable();

          this.carregarModulosDoUsuario(this.currentUserId).subscribe({
            next: (modulosUsuarioIds) => {

              const patchData = {
                nome: usuario.nome,
                email: usuario.email,
                id_perfil: usuario.id_perfil,
                ativo: usuario.status === 'ativo',
                id_modulos: modulosUsuarioIds
              };
              this.usuarioForm.patchValue(patchData);
              this.cdr.detectChanges();

            },
            error: (err) => {
              this.showError('Falha ao carregar os módulos do usuário.');
              this.cdr.detectChanges(); // Também força aqui em caso de erro
            }
          });
        } else {
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.showError('Falha ao carregar dados iniciais do formulário.');
        this.cdr.detectChanges(); 
      }
    });
  }
  
  carregarDadosIniciais(): Observable<{perfis: any[], modulos: any[]}> {
    return forkJoin({
      perfis: this.carregarPerfis(),
      modulos: this.carregarTodosModulos()
    });
  }

  carregarPerfis(): Observable<any[]> {
    return this.adminService.getPerfis().pipe(
        switchMap(data => {
            const formattedPerfis = data.map(perfil => ({ label: perfil.nome_perfil, value: perfil.id_perfil }));
            return of(formattedPerfis); 
        })
    );
  }

  carregarTodosModulos(): Observable<any[]> {
    return this.adminService.getTodosModulos().pipe(
          switchMap(data => {
            const formattedModulos = data.map(modulo => ({ label: modulo.nome_modulo, value: modulo.id_modulo }));
            return of(formattedModulos);
        })
    );
  }

  carregarModulosDoUsuario(idUsuario: number): Observable<number[]> {
    return this.adminService.getUsuarioModulos(idUsuario).pipe(
      switchMap(modulosObjArray => of(modulosObjArray.map(m => m.id_modulo)))
    );
  }


  onSubmit(): void {
    if (this.usuarioForm.invalid) {
      this.showWarn('Preencha todos os campos obrigatórios.');
      return;
    }

    this.isSaving = true;
    const formValue = this.usuarioForm.getRawValue(); 
    const status = formValue.ativo ? 'ativo' : 'inativo';
    const id_modulos = formValue.id_modulos || []; 

    let saveObservable$: Observable<any>; // Variável para guardar o observable

    if (this.isEditMode && this.currentUserId) {
      //Logica de update
      const payload = {
          id_perfil: formValue.id_perfil,
          status: status,
          id_modulos: id_modulos
      };
      saveObservable$ = this.adminService.updateUsuario(this.currentUserId, payload);
    } 
    else {
      //Logica de create
      const payload = {
        nome: formValue.nome, 
        email: formValue.email, 
        id_perfil: formValue.id_perfil,
        id_modulos: id_modulos 
      };
      saveObservable$ = this.adminService.registrarUsuario(payload);
    }
    
    saveObservable$
      .pipe(
        finalize(() => {
          this.isSaving = false; 
        })
      )
      .subscribe({
        next: () => {
          const successMessage = this.isEditMode ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!';
          this.showSuccess(successMessage);
          this.ref.close(true); // Fecha o modal indicando sucesso
        },
        error: (err) => {
          // A mensagem de erro também pode depender do modo
          const baseMsg = this.isEditMode ? 'Erro ao atualizar usuário.' : 'Falha ao criar usuário.';
          const errMsg = err.error.error || baseMsg;
          this.showError(errMsg);
          // O 'finalize' já cuidou de desativar o 'isSaving'
        }
      });
  }

  closeDialog(): void {
    this.ref.close(); 
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