import { Component, Input, inject } from "@angular/core";
import { Router } from "@angular/router";
import { NavItem } from "@src/app/shared/types/nav-item";

@Component({
  standalone: true,
  selector: "app-bottom-nav",
  templateUrl: "./bottom-nav.component.html",
  styleUrl: "./bottom-nav.component.scss",
  imports: [],
})
export class BottomNavComponent {
  private router = inject(Router);
  @Input() item: NavItem;

  async navigate(): Promise<void> {
    await this.router.navigate([this.item.route]);
  }
}
