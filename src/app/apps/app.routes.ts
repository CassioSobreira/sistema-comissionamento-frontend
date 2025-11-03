import { Routes } from '@angular/router';
import { LoginPageComponent } from '../pages/pages/login-page/login-page';
import { HomePage } from '../pages/pages/home-page/home-page';
import { EsqueciSenha } from '../pages/pages/esqueci-senha/esqueci-senha';
import { RedefinirSenha } from '../pages/pages/redefinir-senha/redefinir-senha';
import { ConfirmaSenha } from '../pages/pages/confirma-senha/confirma-senha';
import { Colaboradores } from '../pages/pages/colaboradores/colaboradores';
import { authGuard } from '../../guards/auth-guard';
import { AdminDashboard } from '../pages/pages/admin-dashboard/admin-dashboard';
import { Info } from '../pages/pages/info-devs/info-devs';
import { ConfigUser } from '../components/shared-components/components/config-user/config-user';
import { Entradas } from '../pages/pages/entradas/entradas';
import { CardPendenciaComponent } from '../components/shared-components/components/card-pendencia-component/card-pendencia-component';
export const routes: Routes = [
    // { path: '', component: HomeComponent },
    { path: '', component: LoginPageComponent},
    {
        path: 'pendencias', 
        component: CardPendenciaComponent       
    },
    { 
        path: 'home', 
        component: HomePage,
        canActivate: [authGuard] // ROTE PROTEGIDA COM O GUARD

    },
    {path:'esqueci-senha', component: EsqueciSenha},
    {
        path:'redefinir-senha',
        component: RedefinirSenha
    },
    { 
        path: 'redefinir-senha-logado', 
        component: RedefinirSenha, 
        canActivate: [authGuard] // O usuário precisa estar logado para acessar
    },
    { 
        path: 'admin', 
        component: AdminDashboard, 
        canActivate: [authGuard], // O usuário precisa estar logado para acessar
        data:
        {
            perfisPermitidos: ['Administrador'] // Apenas usuários com perfil 'Administrador' podem acessar
        }
    },
    {path: 'confirma-senha', component: ConfirmaSenha},
    {
        path: 'colaboradores', 
        component: Colaboradores,
        canActivate: [authGuard], // O usuário precisa estar logado para acessar
    },
    {
        path: 'info', 
        component: Info, 
        canActivate: [authGuard]
    },
    {
        path: 'configuracoes',
        component: ConfigUser,
        canActivate: [authGuard] // O usuário precisa estar logado para acessar
    },
    {
        path: 'modulos/:id_modulo/entradas',
        component: Entradas,
        canActivate: [authGuard] // O usuário precisa estar logado para acessar
    }

];
