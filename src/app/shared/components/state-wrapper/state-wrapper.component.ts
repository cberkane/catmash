import { Component, Input } from "@angular/core";
import { LoadingComponent } from "../loading/loading.component";

@Component({
  standalone: true,
  selector: "app-state-wrapper",
  templateUrl: "./state-wrapper.component.html",
  styleUrl: "./state-wrapper.component.scss",
  imports: [LoadingComponent],
})
export class StateWrapperComponent {
  @Input() loading: boolean;
  @Input() error: string | null;
}
