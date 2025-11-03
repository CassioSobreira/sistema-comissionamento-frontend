import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { ModuleTagService } from '../../../../../services/modulo-tag.service';

export interface ApprovalCardData {
  nome: string;
  modulo: string;
  status: 'Aguardando aprovação' | 'Aprovado' | 'Rejeitado';
  nomeDocumento: string;
  imageUrl?: string;
}

@Component({
  selector: 'app-card-pendencia-component',
  imports: [CardModule,ButtonModule,AvatarModule,TagModule,CommonModule],
  templateUrl: './card-pendencia-component.html',
  styleUrl: './card-pendencia-component.css'
})
export class CardPendenciaComponent {
  @Input() data!: ApprovalCardData;
  @Output() approve = new EventEmitter<void>();
  @Output() reject = new EventEmitter<void>();

constructor(private moduleTagService: ModuleTagService) {}

  // 🔹 Métodos auxiliares (usando o service)
  getModuleLabel() {
    return this.moduleTagService.getLabel(this.data?.modulo);
  }

  getModuleIcon() {
    return this.moduleTagService.getIcon(this.data?.modulo);
  }

  getModuleClass(modulo: string) {
    return this.moduleTagService.getClass(modulo); 
  }

   ngOnInit() {
    // 🔹 simulação de dados locais enquanto não vem do pai
    if (!this.data) {
      this.data = {
        nome: 'João Silva',
        modulo: 'FABRICAÇÃO',
        status: 'Aguardando aprovação',
        nomeDocumento: 'Relatório Final - Unidade 04',
        imageUrl: ''
      };
    }
  }

getStatusSeverity() {
    switch (this.data.status) {
      case 'Aguardando aprovação': return 'warn';
      case 'Aprovado': return 'success';
      case 'Rejeitado': return 'danger';
      default: return 'info';
    }
  }

  getModuleSeverity() {
    switch (this.data.modulo) {
      case 'Meio Ambiente': return 'success';
      case 'Segurança': return 'danger';
      case 'Qualidade': return 'info';
      default: return 'secondary';
    }
  }
}
