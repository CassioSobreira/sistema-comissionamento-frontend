import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PasswordModule } from 'primeng/password';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-password-input-component',
  imports: [PasswordModule,FormsModule],
  templateUrl: './password-input-component.html',
  styleUrl: './password-input-component.css'
})
export class PasswordInputComponent {
  @Input() value: string = '';                  // valor vindo da página
  @Output() valueChange = new EventEmitter<string>(); // emite alterações

  senha: string = '';
  mostrarFeedback = false;

// Chamado quando o usuário foca no campo pela primeira vez


}