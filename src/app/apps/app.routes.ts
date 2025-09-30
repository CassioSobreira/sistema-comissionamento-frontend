import { Routes } from '@angular/router';
import { LoginPageComponent } from '../pages/pages/login-page/login-page';
import { HomePage } from '../pages/pages/home-page/home-page';
import { EsqueciSenha } from '../pages/pages/esqueci-senha/esqueci-senha';
import { RedefinirSenha } from '../pages/pages/redefinir-senha/redefinir-senha';
import { ConfirmaSenha } from '../pages/pages/confirma-senha/confirma-senha';
import { Colaboradores } from '../pages/pages/colaboradores/colaboradores';
export const routes: Routes = [
    // { path: '', component: HomeComponent },
    { path: '', component: LoginPageComponent},
    { path: 'home', component: HomePage},
    {path:'esqueci-senha', component: EsqueciSenha},
    {path:'redefinir-senha',component: RedefinirSenha},
    {path: 'confirma-senha', component: ConfirmaSenha},
    {path: 'colaboradores', component: Colaboradores}
];