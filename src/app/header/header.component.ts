import { Component, Injectable, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
@Injectable()

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [ './header.Component.css' ]
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authStatusSub: Subscription;
  authStatus = false;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authStatus = this.authService.getIsAuth();
    this.authStatusSub = this.authService
    .getAuthStatusListnner()
    .subscribe(isAuthenticated => {
      this.authStatus = isAuthenticated;
    });
  }
  onLogOut() {
    this.authService.logOut();
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
