import { Component } from '@angular/core';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { Fluid } from 'primeng/fluid';

@Component({
  selector: 'app-calendar-component',
  imports: [DatePickerModule,FormsModule,DatePicker,Fluid],
  templateUrl: './calendar-component.html',
  standalone: true,
  styleUrl: './calendar-component.css'
})
export class CalendarComponent {
  datetime24h: Date[] | undefined;

  time: Date[] | undefined;


  
}
