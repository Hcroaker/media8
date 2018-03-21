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
  authState: any;

  //Admin PAGE
  adminPage: boolean;
  adminEmail: any;
  adminPassword: any;

  //Page2
  adminPage2: boolean;

  //Page 3
  adminPage3: boolean;

  //Page 4
  adminPage4: boolean;
  networks: any;
  seasons: any;
  categories: any;
  submission: any;

  constructor (db: AngularFirestore, public afAuth: AngularFireAuth){

    this.networks = ["Media8", "RandomNetwork", "Joe Rogan Experience", "Hardcore History"]
    this.seasons = ["Season 1", "Season 2", "Season 3", "Season 4", "Season 5", "Season 6"]
    this.categories = ["Arts", "Comedy", "Education", "Games and Hobbies", "Politics", "Health", "Kids and Family", "News", "Spirituality and Religion", "Science and Medicine", "Society and Culture", "Sports and Rec", "Technology", "Business", "Film"]
    this.submission = []

    //Check if the user is already logged in
    this.afAuth.authState.subscribe((auth) => {
          this.authState = auth
          if(this.authState){
            this.adminPage = false
            this.adminPage2 = true;
            this.adminPage3 = false;
          }
          else{
            this.adminPage = true;
            this.adminPage2 = false;
            this.adminPage3 = false;
          }
    });

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

  openPage3(){
    console.log("Hey")
    this.adminPage2 = false;
    this.adminPage3 = true;
  }

  openPage4(){
    this.adminPage2 = false;
    this.adminPage4 = true;
  }

  submitToExistingNetwork(){
    console.log(this.networks)
  }



}
