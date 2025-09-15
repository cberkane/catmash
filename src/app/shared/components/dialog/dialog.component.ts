import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges } from "@angular/core";
import { SvgIconComponent } from "angular-svg-icon";

@Component({
  standalone: true,
  selector: "app-dialog",
  templateUrl: "./dialog.component.html",
  styleUrl: "./dialog.component.scss",
  imports: [
    SvgIconComponent,
  ],
})
export class DialogComponent implements OnChanges {
  @Input() open: boolean;
  @Input() title: string;
  @Output() closed = new EventEmitter<void>();

  @ViewChild("dialogRef") dialogRef!: ElementRef<HTMLDialogElement>;

  ngOnChanges(): void {
    if (this.dialogRef) {
      if (this.open) this.dialogRef.nativeElement.showModal();
      else this.dialogRef.nativeElement.close();
    }
  }

  onClose(): void {
    this.closed.emit();
  }

  close(): void {
    this.dialogRef.nativeElement.close();
  }
}
