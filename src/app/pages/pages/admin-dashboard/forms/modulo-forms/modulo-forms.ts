import { ModulosService, Modulo } from '../../../../../../services/modulos.service';
import { Component, OnInit } from '@angular/core';
// ... outros imports ...
import { forkJoin, Observable, of } from 'rxjs'; // Importa forkJoin e of
import { switchMap } from 'rxjs/operators'; // Importa switchMap

// Import do PrimeNG MultiSelect
import { MultiSelectModule } from 'primeng/multiselect';
@Component({
  selector: 'app-modulo-forms',
  imports: [
    MultiSelectModule
  ],
  templateUrl: './modulo-forms.html',
  styleUrl: './modulo-forms.css'
})
export class ModuloForms {

}
