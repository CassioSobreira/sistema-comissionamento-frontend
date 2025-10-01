import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InputTextComponent } from '../../../components/shared-components/components/input-text-component/input-text-component';
import { PasswordInputComponent } from '../../../components/shared-components/components/password-input-component/password-input-component';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { CommonModule } from '@angular/common';

import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextComponent,
    PasswordInputComponent
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPageComponent {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', [Validators.required]),
  });

  constructor(
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  onSubmit() {
    if (this.loginForm.invalid) {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Atenção', 
        detail: 'Por favor, preencha o formulário corretamente.' 
      });
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        // 3. FAÇA A CHAMADA DIRETA
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Sucesso', 
          detail: 'Login realizado com sucesso!' 
        });
        
        localStorage.setItem('token', response.token);

        setTimeout(() => {
          if (response.primeiro_acesso === true) {
            this.router.navigate(['/redefinir-senha-logado']);
          } else {
            this.router.navigate(['/home']);
          }
        }, 500);
      },
      error: (err) => {
        console.error('Erro no login:', err);
        const erroMsg = err.error.error || 'Erro ao tentar fazer login. Tente novamente.';
        
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Erro', 
          detail: erroMsg 
        });
      }
    });
  }

  navegarPraEsqueciSenha(event: Event) {
    event.preventDefault();
    this.router.navigate(['/esqueci-senha']);
  }
}