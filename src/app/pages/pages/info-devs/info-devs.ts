// Update the path below to the correct relative path for AuthService
import { AuthService } from '../../../../services/auth.service';
import type { dev } from './data/devList';
import { devList } from './data/devList';

import { Component } from '@angular/core';
import {  ButtonModule } from "primeng/button";
import { MenuBar } from "../../../components/shared-components/components/menu/menu-bar/menu-bar";

@Component({
  selector: 'app-info-devs',
  imports: [ButtonModule, MenuBar],
  templateUrl: './info-devs.html',
  providers: [AuthService]
})

export class InfoDevs {

  constructor(private authService: AuthService) { };
  devs: dev[] = devList;
  trackByNome = (_: number, d: dev) => d.nome;
}
