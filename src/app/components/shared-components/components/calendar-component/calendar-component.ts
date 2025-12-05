import { Component, Output, EventEmitter } from '@angular/core';
import { DatePickerModule } from 'primeng/datepicker';
import { DatePicker } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { Fluid } from 'primeng/fluid';

@Component({
  selector: 'app-calendar-component',
  standalone: true,
  imports: [DatePickerModule, FormsModule, DatePicker, Fluid],
  templateUrl: './calendar-component.html',
  styleUrl: './calendar-component.css'
})
export class CalendarComponent {

  @Output() onSelectDate = new EventEmitter<Date>();

  datetime: Date | null = null;

  emitDate() {
    if (this.datetime) {
      this.onSelectDate.emit(this.datetime);
    }
  }
}
