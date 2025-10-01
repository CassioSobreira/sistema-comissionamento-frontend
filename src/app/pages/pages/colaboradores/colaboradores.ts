import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ButtonModal } from './components/button-modal/button-modal';
import { TableFilterBasicDemo } from './components/table/table';
@Component({
  selector: 'app-colaboradores',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModal,
    TableFilterBasicDemo
    
  ],
  templateUrl: './colaboradores.html',
  styleUrls: ['./colaboradores.css']
})
export class Colaboradores {

}
