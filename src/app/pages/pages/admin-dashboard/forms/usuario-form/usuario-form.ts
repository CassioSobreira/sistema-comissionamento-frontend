// src/app/components/forms/usuario-form/usuario-form.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

// Imports do PrimeNG para o formulário e modal
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';

// Nossos serviços e modelos
import { AdminService, Usuario } from '../../../../../../services/admin.service';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    ButtonModule
  ],
  templateUrl: './usuario-form.html',
})
export class UsuarioFormComponent implements OnInit {

  usuarioForm: FormGroup;
  isEditMode = false;
  currentUserId: number | null = null;
  perfis: any[] = []; // Para o dropdown

  constructor(
    private adminService: AdminService,
    public ref: DynamicDialogRef, // Para controlar o modal (ex: fechar)
    public config: DynamicDialogConfig, // Para receber dados no modal
    private messageService: MessageService
  ) {
    // Inicializa o formulário no construtor
    this.usuarioForm = new FormGroup({
      nome: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      id_perfil: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit(): void {
    this.carregarPerfis();

    // Verifica se estamos em modo de edição (se dados foram passados para o modal)
    if (this.config.data && this.config.data.usuario) {
      this.isEditMode = true;
      const usuario: Usuario = this.config.data.usuario;
      this.currentUserId = usuario.id_usuario;
      // Preenche o formulário com os dados do usuário
      this.usuarioForm.patchValue({
        nome: usuario.nome,
        email: usuario.email,
        id_perfil: this.config.data.usuario.id_perfil // Você precisará buscar o id_perfil
      });
    }
  }

  carregarPerfis(): void {
    this.adminService.getPerfis().subscribe(data => {
      this.perfis = data.map(perfil => ({ label: perfil.nome_perfil, value: perfil.id_perfil }));
    });
  }

  onSubmit(): void {
    if (this.usuarioForm.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha todos os campos obrigatórios.' });
      return;
    }

    const formData = this.usuarioForm.value;

    if (this.isEditMode && this.currentUserId) {
      // Lógica de ATUALIZAR (ainda a ser criada no AdminService)
      // this.adminService.updateUsuario(this.currentUserId, formData).subscribe(...)
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Lógica de atualização a ser implementada.' });

    } else {
      // Lógica de CRIAR (chama a função que já existe)
      this.adminService.registrarUsuario(formData).subscribe({
        next: () => this.ref.close(true), // Fecha o modal e retorna 'true' (sucesso)
        error: (err) => this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error.error || 'Falha ao criar usuário.' })
      });
    }
  }

  closeDialog(): void {
    this.ref.close(); // Fecha o modal sem retornar valor
  }
}