import { Component, Input } from "@angular/core";

@Component({
  standalone: true,
  selector: "app-loading",
  templateUrl: "./loading.component.html",
  styleUrl: "./loading.component.scss",
  imports: [],
})
export class LoadingComponent {
  @Input() size: "sm" | "2x" | "3x" = "sm";
  @Input() theme: "light" | "dark" = "light";

  get loadingClass(): string {
    let classes = "la-ball-grid-pulse";
    classes += this.size ? ` la-${this.size}` : "";
    classes += this.theme === "dark" ? " la-dark" : "";
    return classes;
  }
}
