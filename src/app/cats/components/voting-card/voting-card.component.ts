import { NgClass } from "@angular/common";
import { Component, Input, Output, EventEmitter } from "@angular/core";

import { ButtonComponent } from "@src/app/shared/components/button/button.component";
import { DialogComponent } from "@src/app/shared/components/dialog/dialog.component";
import { SvgIconComponent } from "angular-svg-icon";

@Component({
  standalone: true,
  selector: "app-voting-card",
  templateUrl: "./voting-card.component.html",
  styleUrl: "./voting-card.component.scss",
  imports: [
    NgClass,
    ButtonComponent,
    DialogComponent,
    SvgIconComponent,
  ],
})
export class VotingCardComponent {
  @Input() label: string;
  @Input() imageUrl: string;
  @Output() vote = new EventEmitter<void>();

  showDialog = false;
  isImageLoaded = false;

  onVote(event: MouseEvent): void {
    event.stopPropagation();
    this.vote.emit();
  }

  onImageLoad(): void {
    this.isImageLoaded = true;
  }
}
