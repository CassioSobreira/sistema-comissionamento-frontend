import { Component, OnInit, Input } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModal } from '../button-modal/button-modal';

// Importando a interface Colaborador do arquivo customer.ts
import { Colaborador } from '../../../../../../services/colaboradores.service';

@Component({
    selector: 'table-filter-basic-demo',
    templateUrl: 'table.html',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        InputTextModule,
        IconFieldModule,
        InputIconModule,
        HttpClientModule,
        ButtonModal
    ],
})
export class TableFilterBasicDemo{

    @Input() colaboradores: Colaborador[] = [];
    @Input() loading: boolean = true;
    // O CustomerService continua injetado com sua nomenclatura original
    constructor() {}

    clear(table: Table) {
        table.clear();
    }
}

