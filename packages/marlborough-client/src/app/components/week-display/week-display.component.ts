import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FRIDAY, MONDAY, SATURDAY, SUNDAY, THURSDAY, TUESDAY, WEDNESDAY } from '@marlborough/model';

@Component({
  selector: 'app-week-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './week-display.component.html',
  styleUrls: ['./week-display.component.scss']
})

export class WeekDisplayComponent {
  @Input() days: number = 0;
  @Input() narrow = false;
  get sunday(): boolean {
    return (this.days & SUNDAY) !== 0;
  }
  get monday(): boolean {
    return (this.days & MONDAY) !== 0;
  }
  get tuesday(): boolean {
    return (this.days & TUESDAY) !== 0;
  }
  get wednesday(): boolean {
    return (this.days & WEDNESDAY) !== 0;
  }
  get thursday(): boolean {
    return (this.days & THURSDAY) !== 0;
  }
  get friday(): boolean {
    return (this.days & FRIDAY) !== 0;
  }
  get saturday(): boolean {
    return (this.days & SATURDAY) !== 0;
  }

  dayText(d: string) {
    if (this.narrow) {
      return d[0];
    } else {
      return d;
    }
  }
}
