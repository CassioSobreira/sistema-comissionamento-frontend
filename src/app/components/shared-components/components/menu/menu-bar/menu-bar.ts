import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RouterOutlet, Router } from '@angular/router';
import { Toolbar } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SplitButton } from 'primeng/splitbutton';
import { InputTextModule } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { DrawerModule } from 'primeng/drawer';
import { AvatarModule } from 'primeng/avatar';
import { AuthService } from '../../../../../../services/auth.service';  
@Component({
    selector: 'menu-bar',
    templateUrl: './menu-bar.html',
    standalone: true,
    imports: [AvatarModule,DrawerModule,Menubar, ToastModule,RouterOutlet,ToolbarModule,Toolbar, ButtonModule, SplitButton, InputTextModule, IconField, InputIcon],
    providers: [MessageService]
})
export class MenuBar implements OnInit {
    visible: boolean = false;
    items: MenuItem[] | undefined;

    constructor(private messageService: MessageService, private router: Router, private authService: AuthService) {}
    

    ngOnInit() {
        this.items = [
            {
                label: 'Update',
                icon: 'pi pi-refresh'
            },
            {
                label: 'Delete',
                icon: 'pi pi-times'
            }
        ];
    }

    logout() {
        this.authService.logout();
    }

    goToAdmin() {
        this.router.navigate(['/admin']);
    }
    
}