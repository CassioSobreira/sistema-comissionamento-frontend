import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Imports do PrimeNG necessários para o modal, botão, uploader e notificações
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
// O tipo 'FileUploadEvent' é importado diretamente do PrimeNG
import { FileUploadModule, FileUploadEvent } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'button-modal',
    templateUrl: './button-modal.html',
    standalone: true,
    // Todos os módulos do PrimeNG foram unificados aqui
    imports: [
        CommonModule,
        DialogModule,
        ButtonModule,
        FileUploadModule,
        ToastModule
    ]
    // A linha 'providers' foi removida daqui, pois agora está no app.config.ts
})
export class ButtonModal {
    // Controla a visibilidade do modal
    visible: boolean = false;

    // Lógica do componente de upload
    uploadedFiles: any[] = [];

    // Injeta o serviço de mensagens para as notificações (toast)
    constructor(private messageService: MessageService) {}

    // Abre o modal
    showDialog() {
        this.visible = true;
    }

    // Função chamada quando um arquivo é enviado com sucesso
    // Agora usa o tipo correto 'FileUploadEvent' do PrimeNG
    onUpload(event: FileUploadEvent) {
        for (let file of event.files) {
            this.uploadedFiles.push(file);
        }
        this.messageService.add({ severity: 'info', summary: 'Sucesso', detail: 'Arquivo enviado.' });
    }
}

