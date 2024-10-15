import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-web-storage';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export default class LoginComponent {
  form: FormGroup;
  loader = false;
  errorMessage = '';
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private local: LocalStorageService
  ) {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.email]),
    });
  }

  login() {
    if (this.form.valid) {
      this.loader = true;
      const val = this.form.value;
      this.authService.login(val).subscribe(
        () => {
          this.loader = false;
        },
        (error) => {
          this.loader = false;
          this.errorMessage = 'email ou mot de passe incorrect';
        }
      );
    }
  }
}
