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
  uploadSuccess: boolean;
  selectedFiles: any;

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

    this.uploadSuccess = false;

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

  detectFiles(event){
    this.selectedFiles = event.target.files;
  }

  uploadSingle(){
    let file = this.selectedFiles.item(0);
    return(
      this.NetworkService.uploadNetworkProfilePic(file).then(val=>{
        return val
      })
    )

  }

  submitNetwork(name,bio,fb,twitter,youtube,itunes,spotify){
    if(name.value && bio.value && this.selectedFiles){
      this.uploadSingle().then(downloadURL =>{
        console.log(downloadURL)
        let network = new Network(name.value,bio.value,downloadURL,fb.value,twitter.value,youtube.value,itunes.value,spotify.value)
        console.log(network.printNetwork());
        this.NetworkService.addNetwork(<Network>network.getData()).then((value)=>{
          console.log(value)
          this.uploadSuccess = true;
          this.NetworkService.getNetworks().subscribe(networks =>{
            console.log(networks)
          });
        }, (error) => {
          alert(error)
        })
      })

    }else{
      alert("You must enter the name, bio and profile picture")
    }

  }

  goHome(){
    this.uploadSuccess = false;
    this.adminPage3 = false;
    this.adminPage2 = true;
  }

  addPodcastFromNewNetwork(){
    this.uploadSuccess = false;
    this.adminPage3 = false;
    this.adminPage4 = true;
  }

  openPage4(){
    this.adminPage2 = false;
    this.adminPage4 = true;
  }




}
