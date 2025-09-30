import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-esqueci-senha',
  imports: [],
  templateUrl: './esqueci-senha.html',
  styleUrl: './esqueci-senha.css'
})
export class EsqueciSenha {
  constructor(private router: Router) {}
  navegarParaLogin() {
      //para navegar para outras paginas adicione a funçao abaixo+nome da sua rote e 
      // coloque no botão a função (click)="nomeDaFunção()" nesse caso ficou (click)="navegarParaLogin()"
      this.router.navigate(['']);
    }

    navegarParaRedefinirSenha(event: Event) {
    event.preventDefault(); // previne o salto para o topo
    this.router.navigate(['/redefinir-senha']);}

    
  retornarParaLoginPage(event: Event) {
  event.preventDefault();
  this.router.navigate(['/login-page']); // ajuste a rota conforme seu app
}

}
