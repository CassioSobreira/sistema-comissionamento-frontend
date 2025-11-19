import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core'; // 1. Adicionado ViewChild
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';

// PrimeNG Imports
import { MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

// --- Nossas Importações ---
import { AuthService, UserTokenPayload } from '../../../../../../services/auth.service';
import { Subscription } from 'rxjs';
import { ConfigUser } from '../../config-user/config-user';
import { NotificacaoComponent } from "../../notificacao-component/notificacao-component"; 

interface MenuItem {
    label: string;
    icon: string; 
    route: string;
    perfisPermitidos?: string[]; 
}

@Component({
    selector: 'menu-bar',
    templateUrl: './menu-bar.html',
    standalone: true,
    imports: [
    CommonModule,
    AvatarModule,
    ButtonModule,
    DrawerModule,
    InputTextModule,
    MenuModule,
    ToastModule,
    ToolbarModule,
    ConfigUser,
    NotificacaoComponent
],
    providers: [MessageService]
})
export class MenuBar implements OnInit, OnDestroy {
    
    // 4. Adicionar @ViewChild para "capturar" o modal do HTML
    // O nome 'configUserModal' deve ser o mesmo do #apelido no HTML
    @ViewChild('configUserModal') configUserModal!: ConfigUser;

    nomeUsuario: string = '';
    iniciaisUsuario: string = '';
    
    // 5. Armazenar os dados completos do usuário
    private currentUser: UserTokenPayload | null = null; 
    
    private userSubscription?: Subscription;

    visible: boolean = false;
    paginaAtiva: string = 'home';

    readonly menuItems: MenuItem[] = [
        { label: 'HOME', icon: 'pi-home', route: 'home' },
        { label: 'PENDÊNCIAS', icon: 'pi-comment', route: 'pendencias' },
        { label: 'ESTATÍSCAS', icon: 'pi-chart-line', route: 'estatiscas' },
        {label: 'COLABORADORES', icon: 'pi-users', route: 'colaboradores'},
        { label: 'PAINEL DE ADMINSTRAÇÃO', icon: 'pi-address-book', route: 'admin', perfisPermitidos: ['Administrador'] }
    ];

    menuItemsVisiveis: MenuItem[] = [];

    private routerSubscription?: Subscription;
    
    constructor(
        private messageService: MessageService,
        private router: Router,
        private authService: AuthService
    ) {}

    ngOnInit() {

        this.userSubscription = this.authService.currentUser$.subscribe(user => {
            this.atualizarDadosUsuario(user);
        });
        this.filtrarMenuItems();

        this.setActiveFromUrl(this.router.url);

        this.routerSubscription = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.setActiveFromUrl(event.urlAfterRedirects);
            }
        });
    }

    private atualizarDadosUsuario(user: UserTokenPayload | null) {
        this.currentUser = user; // 6. Guardar o usuário completo
        
        if (user) {
            this.nomeUsuario = user.nome.split(' ')[0]; // Pega só o primeiro nome
            this.iniciaisUsuario = this.getIniciais(user.nome);
        } else {
            this.nomeUsuario = '';
            this.iniciaisUsuario = '';
        }
        
        // Filtra os itens de menu com base no novo estado do usuário
        this.filtrarMenuItems();
    }

    private getIniciais(nome: string): string {
        if (!nome) return '';
        const nomes = nome.split(' ');
        const primeiraInicial = nomes[0] ? nomes[0][0] : '';
        const ultimaInicial = nomes.length > 1 ? nomes[nomes.length - 1][0] : '';
        return (primeiraInicial + ultimaInicial).toUpperCase();
    }

    private filtrarMenuItems(): void {
        const perfilUsuario = this.authService.getPerfilUsuario();

        if (!perfilUsuario) {
            this.menuItemsVisiveis = [];
            return;
        }
        this.menuItemsVisiveis = this.menuItems.filter(item => 
            // Um item é visível se:
            // 1. Ele NÃO TEM uma lista de perfis definidos (é público para logados)
            !item.perfisPermitidos || 
            // OU
            // 2. A lista de perfis permitidos INCLUI o perfil do usuário
            item.perfisPermitidos.includes(perfilUsuario)
        );
    }

    ngOnDestroy() {
        this.routerSubscription?.unsubscribe();
        this.userSubscription?.unsubscribe(); // 7. Adicionado unsubscribe para user
    }

    selecionarPagina(rota: string) {
        this.paginaAtiva = rota;
        this.visible = false;
        this.router.navigate([rota]);
    }

    backToHome(){
        this.paginaAtiva = 'home';
        this.router.navigate(['home']);
    }

    logout() {
        this.authService.logout();
    }
    
    goToConfig() {
        this.paginaAtiva = 'configuracoes';
        this.configUserModal.abrirModal();
    }

    goToInfo() {
        this.paginaAtiva = 'info';
        this.router.navigate(['info']);
    }


    private setActiveFromUrl(url: string) {
        const segment = url.split('/').filter(Boolean)[0] || 'home';
        this.paginaAtiva = segment;
    }

}
