
import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule, FileUploadEvent, FileUploadHandlerEvent } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { ColaboradorService } from '../../../../../../services/colaboradores.service';

@Component({
    selector: 'button-modal',
    templateUrl: './button-modal.html',
    standalone: true,
    imports: [CommonModule, DialogModule, ButtonModule, FileUploadModule],
})
export class ButtonModal {
    visible: boolean = false;

    // 1. Crie um evento para notificar o componente pai
    @Output() uploadConcluido = new EventEmitter<void>();

    constructor(
        private messageService: MessageService,
        private colaboradorService: ColaboradorService 
    ) {}

    showDialog() {
        this.visible = true;
    }

    onCustomUpload(event: FileUploadHandlerEvent) {
       
        const file = event.files[0];
        if (!file) {
            return;
        }

        this.colaboradorService.importColaboradores(file).subscribe({
            next: (response) => {
                this.showSuccess('Colaboradores importados com sucesso!');
                this.visible = false; 
                this.uploadConcluido.emit(); 
            },
            error: (err) => {
                const erroMsg = err.error.error || 'Falha ao importar a planilha.';
                this.showError(erroMsg);
            }
        });
    }

    private showSuccess(detail: string) {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: detail, life: 3000 });
    }

    private showError(detail: string) {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: detail });
    }
  
    private showInfo(detail: string) {
        this.messageService.add({ severity: 'info', summary: 'Info', detail: detail });
    }
}