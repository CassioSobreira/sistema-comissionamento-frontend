import { Component } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'button-modal',
    templateUrl: './button-modal.html',
    standalone: true,
    imports: [Dialog, ButtonModule, InputTextModule]
})
export class ButtonModal {
    visible: boolean = false;

    showDialog() {
        this.visible = true;
    }
}
