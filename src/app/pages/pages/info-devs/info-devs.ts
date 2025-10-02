// Update the path below to the correct relative path for AuthService
import { AuthService } from '../../../../services/auth.service';


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

  constructor(private authService: AuthService) { }
}
