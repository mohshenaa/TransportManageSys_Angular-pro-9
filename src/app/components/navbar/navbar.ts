import { Component, inject, signal } from '@angular/core';
import { AuthService, LoggedIn, UserName} from '../../services/auth-service';

@Component({
  selector: 'app-navbar',
  standalone: false, // Standalone component
  //imports: [CommonModule, RouterModule], // Import necessary modules
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar {
 protected readonly title = signal('Transport Management System');
 auth = inject(AuthService);
  loggedIn = LoggedIn;
  name = UserName;

  ngOnInit() {
    this.auth.isLoggedIn();
  }
}
