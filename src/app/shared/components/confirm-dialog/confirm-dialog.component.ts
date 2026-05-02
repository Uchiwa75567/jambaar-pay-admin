import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  template: `<p-confirmDialog
    icon="pi pi-exclamation-triangle"
    acceptLabel="Confirmer"
    rejectLabel="Annuler"
    acceptButtonStyleClass="p-button-danger"
    rejectButtonStyleClass="p-button-text">
  </p-confirmDialog>`,
})
export class ConfirmDialogComponent {}
