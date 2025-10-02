import { Component, OnInit } from '@angular/core';
import { PasswordInputComponent } from '../../../components/shared-components/components/password-input-component/password-input-component';
import { Router, ActivatedRoute } from '@angular/router'; 
import { AuthService } from '../../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MessageService } from 'primeng/api';

function senhasCoincidemValidator(control: AbstractControl): ValidationErrors | null {
  const novaSenha = control.get('novaSenha');
  const confirmarSenha = control.get('confirmarSenha');
  
  // Se os campos existem e seus valores são diferentes, retorna um erro
  if (novaSenha && confirmarSenha && novaSenha.value !== confirmarSenha.value) {
    return { senhasNaoCoincidem: true };
  }
  
  return null; // Se as senhas coincidem (ou os campos não existem), não há erro
}


@Component({
  selector: 'app-redefinir-senha',
  imports: [ 
    CommonModule,
    ReactiveFormsModule,
    PasswordInputComponent 
  ],
  templateUrl: './redefinir-senha.html',
  styleUrls: ['./redefinir-senha.css']
})
export class RedefinirSenha implements OnInit {

  redefinirSenhaForm = new FormGroup({
    novaSenha: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmarSenha: new FormControl('', [Validators.required]),
  }, { validators: senhasCoincidemValidator }); // Adiciona o validador ao FormGroup

  private token: string | null = null;
  isLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private messageService: MessageService
  ) {}  

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('token');
    });
  }

  onSubmit() {
    if (this.redefinirSenhaForm.invalid) {
      if (this.redefinirSenhaForm.hasError('senhasNaoCoincidem')) {
        this.showError('As senhas não coincidem.');
      } else {
        this.showWarn('Por favor, preencha os campos corretamente.');
      }
      return;
    }

    const novaSenha = this.redefinirSenhaForm.value.novaSenha!; // '!' é seguro aqui pois o form é válido
    this.isLoading = true;
    
    if (this.token) {
      this.authService.redefinirSenha(this.token, novaSenha).subscribe(this.handleResponse());
    } else {
      this.authService.redefinirSenhaLogado(novaSenha).subscribe(this.handleResponse());
    }
  }

  private handleResponse() {
    return {
      next: (response: any) => {
        this.isLoading = false;
        this.showSuccess(response.message);
        // Navega para a página de login após um pequeno delay
        setTimeout(() => {
          this.router.navigate(['']);
        }, 2000);
      },
      error: (err: any) => {
        this.isLoading = false;
        const erroMsg = err.error.error || 'Ocorreu um erro ao redefinir a senha.';
        this.showError(erroMsg);
      }
    }
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