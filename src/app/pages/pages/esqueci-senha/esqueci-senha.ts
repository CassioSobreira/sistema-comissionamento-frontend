import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InputTextComponent } from '../../../components/shared-components/components/input-text-component/input-text-component';
import { AuthService } from '../../../../services/auth.service'; // Ajuste o caminho se necessário
import { MessageService } from 'primeng/api'; // Importa o MessageService diretamente
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-esqueci-senha',
  imports: [
    CommonModule,
    ReactiveFormsModule, // Módulo para formulários reativos
    InputTextComponent
  ],
  templateUrl: './esqueci-senha.html',
  styleUrl: './esqueci-senha.css'
})
export class EsqueciSenha {
  
  esqueciSenhaForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  isLoading = false

  constructor(
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService 
  ) {}

onSubmit() {
    if (this.esqueciSenhaForm.invalid) {
      this.showWarn('Por favor, insira um e-mail válido.');
      return;
    }

    this.isLoading = true; // Inicia o estado de carregamento
    const email = this.esqueciSenhaForm.value.email || '';

    // Chama o serviço para iniciar o processo de redefinição de senha
    this.authService.esqueciSenha(email).subscribe({
      next: (response) => {
        this.isLoading = false; // Finaliza o carregamento
        // Mostra a mensagem de sucesso genérica que vem do back-end
        this.showSuccess(response.message);
        this.router.navigate(['']);
      },
      error: (err) => {
        this.isLoading = false; // Finaliza o carregamento
        const erroMsg = err.error.error || 'Ocorreu um erro ao processar a solicitação.';
        this.showError(erroMsg);
      }
    });
  } 
  
  navegarParaLogin() {
      //para navegar para outras paginas adicione a funçao abaixo+nome da sua rote e 
      // coloque no botão a função (click)="nomeDaFunção()" nesse caso ficou (click)="navegarParaLogin()"
      this.router.navigate(['']);
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


