import { Subscription } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { User } from './../../shared/user.model';
import { AuthService } from './../../auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit, OnDestroy {

  updateForm: FormGroup;
  user: User;
  userSub: Subscription;
  showUpdateTab = false;
  constructor(private authService: AuthService) { }

  onSubmit() {
    console.log(this.updateForm.value);
    this.authService.updateAccount(this.updateForm.value);
    this.showUpdateTab = false;
  }

  ngOnInit() {
    this.user = this.authService.User;
    this.userSub = this.authService.getUserSub().subscribe( response => this.user = response);

    this.updateForm = new FormGroup({
      name: new FormControl(this.user.name),
      email: new FormControl(this.user.email),
      password: new FormControl()
    });
  }
  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

}
