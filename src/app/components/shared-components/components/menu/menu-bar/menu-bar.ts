import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
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

interface MenuItem {
    label: string;
    icon: string; 
    route: string;
}

@Component({
    selector: 'menu-bar',
    templateUrl: './menu-bar.html',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        
        // Módulos PrimeNG
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
export class MenuBar implements OnInit {
    
    visible: boolean = false;
    paginaAtiva: string = 'home';

    menuItems: MenuItem[] = [
        { label: 'HOME', icon: 'pi-home', route: 'home' },
        { label: 'PENDÊNCIAS', icon: 'pi-comment', route: 'pendencias' },
        { label: 'CRIAR DOCUMENTO', icon: 'pi-plus-circle', route: 'criar-documento' },
    ];
    
    constructor(
        private messageService: MessageService,
        private router: Router
    ) {}

    ngOnInit() { }

    selecionarPagina(rota: string) {
        this.paginaAtiva = rota;
        this.router.navigate([rota]); 
    }
}