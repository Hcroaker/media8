import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

import { NetworkService } from './network.service';
import { Network } from './network';

import { PodcastService } from './podcast.service';
import { Podcast } from './podcast';
import { Season } from './season'

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

  networks: [Network];
  network: Network;

  seasons: any;
  season: any;

  categories: any;
  category: any;

  linkType: string;
  linkValue: string;

  constructor (db: AngularFirestore, public afAuth: AngularFireAuth, public NetworkService: NetworkService, public PodcastService: PodcastService){

    this.seasons = ["Season 1", "Season 2", "Season 3", "Season 4", "Season 5", "Season 6"]
    this.categories = ["Arts", "Comedy", "Education", "Games and Hobbies", "Politics", "Health", "Kids and Family", "News", "Spirituality and Religion", "Science and Medicine", "Society and Culture", "Sports and Rec", "Technology", "Business", "Film"]



    this.linkType="youtube";
    this.season = this.seasons[0];
    this.category = this.categories[0];

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

    this.NetworkService.getNetworks().subscribe(networks =>{
      this.networks = networks
      this.network = this.networks[0]
      console.log(this.networks)
      let newPodcasts = this.PodcastService.getNetworksPodcasts(this.network  .id).then(podcasts => {
        if(podcasts){
          console.log("You have some podcasts")
          var seasons = this.PodcastService.getSeasons(podcasts)
          console.log(seasons);
          this.seasons = [seasons]
          this.season = this.seasons[this.seasons.length-1]
        }
        else{
          console.log("You have no podcasts")
          var newSeason = new Season(1)
          this.seasons = [newSeason]
          this.season = this.seasons[this.seasons.length-1]
        }
      })
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

  //Admin Page 4

  openPage4(){
    this.adminPage2 = false;
    this.adminPage4 = true;
  }

  newSeason(seasons){
    console.log('New Season')
    var newSeason = new Season(seasons.length + 1)
    this.seasons.push(newSeason)
    this.season = this.seasons[this.seasons.length-1]
  }

  networkChanged(network){
    let newPodcasts = this.PodcastService.getNetworksPodcasts(network.id).then(podcasts => {
      if(podcasts){
        console.log("You have some podcasts")
        var seasons = this.PodcastService.getSeasons(podcasts)
        console.log(seasons);
        this.seasons = [seasons]
        this.season = this.seasons[this.seasons.length-1]
      }
      else{
        console.log("You have no podcasts")
        var newSeason = new Season(1)
        this.seasons = [newSeason]
        this.season = this.seasons[this.seasons.length-1]
      }
    })


  }

  submitToExistingNetwork(episodenum,episodetitle,podcastdesc,podcastnotes){
    console.log(this.network, this.season, episodenum.value, this.category,episodetitle.value,podcastdesc.value,podcastnotes.value,this.linkType,this.linkValue)
  }

  existingNetworkData = {
    network : 'network',
    season : 'season',
    category : 'category',
    episodenum : 'episodenum',
    episodetitle:'episodetitle',
    podcastdesc: 'podcastdesc',
    podcastnotes: 'podcastnotes',
    youtube: 'youtube',
    soundcloud: 'soundcloud',
    spotify: 'spotify'

}


}
