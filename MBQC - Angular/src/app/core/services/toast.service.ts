import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ToastComponent } from '../../components/ui/toast/toast.component';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly snackBar = inject(MatSnackBar);

  private readonly defaultConfig: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
  };

  success(message: string, title?: string): void {
    this.snackBar.openFromComponent(ToastComponent, {
      ...this.defaultConfig,
      data: { message, title, type: 'success' },
      panelClass: ['toast-snack-container', 'toast-success']
    });
  }

  error(message: string, title?: string): void {
    this.snackBar.openFromComponent(ToastComponent, {
      ...this.defaultConfig,
      data: { message, title, type: 'error' },
      panelClass: ['toast-snack-container', 'toast-error']
    });
  }

  info(message: string, title?: string): void {
    this.snackBar.openFromComponent(ToastComponent, {
      ...this.defaultConfig,
      data: { message, title, type: 'info' },
      panelClass: ['toast-snack-container', 'toast-info']
    });
  }
}
