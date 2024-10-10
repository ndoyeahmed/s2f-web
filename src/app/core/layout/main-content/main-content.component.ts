import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import $ from 'jquery';
import { AuthService } from '../../auth/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss',
})
export class MainContentComponent {
  toggle = false;
  user: any;

  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.authService.connectedUser().subscribe((user) => {
      this.user = user;
    });
  }

  toggled() {
    this.toggle = !this.toggle;
  }

  logout() {
    this.authService.logout();
  }
}
