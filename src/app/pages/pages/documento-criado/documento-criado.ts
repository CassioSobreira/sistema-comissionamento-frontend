import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'; // Importe ActivatedRoute e Router
import { MenuBar } from '../../../components/shared-components/components/menu/menu-bar/menu-bar'; // Ajuste o caminho
import { ButtonModule } from 'primeng/button';
import { DocumentosService } from '../../../../services/documentos.service'; // Importe o serviço
import { ChangeDetectorRef } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-documento-criado',
  standalone: true,
  imports: [CommonModule, MenuBar, ButtonModule],
  templateUrl: './documento-criado.html',
})
export class DocumentoCriadoComponent implements OnInit {

  idDocumento: number | null = null;
  numeroProtocolo: string | null = null;
  isDownloading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private documentosService: DocumentosService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    // Lê o ID da rota (ex: /documentos/123/criado)
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.idDocumento = +idParam;
    }
    
    // Lê o número do protocolo dos queryParams (ex: ?protocolo=2025-00123)
    this.numeroProtocolo = this.route.snapshot.queryParamMap.get('protocolo');
  }

  baixarDocumento(): void {
    if (!this.idDocumento) return;

    this.isDownloading = true;

    this.documentosService.downloadDocumento(this.idDocumento)
      .pipe(
        finalize(() => {
            this.isDownloading = false;
            this.cdr.detectChanges(); // Força a atualização da tela
        })
      )
      .subscribe({
        next: (blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.style.display = 'none';
            a.href = url;
            // Usa o protocolo se tiver, senão o ID
            a.download = `documento-${this.numeroProtocolo || this.idDocumento}.pdf`; 
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            this.showSuccess('Download feito com sucesso.');
        },
        error: (err) => {
            console.error('Erro ao baixar PDF:', err);
            this.showError('Erro ao baixar o documento. Por favor, tente novamente mais tarde.');
        }
      });
  }

  irParaPendencias(): void {
    this.router.navigate(['/pendencias']); // Navega para a futura página de pendências
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
}