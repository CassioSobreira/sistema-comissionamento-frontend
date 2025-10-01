import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-password-input-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './password-input-component.html',
  styleUrls: ['./password-input-component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInputComponent),
      multi: true
    }
  ]
})
export class PasswordInputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() id: string = '';

  // Propriedades internas do componente
  value: string = '';
  isDisabled: boolean = false;

  // Funções de "ponte" que o Angular usa para se comunicar com o formulário.
  // Não é necessário alterar esta parte.
  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  /**
   * Método chamado pelo Angular Forms para escrever um valor no componente.
   */
  writeValue(value: any): void {
    this.value = value;
  }

  /**
   * Registra a função que deve ser chamada quando o valor do componente muda.
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Registra a função que deve ser chamada quando o componente é "tocado".
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Método chamado quando o estado de desabilitado do controle do formulário muda.
   */
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  /**
   * Atualiza o valor quando o usuário digita no input e notifica o Angular Forms.
   */
  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(this.value); // Notifica o formulário que o valor mudou
    this.onTouched(); // Notifica o formulário que o campo foi tocado
  }
}