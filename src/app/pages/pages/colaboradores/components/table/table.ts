import { Component, OnInit } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModal } from '../button-modal/button-modal';

// Importando a interface Colaborador do arquivo customer.ts
import { Colaborador } from '../../../../../../domain/customer';
import { CustomerService } from '../../../../../../services/customerService';

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
    providers: [CustomerService]
})
export class TableFilterBasicDemo implements OnInit {

    colaboradores!: Colaborador[]; // A propriedade agora se chama 'colaboradores' e usa a interface Colaborador

    loading: boolean = true;

    // O CustomerService continua injetado com sua nomenclatura original
    constructor(private customerService: CustomerService) {}

    ngOnInit() {
        // Chamamos o novo método getColaboradores para buscar os dados
        this.customerService.getColaboradores().then((data) => {
            this.colaboradores = data;
            this.loading = false;
        });
    }

    clear(table: Table) {
        table.clear();
    }
}

