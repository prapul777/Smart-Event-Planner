import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit(): void {
    if (!this.loginForm.valid) return;
    const { email, password } = this.loginForm.value;
    this.auth.login(email, password).subscribe({
      next: () => {
        this.snackBar.open('Login successful', 'Close', { duration: 2000 });
        // Navigate to events page after successful login
        this.router.navigate(['/events']);
      },
      error: (err) => {
        const msg = err.error?.error || 'Login failed';
        this.snackBar.open(msg, 'Close', { duration: 3000 });
      }
    });
  }
}
