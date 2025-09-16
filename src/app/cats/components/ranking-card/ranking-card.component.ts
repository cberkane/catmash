import { NgClass } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
  standalone: true,
  selector: "app-ranking-card",
  templateUrl: "./ranking-card.component.html",
  styleUrl: "./ranking-card.component.scss",
  imports: [
    NgClass,
  ],
})
export class RankingCardComponent {
  @Input() rank: number;
  @Input() label: string;
  @Input() imageUrl: string;
  @Input() score: number;
  @Input() variant?: "first" | "second" | "third";

  isImageLoaded = false;

  onImageLoad() {
    this.isImageLoaded = true;
  }
}
