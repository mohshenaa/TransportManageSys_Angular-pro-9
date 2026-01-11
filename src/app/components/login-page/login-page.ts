import { Component, signal } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { Login } from '../../models/login';
import { ValidationHelper } from '../../services/validation-helper';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  standalone: false,
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  model = signal<Login>(new Login());
  isSubmitting = signal(false);
  validationErrors: string[] = [];

  constructor(
    private auth: AuthService,
    private router: Router,
    private validationHelper: ValidationHelper
  ) {}

  FormSubmit(form: NgForm) {
    if (form.invalid) {
      this.validationErrors = this.validationHelper.getFormValidationMessages(form);
      return;
    }

    this.validationErrors = [];
    this.isSubmitting.set(true);

    this.auth.Login(this.model()).subscribe(
      (res: any) => {
        this.isSubmitting.set(false);
        this.auth.saveToken(res.token, res.name);
        console.info(`Token: ${res.token}`);
        this.router.navigate(['TripList']);
      },
      (error: Error) => {
        this.isSubmitting.set(false);
        console.error(error);
        this.validationErrors = ['Invalid username or password. Please try again.'];
      }
    );
  }
}
