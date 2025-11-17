import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { ModuleTagService } from '../../../../../services/modulo-tag.service';
import { DocumentosService } from '../../../../../services/documentos.service';
import { Pendencia } from '../../../../../models/card-pendencia.interface';
@Component({
  selector: 'app-card-pendencia-component',
  imports: [CardModule, ButtonModule, AvatarModule, TagModule, CommonModule],
  templateUrl: './card-pendencia-component.html',
  styleUrl: './card-pendencia-component.css'
})
export class CardPendenciaComponent {
  
  @Input() data!: Pendencia;

  @Output() aprovar = new EventEmitter<number>();
  @Output() rejeitar = new EventEmitter<number>();

  isDownloading = false;

  constructor(
    private moduleTagService: ModuleTagService,
    private documentosService: DocumentosService
  ) {}

  // === Botões Aprovar / Rejeitar ===
  onAprovar() {
    this.aprovar.emit(this.data.idDocumento);
  }

  onRejeitar() {
    this.rejeitar.emit(this.data.idDocumento);
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
    switch (this.data.status) {
      case 'pendente':
        return 'warn';
      case 'concluido':
        return 'success';
      default:
        return 'secondary';
    }
  }

  getStatusLabel() {
  if (this.data.status === 'pendente') {
    return 'Aguardando aprovação';
  }

  if (this.data.status === 'concluido') {
    return 'Concluído';
  }

  return this.data.status;
}


  // === Download ===
  baixarDocumento(): void {
    this.isDownloading = true;

    this.documentosService.downloadDocumento(this.data.idDocumento).subscribe({
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

        this.isDownloading = false;
      },
      error: (err) => {
        console.error('Erro ao baixar PDF:', err);
        this.isDownloading = false;
      }
    });
  }
}
