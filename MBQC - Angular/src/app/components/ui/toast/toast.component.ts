import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgClass } from '@angular/common';

export interface ToastData {
  message: string;
  title?: string;
  type: 'success' | 'error' | 'info';
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [NgClass, MatIconModule, MatButtonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  readonly data: ToastData = inject(MAT_SNACK_BAR_DATA);
  readonly snackBarRef = inject(MatSnackBarRef<ToastComponent>);

  get icon(): string {
    switch (this.data.type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'info':
      default:
        return 'info';
    }
  }

  get title(): string {
    if (this.data.title) {
      return this.data.title;
    }
    switch (this.data.type) {
      case 'success':
        return 'Thành công';
      case 'error':
        return 'Lỗi';
      case 'info':
      default:
        return 'Thông báo';
    }
  }

  dismiss(): void {
    this.snackBarRef.dismiss();
  }
}
