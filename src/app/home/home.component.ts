import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  title = 'ng-guard';

  @ViewChild('closeModal') closeModal: ElementRef;

  isLoggedIn = false;

  constructor() {
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
  }
}
