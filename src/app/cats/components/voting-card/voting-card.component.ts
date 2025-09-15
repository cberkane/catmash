import { NgClass } from "@angular/common";
import { Component, Input, Output, EventEmitter } from "@angular/core";

import { ButtonComponent } from "@src/app/shared/components/button/button.component";

@Component({
  standalone: true,
  selector: "app-voting-card",
  templateUrl: "./voting-card.component.html",
  styleUrl: "./voting-card.component.scss",
  imports: [
    NgClass,
    ButtonComponent,
  ],
})
export class VotingCardComponent {
  @Input() label: string;
  @Input() imageUrl: string;
  @Output() vote = new EventEmitter<void>();

  isImageLoaded = false;

  onVote(event: MouseEvent): void {
    event.stopPropagation();
    this.vote.emit();
  }

  onImageLoad(): void {
    this.isImageLoaded = true;
  }
}
