import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CrudService } from '../../../core/services/crud.service';
import { APIConstant } from '../../../core/constants/APIConstant';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  LoginForm!: FormGroup;
  hide: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private crudService: CrudService
  ) {}

  ngOnInit(): void {
    this.LoginForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
    });
  }

  async logIn() {
    if (this.LoginForm.valid) {
      const obj = JSON.parse(JSON.stringify(this.LoginForm.value));
      obj.email = obj.email.toLowerCase();
      try {
        await this.authService.login(obj);

        console.log('Login successful');
      } catch (error: any) {
        console.error('Login failed', error);
      }
    }
  }

  test() {
    this.crudService
      .get(APIConstant.READ_USER, {})
      .then((response: any) => {
        console.log(response?.data);
      })
      .catch((error: any) => {
        console.log(error?.error?.message);
      });
  }
}
