import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ButtonModal } from './componentes/button-modal/button-modal';

@Component({
  selector: 'app-colaboradores',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModal
    
  ],
  templateUrl: './colaboradores.html',
  styleUrls: ['./colaboradores.css']
})
export class Colaboradores {

}
