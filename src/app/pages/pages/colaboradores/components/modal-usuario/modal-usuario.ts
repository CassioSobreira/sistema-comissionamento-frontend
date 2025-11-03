import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

interface Option {
  name: string;
  code: string;
}

@Component({
  selector: 'modal-usuario',
  templateUrl: './modal-usuario.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    MultiSelectModule
  ]
})
export class ModalUsuario implements OnInit {
  visible: boolean = false;

  cargosOptions!: Option[];
  modulosOptions!: Option[];
  sexoOptions!: Option[]; 
  selectedCargos!: Option[];
  selectedModulos!: Option[];
  selectedSexos!: Option[]; 
  nome: string = '';
  email: string = '';

  ngOnInit() {
    this.cargosOptions = [
      { name: 'Desenvolvedor Jr', code: 'DEV_JR' },
      { name: 'Desenvolvedor Pleno', code: 'DEV_PL' },
      { name: 'Gerente de Projetos', code: 'GP' }
    ];

    this.modulosOptions = [
      { name: 'Módulo de Gestão', code: 'GEST' },
      { name: 'Módulo Financeiro', code: 'FIN' },
      { name: 'Módulo de RH', code: 'RH' }
    ];

    
    this.sexoOptions = [
        { name: 'Masculino', code: 'M' },
        { name: 'Feminino', code: 'F' },
        { name: 'Outro', code: 'O' }
    ];
  }

  showDialog() {
    this.visible = true;
  }

  save() {
    console.log({
      nome: this.nome,
      email: this.email,
      cargos: this.selectedCargos,
      modulos: this.selectedModulos,
      sexos: this.selectedSexos 
    });
    this.visible = false;
  }
}