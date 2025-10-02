import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { AuthService } from '../../../../../../services/auth.service';
import { Subscription } from 'rxjs';

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
    ],
    providers: [MessageService]
})
export class MenuBar implements OnInit, OnDestroy {
    
    visible: boolean = false;
    paginaAtiva: string = 'home';

    readonly menuItems: MenuItem[] = [
        { label: 'HOME', icon: 'pi-home', route: 'home' },
        { label: 'PENDÊNCIAS', icon: 'pi-comment', route: 'pendencias' },
        { label: 'CRIAR DOCUMENTO', icon: 'pi-plus-circle', route: 'criar-documento' },
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

        this.filtrarMenuItems();

        this.setActiveFromUrl(this.router.url);

        this.routerSubscription = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.setActiveFromUrl(event.urlAfterRedirects);
            }
        });
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
    }
    selecionarPagina(rota: string) {
        this.paginaAtiva = rota;
        this.visible = false;
        this.router.navigate([rota]);
    }

    logout() {
        this.authService.logout();
    }
    
    private setActiveFromUrl(url: string) {
        const segment = url.split('/').filter(Boolean)[0] || 'home';
        this.paginaAtiva = segment;
    }
 
}