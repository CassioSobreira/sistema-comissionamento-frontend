// src/app/components/forms/usuario-form/usuario-form.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { tap, Observable, forkJoin, of } from 'rxjs'; // Import forkJoin and of
import { switchMap } from 'rxjs/operators';

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
    console.log('UsuarioForm ngOnInit starting...');

    this.carregarDadosIniciais().subscribe({
      next: (initialData) => {
        console.log('UsuarioForm carregarDadosIniciais completed.');
        console.log('Checking config.data:', this.config.data);

        this.perfis = initialData.perfis;
        this.todosModulos = initialData.modulos;

        if (this.config.data && this.config.data.usuario) {
          console.log('Entering EDIT mode. User data:', this.config.data.usuario);
          this.isEditMode = true;
          const usuario: Usuario = this.config.data.usuario;
          this.currentUserId = usuario.id_usuario;
          this.currentUserStatus = usuario.status;

          // Desabilita os campos IMEDIATAMENTE após definir isEditMode
          console.log('Disabling name and email fields...'); 
          this.usuarioForm.get('nome')?.disable();
          this.usuarioForm.get('email')?.disable();
          console.log('Fields disabled.');

          console.log('Calling carregarModulosDoUsuario...');
          this.carregarModulosDoUsuario(this.currentUserId).subscribe({
            next: (modulosUsuarioIds) => {
              console.log('User modules received:', modulosUsuarioIds);

              const patchData = {
                nome: usuario.nome,
                email: usuario.email,
                id_perfil: usuario.id_perfil,
                ativo: usuario.status === 'ativo',
                id_modulos: modulosUsuarioIds
              };
              console.log('Patching form with data:', patchData);
              this.usuarioForm.patchValue(patchData);
              console.log('Form patched.');

              // 4. FORÇA A DETECÇÃO DE MUDANÇAS
              this.cdr.detectChanges();
              console.log('Change detection triggered.');

            },
            error: (err) => {
              console.error('ERROR loading user modules:', err);
              this.showError('Falha ao carregar os módulos do usuário.');
              this.cdr.detectChanges(); // Também força aqui em caso de erro
            }
          });
        } else {
          console.log('Entering CREATE mode.');
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('ERROR loading initial data:', err);
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
            return of(formattedPerfis); // Return the formatted data as an observable
        })
    );
  }

  carregarTodosModulos(): Observable<any[]> {
    return this.adminService.getTodosModulos().pipe(
          switchMap(data => {
            const formattedModulos = data.map(modulo => ({ label: modulo.nome_modulo, value: modulo.id_modulo }));
            return of(formattedModulos); // Return the formatted data as an observable
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

    const formValue = this.usuarioForm.getRawValue(); 
    const status = formValue.ativo ? 'ativo' : 'inativo';
    const id_modulos = formValue.id_modulos || []; 

    if (this.isEditMode && this.currentUserId) {
      //Logica de update
      const payload = {
          id_perfil: formValue.id_perfil,
          status: status,
          id_modulos: id_modulos
      };
      this.adminService.updateUsuario(this.currentUserId, payload).subscribe({
        next: () => this.ref.close(true),
        error: (err) => {
          const errMsg = err.error.error || 'Erro ao atualizar usuário.';
          this.showError(errMsg);
        }
      });

    } 
    else {
      //Logica de create
      const payload = {
        nome: formValue.nome, // Get value even if disabled (use getRawValue if needed)
        email: formValue.email, // Get value even if disabled (use getRawValue if needed)
        id_perfil: formValue.id_perfil,
        id_modulos: id_modulos // Pass selected module IDs
      };
      this.adminService.registrarUsuario(payload).subscribe({
        next: () => {
          this.ref.close(true);
          this.showSuccess('Usuário criado com sucesso!');
        },
        error: (err) => {
          const errMsg = err.error.error || 'Falha ao criar usuário.';
          this.showError(errMsg);
        }
      });
    }
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