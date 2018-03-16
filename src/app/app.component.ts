import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  //Admin PAGE
  adminPage: boolean;
  adminEmail: any;
  adminPassword: any;

  //Page2
  adminPage2: any;

  constructor (db: AngularFirestore, public afAuth: AngularFireAuth){
    console.log("Opened")
    this.adminPage = true;
    this.adminPage2 = false;
  }

  //ADMIN PAGE
  login(){
    console.log("Login to firebase auth")
    console.log(this.adminEmail);
    console.log(this.adminPassword);

    this.afAuth.auth.signInWithEmailAndPassword(this.adminEmail, this.adminPassword)
    .then(() => {
      this.adminPage = false;
      this.adminPage2 = true;
    })
    .catch(error => console.log(error));

  }




}
