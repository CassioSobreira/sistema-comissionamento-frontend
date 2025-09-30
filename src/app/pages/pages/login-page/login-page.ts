import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { value } from '@primeuix/themes/aura/knob';
import { InputTextComponent } from '../../../components/shared-components/components/input-text-component/input-text-component';
import { PasswordInputComponent } from '../../../components/shared-components/components/password-input-component/password-input-component';

@Component({
  selector: 'app-login-page',
  imports: [InputTextComponent,PasswordInputComponent],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPageComponent {
  value: string = '';
  constructor(private router: Router) {}
    navegarParaHome() {
      //para navegar para outras paginas adicione a funçao abaixo+nome da sua rota e 
      // coloque no botão a função (click)="nomeDaFunção()" nesse caso ficou (click)="navegarParaHome()"
      this.router.navigate(['/home']);
    }

   navegarPraEsqueciSenha(event: Event) {
    event.preventDefault(); // previne o salto para o topo
    this.router.navigate(['/esqueci-senha']);
}
}