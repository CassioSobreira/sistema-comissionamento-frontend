import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PendenciasService } from '../../../../services/pendencias.service';
import { Pendencia } from '../../../../models/card-pendencia.interface';
import { TabsModule } from 'primeng/tabs';
import { CardPendenciaComponent } from '../../../components/shared-components/components/card-pendencia-component/card-pendencia-component';
import { MenuBar } from '../../../components/shared-components/components/menu/menu-bar/menu-bar';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-pendencias-page',
  standalone: true,
  imports: [TabsModule, MenuBar, CardPendenciaComponent, CommonModule],
  templateUrl: './pendencias.html'
})
export class PendenciasPageComponent implements OnInit {

  abaAtiva = 0;

  pendenciasEmAndamento: Pendencia[] = [];
  pendenciasConcluidas: Pendencia[] = [];

  id_usuario: number | null = null;

  constructor(
    private pendenciasService: PendenciasService,
    private authService: AuthService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.id_usuario = this.authService.getUserId();

    if (this.id_usuario !== null) {
      this.carregarPendencias(this.id_usuario);
    }
  }

  carregarPendencias(id_usuario: number) {
    this.pendenciasService.getPendencias(id_usuario).subscribe((dados) => {
      console.log("Dados recebidos do serviço de pendências:", dados);

      this.pendenciasEmAndamento = dados.filter(
        p => p.status === 'pendente'
      );

      this.pendenciasConcluidas = dados.filter(
        p => p.status === 'concluido'
      );

      console.log("Pendências em and carregadas:", this.pendenciasEmAndamento);
      console.log("Pendências concluidas carregadas:", this.pendenciasConcluidas);

      this.cd.detectChanges();
    });
  }

  aprovar(idDocumento: number) {
  if (this.id_usuario !== null) {
    this.pendenciasService.aprovarDocumento(idDocumento, this.id_usuario!)
  .subscribe(() => this.carregarPendencias(this.id_usuario!));
  }
}

  rejeitar(idDocumento: number) {
    if (this.id_usuario !== null) {
      this.pendenciasService.rejeitarDocumento(idDocumento, this.id_usuario!)
  .subscribe(() => this.carregarPendencias(this.id_usuario!));

    }
  }
}
