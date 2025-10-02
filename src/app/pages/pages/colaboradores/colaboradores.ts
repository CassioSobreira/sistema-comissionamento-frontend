import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ButtonModal } from './components/button-modal/button-modal';
import { TableFilterBasicDemo } from './components/table/table';
import { MenuBar } from '../../../components/shared-components/components/menu/menu-bar/menu-bar';  

@Component({
  selector: 'app-colaboradores',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModal,
    TableFilterBasicDemo,
    MenuBar
  ],
  templateUrl: './colaboradores.html',
  styleUrls: ['./colaboradores.css']
})
export class Colaboradores {

}
