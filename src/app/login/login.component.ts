import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OneFinService } from '../services/one-fin.service';
import { take, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  loading = false;
  errorDialog = false;
  disablebtn = false;
  constructor(private onefinservice: OneFinService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      usernameInput: new FormControl('', Validators.required),
      passwordInput: new FormControl('', Validators.required),
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.loading = true;

    console.log(
      'Credentials inside onSubmit ' +
        this.loginForm.get('usernameInput').value +
        ',' +
        this.loginForm.get('passwordInput').value
    );

    this.onefinservice
      .login(
        this.loginForm.get('usernameInput').value,
        this.loginForm.get('passwordInput').value
      )
      .pipe(
        finalize(() => {
          this.disablebtn = true;
          console.log('Inside pipe finalize');
        })
      )
      .subscribe(
        (data) => {
          this.disablebtn = false;
          localStorage.setItem('access_token', data.data.token);
          this.router.navigate([
            '/movies',
            { state: { token: data.data.token } },
          ]);
        },
        (error) => {
          this.errorDialog = true;
          if (error.status !== 400) {
            this.errorDialog = true;
            console.log('Error in Api');
          }
        }
      );
  }

  get loginFormControl() {
    return this.loginForm.controls;
  }
}
