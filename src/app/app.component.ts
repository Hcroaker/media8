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
  uploadSuccess: boolean;
  selectedFiles: any;


  //Page 4
  adminPage4: boolean;
  networks: any;
  seasons: any;
  categories: any;

  constructor (db: AngularFirestore, public afAuth: AngularFireAuth){

    this.networks = ["Media8", "RandomNetwork", "Joe Rogan Experience", "Hardcore History"]
    this.seasons = ["Season 1", "Season 2", "Season 3", "Season 4", "Season 5", "Season 6"]
    this.categories = ["Arts", "Comedy", "Education", "Games and Hobbies", "Politics", "Health", "Kids and Family", "News", "Spirituality and Religion", "Science and Medicine", "Society and Culture", "Sports and Rec", "Technology", "Business", "Film"]


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

  submitToExistingNetwork(){
    console.log(this.existingNetworkData)
  }

  existingNetworkData = {
    network : 'network',
    episodenum : 'episodenum',
    episodetitle:'episodetitle',
    podcastdesc: 'podcastdesc',
    podcastnotes: 'podcastnotes',
    youtube: 'youtube',
    soundcloud: 'soundcloud',
    spotify: 'spotify'

}


}
