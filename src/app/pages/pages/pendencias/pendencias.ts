import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PendenciasService } from '../../../../services/pendencias.service';
import { Pendencia } from '../../../../models/card-pendencia.interface';
import { TabsModule } from 'primeng/tabs';
import { CardPendenciaComponent } from '../../../components/shared-components/components/card-pendencia-component/card-pendencia-component';
import { MenuBar } from '../../../components/shared-components/components/menu/menu-bar/menu-bar';
import { AuthService } from '../../../../services/auth.service';
import { PaginatorModule, PaginatorState  } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import {DrawerModule} from "primeng/drawer";
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ModulosService,Modulo } from '../../../../services/modulos.service';
import { AdminService,Usuario } from '../../../../services/admin.service';
@Component({
  selector: 'app-pendencias-page',
  standalone: true,
  imports: [InputTextModule,FormsModule,SelectModule,DatePickerModule,AutoCompleteModule,DrawerModule,ButtonModule,PaginatorModule,TabsModule, MenuBar, CardPendenciaComponent, CommonModule],
  templateUrl: './pendencias.html'
})
export class PendenciasPageComponent implements OnInit {

  abaAtiva = 0;

  pendenciasEmAndamento: Pendencia[] = [];
  pendenciasConcluidas: Pendencia[] = [];

  id_usuario: number | null = null;
  firstAndamento = 0;
  rowsAndamento = 10;

  firstConcluidas = 0;
  rowsConcluidas = 10;

  visible: boolean = false;
  modulos: Modulo[] = [];
  usuarios: Usuario[] = [];
  value: any;
  filteredModulos: Modulo[] = [];

  constructor(
    private pendenciasService: PendenciasService,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    private modulosService: ModulosService
  ) {}

  search(event: any) {
    
  }


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

  onPageChangeAndamento(event: PaginatorState) {
  this.firstAndamento = event.first ?? 0;
  this.rowsAndamento = event.rows ?? 10;
}

onPageChangeConcluidas(event: PaginatorState) {
  this.firstConcluidas = event.first ?? 0;
  this.rowsConcluidas = event.rows ?? 10;
}

}
