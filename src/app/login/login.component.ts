import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../utils/services/authentication.service';
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule]
})
export class LoginComponent  {

  faRightToBracket = faArrowRightToBracket;
  constructor(private router: Router, private authenticationService: AuthenticationService ) { 
  }

  login(){
  this.authenticationService.acessoCidadaoSignIn();
  }

}
