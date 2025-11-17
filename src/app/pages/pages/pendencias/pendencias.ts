import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PendenciasService } from '../../../../services/pendencias.service';
import { ApprovalCardData } from '../../../../models/card-pendencia.interface';
import { TabsModule } from 'primeng/tabs';
import { CardPendenciaComponent } from '../../../components/shared-components/components/card-pendencia-component/card-pendencia-component';
import { MenuBar } from '../../../components/shared-components/components/menu/menu-bar/menu-bar';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-pendencias-page',
  standalone: true,
  imports: [TabsModule, MenuBar, CardPendenciaComponent,CommonModule],
  templateUrl: './pendencias.html'
})
export class PendenciasPageComponent implements OnInit {

  abaAtiva = 0;

  pendenciasEmAndamento: ApprovalCardData[] = [];
  pendenciasConcluidas: ApprovalCardData[] = [];

  constructor(private pendenciasService: PendenciasService,
    private authService: AuthService,
    private cd: ChangeDetectorRef) {}

  ngOnInit() {
  const id_usuario = this.authService.getUserId();
  if (id_usuario) {
    this.carregarPendencias(id_usuario);
  }
}

carregarPendencias(id_usuario: number) {
  this.pendenciasService.getPendencias(id_usuario).subscribe((dados) => {

    this.pendenciasEmAndamento = dados.filter(
      p => p.status === 'Aguardando aprovação'
    );

    this.pendenciasConcluidas = dados.filter(
      p => p.status === 'Aprovado'
    );
    console.log(this.pendenciasEmAndamento);
    this.cd.detectChanges();  
  });
}

  aprovar(idDocumento: number) {
    this.pendenciasService.aprovarDocumento(idDocumento).subscribe(() => {
      const id_usuario = 1;
      this.carregarPendencias(id_usuario);
    });
  }

  rejeitar(idDocumento: number) {
    this.pendenciasService.rejeitarDocumento(idDocumento).subscribe(() => {
      const id_usuario = 1;
      this.carregarPendencias(id_usuario);
    });
  }
}
