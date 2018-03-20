import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { NetworkService } from './network.service';
import { Network } from './network'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent{

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

  constructor (afs: AngularFirestore, public afAuth: AngularFireAuth, public NetworkService: NetworkService){

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

  submitNetwork(name,bio,profilePicture,fb,twitter,youtube,itunes,spotify){
    let network = new Network(name.value,bio.value,profilePicture.value,fb.value,twitter.value,youtube.value,itunes.value,spotify.value)
    console.log(network.printNetwork());
    this.NetworkService.addNetwork(<Network>network.getData()).then((value)=>{
      console.log(value)
    }, (error) => {
      alert(error)
    })
  }

  openPage4(){
    this.adminPage2 = false;
    this.adminPage4 = true;
  }




}
