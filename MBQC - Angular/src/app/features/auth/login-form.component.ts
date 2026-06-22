import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatCardModule, 
    MatInputModule, 
    MatButtonModule, 
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  readonly isLoading = signal(false);
  readonly hidePassword = signal(true);

  readonly form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  togglePasswordVisibility() {
    this.hidePassword.update(v => !v);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const { username, password } = this.form.getRawValue();

    this.auth.login({ username, password }).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.data?.accessToken) {
          this.toast.success('Đăng nhập thành công');
        } else {
          this.toast.error('Đăng nhập thất bại. Tài khoản hoặc mật khẩu không đúng.');
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.toast.error('Đăng nhập thất bại. Vui lòng kiểm tra lại.');
      }
    });
  }
}
