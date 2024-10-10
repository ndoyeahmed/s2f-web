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
          this.authService.connectedUser().subscribe(
            (user) => {
              console.log(user);
              this.loader = false;
              this.local.set('mdd_user', user);
              this.dispatchByRole(user.role);
            },
            (err) => {
              console.log(err);
              this.loader = false;
            }
          );
        },
        (error) => {
          this.errorMessage = 'email ou mot de passe incorrect';
        }
      );
    }
  }

  dispatchByRole(role: string) {
    switch (role) {
      case 'ADMIN':
        this.router.navigate(['/products']);
        break;
      case 'REVENDEUR':
        this.router.navigate(['/products']);
        break;
      default:
        this.router.navigate(['/products']);
        break;
    }
  }
}
