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
  filteredModulos: Modulo[] = [];
  selectedModulo: Modulo | null = null;
  usuarios: Usuario[] = [];
  value: any;
  date2: Date | null = null;
  filtroAberto = false;
  filtros = {
    nomeDocumento: '',
    usuario: '',
    dataFim: null,
    status: '',
    modulo: null,
    protocolo: ''
  };

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
    this.carregarModulos();
    if (this.id_usuario !== null) {
      this.carregarPendencias(this.id_usuario);
      
    }
  }

  carregarModulos() {
  this.modulosService.getTodosModulos().subscribe({
    next: (res) => this.modulos = res,
    error: (err) => console.error("Erro ao carregar módulos", err)
  });
  console.log("Módulos carregados:", this.modulos);
}

  carregarPendencias(id_usuario: number) {
    this.pendenciasService.getPendencias(id_usuario).subscribe((dados) => {
      console.log("Dados recebidos do serviço de pendências:", dados);

      this.pendenciasEmAndamento = dados.filter(
        p => p.aprovadoresConcluidos < p.totalAprovadores
      );

      this.pendenciasConcluidas = dados.filter(
        p => p.aprovadoresConcluidos === p.totalAprovadores
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

toggleFiltro() {
  this.filtroAberto = !this.filtroAberto;
}

searchModulo(event: any) {
  const query = event.query.toLowerCase();
  this.filteredModulos = this.modulos.filter(m =>
    m.nome_modulo.toLowerCase().includes(query)
  );
}
}
