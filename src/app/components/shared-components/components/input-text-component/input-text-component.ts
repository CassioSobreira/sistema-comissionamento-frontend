import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-text-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input-text-component.html',
  // ESTA PARTE É A MÁGICA. É O "PLUG" PARA O SISTEMA DE FORMULÁRIOS.
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextComponent),
      multi: true
    }
  ]
})
export class InputTextComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() id: string = '';

  value: string = '';
  isDisabled: boolean = false;

  // Funções que o Angular usará para se comunicar com o componente
  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  // Chamado quando o valor do formulário muda externamente.
  writeValue(value: any): void {
    this.value = value;
  }

  // Registra a função que será chamada quando o valor do componente mudar internamente.
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Registra a função que será chamada quando o componente for "tocado".
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Chamado quando o estado de 'disabled' do controle do formulário muda.
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  // Método para atualizar o valor quando o usuário digita no input
  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(this.value);
    this.onTouched();
  }
}