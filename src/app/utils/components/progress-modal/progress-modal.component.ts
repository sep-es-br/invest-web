import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { ProgressSpinnerModule } from "primeng/progressspinner";

@Component({
    selector: 'spo-progress-modal',
    standalone: true,
    templateUrl: './progress-modal.component.html',
    styleUrl: './progress-modal.component.scss',
    imports: [CommonModule, ProgressSpinnerModule]
})
export class ProgressModalComponent {

    @Input() visivel = false;
}