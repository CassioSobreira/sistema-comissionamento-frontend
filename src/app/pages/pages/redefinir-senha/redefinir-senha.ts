import { Component } from '@angular/core';
import { PasswordInputComponent } from '../../../components/shared-components/components/password-input-component/password-input-component';
import { Router } from '@angular/router'; 
@Component({
  selector: 'app-redefinir-senha',
  imports: [PasswordInputComponent],
  templateUrl: './redefinir-senha.html',
  styleUrls: ['./redefinir-senha.css']
})

export class RedefinirSenha {
  constructor(private router: Router) {}
  navegarParaLogin() {
      //para navegar para outras paginas adicione a funçao abaixo+nome da sua rote e 
      // coloque no botão a função (click)="nomeDaFunção()" nesse caso ficou (click)="navegarParaLogin()"
      this.router.navigate(['']);
    }

    navegarParaConfirmarSenha(event: Event) {
    event.preventDefault(); // previne o salto para o topo
    this.router.navigate(['/confirma-senha']);}

}