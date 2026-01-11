import { Component, signal } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Register } from '../../models/register';
import { Router } from '@angular/router';
import { ValidationHelper } from '../../services/validation-helper';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register-page',
  standalone: false,
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
})
export class RegisterPage {
  model = signal<Register>(new Register());
  isSubmitting = signal(false);
  validationErrors: string[] = [];
  serverError = signal('');

  constructor(
    private auth: AuthService,
    private router: Router,
    private validationHelper: ValidationHelper
  ) {}

  passwordsMatch(): boolean {
    return this.model().password === this.model().comparePassword;
  }

  FormSubmit(form: NgForm) {
    this.validationErrors = [];
    this.serverError.set('');

    if (form.invalid) {
      this.validationErrors = this.validationHelper.getFormValidationMessages(form);
      return;
    }

    if (!this.passwordsMatch()) {
      this.validationErrors.push('Passwords do not match');
      return;
    }

    this.isSubmitting.set(true);

    this.auth.Register(this.model()).subscribe(
      (res: any) => {
        this.isSubmitting.set(false);
        console.log('Registration successful:', res);
        this.router.navigate(['login']);
      },
      (error: Error) => {
        this.isSubmitting.set(false);
        console.error('Registration error:', error);

        if (error.message?.includes('409')) {
          this.validationErrors.push('Username or email already exists');
        } else {
          this.validationErrors.push('Registration failed. Please try again.');
        }
      }
    );
  }
}
