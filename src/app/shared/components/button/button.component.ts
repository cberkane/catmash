import { Component, Output, EventEmitter } from "@angular/core";

@Component({
  standalone: true,
  selector: "app-button",
  templateUrl: "./button.component.html",
  styleUrl: "./button.component.scss",
  imports: [],
})
export class ButtonComponent {
   @Output() clicked = new EventEmitter<MouseEvent>();

  onClick(event: MouseEvent): void {
    this.clicked.emit(event);
  }
}
