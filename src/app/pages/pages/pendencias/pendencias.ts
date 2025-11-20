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
import { MessageService } from 'primeng/api';
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
  pendenciasRejeitadas: Pendencia[] = [];


  id_usuario: number | null = null;
  motivoRejeicao: string = "";
  firstAndamento = 0;
  rowsAndamento = 10;

  firstConcluidas = 0;
  rowsConcluidas = 10;
  firstRejeitadas = 0;
  rowsRejeitadas = 10;

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
    dataInicio: null,
    dataFim: null,
    status: '',
    modulo: null,
    protocolo: '',
    
  };

  constructor(
    private pendenciasService: PendenciasService,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    private modulosService: ModulosService,
    private messageService: MessageService,
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
}

  carregarPendencias(id_usuario: number) {
      this.pendenciasService.getPendencias(id_usuario).subscribe((dados) => {

        this.pendenciasRejeitadas = this.ordenarPendencias(
          dados.filter(p => p.status === 'rejeitado')
          
        );

        this.pendenciasConcluidas = this.ordenarPendencias(
          dados.filter(p => p.status === 'concluido')
        );

        this.pendenciasEmAndamento = this.ordenarPendencias(
          dados.filter(p =>
            p.status !== 'rejeitado' &&
            p.aprovadoresConcluidos < p.totalAprovadores
          )
        );
        console.log("Pendências carregadas:", dados);
        console.log("Pendências rejeitadas:", this.pendenciasRejeitadas)
        this.cd.detectChanges();
      });
      
    }

  aprovar(idDocumento: number) {
  if (this.id_usuario !== null) {
    this.pendenciasService.aprovarDocumento(idDocumento, this.id_usuario!)
  .subscribe(() => this.carregarPendencias(this.id_usuario!));
  }
}

  rejeitar(idDocumento: number, motivo: string) {
  console.log("Motivo dentro do Page:", motivo);

  if (this.id_usuario !== null) {
    this.pendenciasService
      .rejeitarDocumento(idDocumento, this.id_usuario!, motivo)
      .subscribe(() => this.carregarPendencias(this.id_usuario!));
  }
}

  onPageChangeAndamento(event: PaginatorState) {
  this.firstAndamento = event.first ?? 0;
  this.rowsAndamento = event.rows ?? 10;
}

onPageChangeRejeitadas(event: PaginatorState) {
  this.firstRejeitadas = event.first ?? 0;
  this.rowsRejeitadas = event.rows ?? 10;
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

recarregarPendencias() {
  if (this.id_usuario !== null) {
    this.carregarPendencias(this.id_usuario);
  }
}

ordenarPendencias(lista: Pendencia[]) {
  return lista.sort((a, b) => {

    const grupoA = a.status === 'rejeitado'
      ? 3
      : (a.status === 'concluido'
          ? 2
          : (a.usuarioAprovou ? 1 : 0));

    const grupoB = b.status === 'rejeitado'
      ? 3
      : (b.status === 'concluido'
          ? 2
          : (b.usuarioAprovou ? 1 : 0));

    if (grupoA !== grupoB) return grupoA - grupoB;

    // mesmo grupo → ordem por data
    const dataA = grupoA === 2 ? new Date(a.dataFim!) : new Date(a.dataInicio);
    const dataB = grupoB === 2 ? new Date(b.dataFim!) : new Date(b.dataInicio);

    return dataB.getTime() - dataA.getTime();
  });
}

aplicarFiltros() {
  if (this.id_usuario === null) return;

  this.pendenciasService.getPendencias(this.id_usuario).subscribe((dados) => {
    let filtradas = dados;

    // FILTRO POR MÓDULO
    if (this.selectedModulo !== null) {
      filtradas = filtradas.filter(p =>
        p.modulo?.toLowerCase() === this.selectedModulo!.nome_modulo.toLowerCase()
      );
    }

    // FILTRO POR NOME DO DOCUMENTO
    if (this.filtros.nomeDocumento.trim() !== "") {
      filtradas = filtradas.filter(p =>
        p.nomeDocumento?.toLowerCase().includes(this.filtros.nomeDocumento.toLowerCase())
      );
    }

    // FILTRO POR USUÁRIO
    if (this.filtros.usuario.trim() !== "") {
      filtradas = filtradas.filter(p =>
        p.nomeCriador.toLowerCase().includes(this.filtros.usuario.toLowerCase())
      );
    }

    // FILTRO POR PROTOCOLO
    if (this.filtros.protocolo.trim() !== "") {
      filtradas = filtradas.filter(p =>
        (p.numeroProtocolo ?? "").toString().includes(this.filtros.protocolo)
      );
    }

    // FILTRO POR DATA DE INÍCIO
    if (this.filtros.dataInicio) {
      const inicio = new Date(this.filtros.dataInicio).setHours(0,0,0,0);
      filtradas = filtradas.filter(p =>
        new Date(p.dataInicio).setHours(0,0,0,0) === inicio
      );
    }

    // FILTRO POR DATA DE FIM
    if (this.filtros.dataFim) {
      const fim = new Date(this.filtros.dataFim).setHours(0,0,0,0);
      filtradas = filtradas.filter(p =>
        p.dataFim && new Date(p.dataFim).setHours(0,0,0,0) === fim
      );
    }

    // AGORA REORGANIZA:
    this.pendenciasRejeitadas = this.ordenarPendencias(filtradas.filter(p => p.status === "rejeitado"));
    this.pendenciasConcluidas = this.ordenarPendencias(filtradas.filter(p => p.status === "concluido"));
    this.pendenciasEmAndamento = this.ordenarPendencias(filtradas.filter(p =>
      p.status !== 'rejeitado' &&
      p.aprovadoresConcluidos < p.totalAprovadores
    ));
    this.showSuccess("Filtros aplicados com sucesso.");

    this.cd.detectChanges();
  });
}

  limparFiltros() {
    this.selectedModulo = null;
      this.filtros = {
        nomeDocumento: '',
        usuario: '',
        dataInicio: null,
        dataFim: null,
        status: '',
        modulo: null,
        protocolo: '',
    }
    this.carregarPendencias(this.id_usuario!);
    this.showSuccess("Filtros limpos com sucesso.");
  }

   private showSuccess(detail: string) {
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: detail, life: 3000 });
  }

  private showError(detail: string) {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: detail });
  }
}
