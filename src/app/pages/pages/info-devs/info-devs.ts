// Update the path below to the correct relative path for AuthService
import { AuthService } from '../../../../services/auth.service';
import type { dev } from './data/devList';
import type { orientador } from './data/orientList';
import { devList } from './data/devList';
import { orientList } from './data/orientList';
import { Component } from '@angular/core';
import {  ButtonModule } from "primeng/button";
import { MenuBar } from "../../../components/shared-components/components/menu/menu-bar/menu-bar";

@Component({
  selector: 'app-info-devs',
  imports: [ButtonModule, MenuBar],
  templateUrl: './info-devs.html',
  providers: [AuthService]
})

export class Info {
  devs: dev[] = devList;
  orientadores: orientador[] = orientList;

  constructor(private authService: AuthService) { }

  trackByNomeDev = (_: number, d: dev) => d.nome;
  trackByNomeOrient = (_: number, o: orientador) => o.nome;
}
