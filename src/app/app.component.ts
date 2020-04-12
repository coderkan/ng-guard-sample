import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'ng-guard';

  @ViewChild('closeModal') closeModal: ElementRef;

  constructor(private router: Router, private authService: AuthService) {

  }

  ngOnInit(): void {
  }


  login(val: string) {
    this.authService.login(val)
      .subscribe(res => {
        if (res.success) {
          this.closeModal.nativeElement.click();
        }
      });
  }

  logout() {

    this.authService.logout()
      .subscribe(res => {
        if (!res.success) {
          this.router.navigate(['/home']);

        }
      });
  }

  goToDashBoard() {
    let role = this.authService.getRole();
    if (role === 'ROLE_ADMIN')
      this.router.navigate(['admin']);
    if (role === 'ROLE_USER')
      this.router.navigate(['/user']);

  }

}
