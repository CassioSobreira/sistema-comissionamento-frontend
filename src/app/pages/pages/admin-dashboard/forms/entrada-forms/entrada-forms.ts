import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { tap, Observable, forkJoin, of } from 'rxjs'; // Import forkJoin and of
import { switchMap, finalize } from 'rxjs/operators';

// Imports do PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToggleButtonModule } from 'primeng/togglebutton';

import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect'; 

import { EntradasService, Entrada } from '../../../../../../services/entradas.service';

@Component({
  selector: 'app-entrada-forms',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    ButtonModule,
    ToggleSwitchModule,
    MultiSelectModule,
    ToggleButtonModule
  ],
  templateUrl: './entrada-forms.html',
  styleUrl: './entrada-forms.css'
})
export class EntradaForms {

}
