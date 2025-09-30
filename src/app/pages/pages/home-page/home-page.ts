import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuBar } from '../../../components/shared-components/components/menu/menu-bar/menu-bar';
@Component({
  selector: 'app-home-page',
  imports: [MenuBar],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage {
  
}
