import { Routes } from '@angular/router';
import { LoginPageComponent } from '../pages/pages/login-page/login-page';
import { HomePageComponent } from '../pages/pages/home-page/home-page';
import { EsqueciSenha } from '../pages/pages/esqueci-senha/esqueci-senha';
import { RedefinirSenha } from '../pages/pages/redefinir-senha/redefinir-senha';
import { ConfirmaSenha } from '../pages/pages/confirma-senha/confirma-senha';
export const routes: Routes = [
    // { path: '', component: HomeComponent },
    { path: '', component: LoginPageComponent },
    { path: 'home', component: HomePageComponent },
    {path:'esqueci-senha', component: EsqueciSenha},
    {path:'redefinir-senha',component: RedefinirSenha},
    {path: 'confirma-senha', component: ConfirmaSenha}
];