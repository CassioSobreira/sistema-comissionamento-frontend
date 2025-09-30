import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirma-senha',
  imports: [],
  templateUrl: './confirma-senha.html',
  styleUrls: ['./confirma-senha.css']
})
export class ConfirmaSenha {
  constructor(private router: Router) {}
  navegarParaLogin() {
      //para navegar para outras paginas adicione a funçao abaixo+nome da sua rote e 
      // coloque no botão a função (click)="nomeDaFunção()" nesse caso ficou (click)="navegarParaLogin()"
      this.router.navigate(['']);
    }

    navegarParaLoginPage(event: Event) {
    event.preventDefault(); // previne o salto para o topo
    this.router.navigate(['']);
  }

}
