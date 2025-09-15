import { Component } from "@angular/core";

@Component({
  standalone: true,
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
  imports: [],
})
export class HeaderComponent {
  brandLogo = "assets/img/cat_brand.png";
}
