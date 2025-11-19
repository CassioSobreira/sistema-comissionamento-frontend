import { Component, EventEmitter, Input, Output, ChangeDetectorRef } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ModuleTagService } from '../../../../../services/modulo-tag.service';
import { DocumentosService } from '../../../../../services/documentos.service';
import { Pendencia } from '../../../../../models/card-pendencia.interface';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { Toast } from "primeng/toast";
import { TextareaModule } from 'primeng/textarea';
import { FloatLabel } from 'primeng/floatlabel';

@Component({
  selector: 'app-card-pendencia-component',
  imports: [FloatLabel,TextareaModule,DialogModule,ConfirmDialogModule, FormsModule, CardModule, ButtonModule, AvatarModule, TagModule, CommonModule, Toast],
  templateUrl: './card-pendencia-component.html',
  styleUrl: './card-pendencia-component.css'
})
export class CardPendenciaComponent {
  
  @Input() data!: Pendencia;

  @Output() aprovar = new EventEmitter<number>();
  @Output() rejeitar = new EventEmitter<{ idDocumento: number, motivo: string }>();
  isDownloading = false;
  showRejeitarDialogVisible: boolean = false;
  motivoRejeicao: string = "";
  showMotivoDialog = false;


  constructor(
    private moduleTagService: ModuleTagService,
    private documentosService: DocumentosService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private ConfirmationService: ConfirmationService
  ) {}

  // === Botões Aprovar / Rejeitar ===
  onAprovar() {
    this.aprovar.emit(this.data.idDocumento);
  }

  abrirMotivoDialog() {
  this.showMotivoDialog = true;
}

showRejeitarDialog() {
  this.motivoRejeicao = "";
  this.showRejeitarDialogVisible = true;
}

cancelarRejeicao() {
  this.showRejeitarDialogVisible = false;
}

confirmarRejeicao() {
  if (!this.motivoRejeicao || this.motivoRejeicao.trim().length === 0) {
    this.messageService.add({
      severity: "warn",
      summary: "Atenção",
      detail: "Informe um motivo para rejeitar a pendência."
    });
    return;
  }

  this.showRejeitarDialogVisible = false;

  // 🔥 envia para o componente pai o id + motivo
  this.rejeitar.emit({
    idDocumento: this.data.idDocumento,
    motivo: this.motivoRejeicao
  });
  console.log("saindo do componente card:", this.motivoRejeicao);

  this.messageService.add({
    severity: "success",
    summary: "Rejeitado",
    detail: "Pendência rejeitada com sucesso."
  });
}
  // === Tags do módulo ===
  getModuleLabel() {
    return this.moduleTagService.getLabel(this.data.modulo);
  }

  getModuleIcon() {
    return this.moduleTagService.getIcon(this.data.modulo);
  }

  getModuleClass(modulo: string) {
    return this.moduleTagService.getClass(modulo);
  }

  getModuleSeverity() {
  // Exemplo simples
  return this.data.status === 'pendente'
      ? 'warning'
      : 'success';
}

  // === Tag de Status ===
  getStatusSeverity() {
  if (this.data.status === 'rejeitado') {
    return "danger";
  }

  if (this.data.aprovadoresConcluidos === this.data.totalAprovadores) {
    return "success";
  }

  if (this.data.aprovadoresConcluidos === 0) {
    return "warn";
  }

  return "info";
}
  getStatusLabel() {
  if (this.data.status === 'rejeitado') {
    return "Rejeitado";
  }

  if (this.data.aprovadoresConcluidos === this.data.totalAprovadores) {
    return "Concluído";
  }
  if (this.data.aprovadoresConcluidos === 0) {
    return "Pendente";
  }
  return "Parcial";
}

getStatusIcon() {
  if (this.data.status === 'rejeitado') {
    return 'pi pi-times-circle';
  }

  if (this.data.aprovadoresConcluidos === this.data.totalAprovadores) {
    return 'pi pi-check-circle';
  }

  if (this.data.aprovadoresConcluidos === 0) {
    return 'pi pi-clock';
  }

  return 'pi pi-spinner';
}

  // === Download ===
// === Download ===
  baixarDocumento(): void {
    this.isDownloading = true;

    this.documentosService.downloadDocumento(this.data.idDocumento)
      .pipe(
        finalize(() => {
            this.isDownloading = false;
            this.cdr.detectChanges(); 
        })
      )
      .subscribe({
        next: (blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `documento-${this.data.numeroProtocolo}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            this.showSuccess('Download feito com sucesso.');
        },
        error: (err) => {
            console.error('Erro ao baixar PDF:', err);
            this.showError('Erro ao baixar o documento. Por favor, tente novamente mais tarde.');
        }
      });
  }

   private showSuccess(detail: string) {
    this.messageService.add({ 
      severity: 'success', 
      summary: 'Sucesso', 
      detail: detail,
      life: 3000
    });
  }

  private showError(detail: string) {
    this.messageService.add({ 
      severity: 'error', 
      summary: 'Erro', 
      detail: detail 
    });
  }

  private showWarn(detail: string) {
    this.messageService.add({ 
      severity: 'warn', 
      summary: 'Atenção', 
      detail: detail 
    });
  }

  isAprovadoPeloUsuario() {
  return this.data.usuarioAprovou === true;
}
}

