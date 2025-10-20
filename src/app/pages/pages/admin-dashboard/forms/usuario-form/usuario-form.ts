// src/app/components/forms/usuario-form/usuario-form.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { tap, Observable } from 'rxjs';

// Imports do PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';

// Nossos serviços e modelos
import { AdminService, Usuario, Perfil } from '../../../../../../services/admin.service'; // Ajuste o caminho se necessário

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    ButtonModule,
    ToggleSwitchModule 
  ],
  templateUrl: './usuario-form.html',
})

export class UsuarioForm implements OnInit {

  usuarioForm: FormGroup;
  isEditMode = false;
  currentUserId: number | null = null;
  perfis: any[] = []; // Para o dropdown
  currentUserStatus: string | null = null;

  constructor(
    private adminService: AdminService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private messageService: MessageService
  ) {
    // Inicializa o formulário no construtor
    this.usuarioForm = new FormGroup({
      nome: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      id_perfil: new FormControl(null, [Validators.required]),
      ativo: new FormControl(true) // Controle para o status (ativo/inativo)
    });
  }

  ngOnInit(): void {
    this.carregarPerfis().subscribe(() => {
      if (this.config.data && this.config.data.usuario) {
        this.isEditMode = true;
        const usuario: Usuario = this.config.data.usuario;
        this.currentUserId = usuario.id_usuario;
        
        this.currentUserStatus = usuario.status;
        
        // Desabilita os campos no modo de edição
        this.usuarioForm.get('nome')?.disable();
        this.usuarioForm.get('email')?.disable();
        
        this.usuarioForm.patchValue({
          nome: usuario.nome,
          email: usuario.email,
          id_perfil: usuario.id_perfil,
          ativo: usuario.status === 'ativo'
        });
      }
    });
  }
  
  carregarPerfis(): Observable<Perfil[]> {
    return this.adminService.getPerfis().pipe(
      tap(data => {
        this.perfis = data.map(perfil => ({ label: perfil.nome_perfil, value: perfil.id_perfil }));
      })
    );
  }

  onSubmit(): void {
    if (this.usuarioForm.invalid) {
      this.showWarn('Preencha todos os campos obrigatórios.');
      return;
    }

    if (this.isEditMode && this.currentUserId) {
      const { id_perfil, ativo } = this.usuarioForm.value;
      const status = ativo ? 'ativo' : 'inativo';

      this.adminService.updateUsuario(this.currentUserId, { id_perfil, status }).subscribe({
        next: () => this.ref.close(true),
        error: (err) => {
          const errMsg = err.error.error || 'Falha ao atualizar usuário.';
          this.showError(errMsg);
        }
      });

    } else {
      this.adminService.registrarUsuario(this.usuarioForm.value).subscribe({
        next: () => {
          this.ref.close(true)
          this.showSuccess('Usuário criado com sucesso!');},
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