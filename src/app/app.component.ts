import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'ng-guard';

  @ViewChild('closeModal') closeModal: ElementRef;

  isLoggedIn = false;

  constructor(private router: Router) {
    this.isLoggedIn = false;
  }
  ngOnInit(): void {
  }


  loginAsUser() {
    this.isLoggedIn = true;
  }

  loginAsAdmin() {
    console.log('Login As aDmin');
    this.isLoggedIn = true;
    this.closeModal.nativeElement.click();

  }

  logout() {
    this.isLoggedIn = false;
    this.router.navigate(['/home']);
  }

  goToDashBoard() {
    this.router.navigate(['/admin']);
  }

}
