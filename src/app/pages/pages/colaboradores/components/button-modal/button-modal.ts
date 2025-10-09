// Em: button-modal.ts

import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

// Imports do PrimeNG
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

import { FileUploadModule, FileUploadEvent, FileUploadHandlerEvent } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Importe seu serviço
import { ColaboradorService } from '../../../../../../services/colaboradores.service';

@Component({
    selector: 'button-modal',
    templateUrl: './button-modal.html',
    standalone: true,
    imports: [ 
            CommonModule,
            DialogModule,
            ButtonModule,
            FileUploadModule,
            ToastModule,
        ],
})
export class ButtonModal {
    visible: boolean = false;

    // 1. Crie um evento para notificar o componente pai
    @Output() uploadConcluido = new EventEmitter<void>();

    constructor(
        private messageService: MessageService,
        private colaboradorService: ColaboradorService // 2. Injete o serviço
    ) {}

    showDialog() {
        this.visible = true;
    }

    /**
     * 3. Esta é a nova função que será chamada pelo p-fileupload.
     * Ela substitui a antiga 'onUpload'.
     */
    onCustomUpload(event: FileUploadHandlerEvent) {
        // Pega o primeiro (e único) arquivo selecionado
        const file = event.files[0];
        if (!file) {
            return;
        }

        this.colaboradorService.importColaboradores(file).subscribe({
            next: (response) => {
                this.messageService.add({ 
                    severity: 'success', 
                    summary: 'Sucesso', 
                    detail: 'Colaboradores importados com sucesso!' 
                });
                this.visible = false; // Fecha o modal
                this.uploadConcluido.emit(); // 4. Avisa o componente pai para atualizar a tabela
            },
            error: (err) => {
                const erroMsg = err.error.error || 'Falha ao importar a planilha.';
                this.messageService.add({ 
                    severity: 'error', 
                    summary: 'Erro', 
                    detail: erroMsg
                });
            }
        });
    }
}