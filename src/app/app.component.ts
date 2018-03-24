import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

import { NetworkService } from './network.service';
import { Network } from './network';

import { PodcastService } from './podcast.service';
import { Podcast } from './podcast';
import { Season } from './season';

import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  authState: any;

  //Home Page
  homePage1: boolean;
  podcasts: [Podcast];

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

  constructor (db: AngularFirestore, public afAuth: AngularFireAuth, public NetworkService: NetworkService, public PodcastService: PodcastService, public sanitizer: DomSanitizer){

    this.categories = ["Arts", "Comedy", "Education", "Games and Hobbies", "Politics", "Health", "Kids and Family", "News", "Spirituality and Religion", "Science and Medicine", "Society and Culture", "Sports and Rec", "Technology", "Business", "Film"]


    this.linkType="youtube";
    this.category = this.categories[0];

    // Check if the user is already logged in
    this.afAuth.authState.subscribe((auth) => {
          this.authState = auth
          if(this.authState){
            this.adminPage = false
            this.adminPage2 = true;
            this.adminPage3 = false;
            console.log("Logged in")
          }
          else{
            this.adminPage = true;
            this.adminPage2 = false;
            this.adminPage3 = false;
          }
    });

    this.homePage1 = false;

    this.NetworkService.getNetworks().subscribe(networks =>{
      this.networks = networks
      this.network = this.networks[0]
      console.log(this.networks)
      if(networks.length>0){
        var newPodcasts = this.PodcastService.getNetworksPodcasts(this.network.id).then(podcasts => {
          if(podcasts){

            console.log("You have some podcasts")
            var seasons = this.PodcastService.getSeasons(podcasts)
            console.log(seasons);
            this.seasons = [seasons]
            this.season = this.seasons[this.seasons.length-1]
            return podcasts;
          }
          else{
            console.log("You have no podcasts")
            var newSeason = new Season(1)
            this.seasons = [newSeason]
            this.season = this.seasons[this.seasons.length-1]
            return podcasts;
          }
        })
      }

    });

    this.PodcastService.getPodcasts().subscribe(podcasts=>{
      this.podcasts = podcasts
      console.log(this.podcasts)
      podcasts.forEach(function(podcast){
        // console.log(podcast)
        var iframeString = podcast.linkValue;
        const regex = new RegExp('src=.+?(?=")')
        var iframeSrc = regex.exec(iframeString)[0]
        var newregex = new RegExp('(?<=\").*')
        var newIframeSrc = newregex.exec(iframeSrc)[0]
        if(newIframeSrc){
          console.log(newIframeSrc);
          podcast.linkValue = newIframeSrc
        }

      });
    })

    this.uploadSuccess = true;


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
    console.log(network)
    let newPodcasts = this.PodcastService.getNetworksPodcasts(network.id).then((podcasts) => {
      console.log(podcasts)
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

  addEp(){
    this.season.increaseEpCount();
  }

  submitToExistingNetwork(episodetitle,podcastdesc,podcastnotes){
    if(this.network && this.season && this.category && episodetitle.value && podcastdesc.value && podcastnotes.value && this.linkType && this.linkValue){
      // console.log(this.network, this.season, this.category,episodetitle.value,podcastdesc.value,podcastnotes.value,this.linkType,this.linkValue)
      var newPodcastID = this.PodcastService.createPodcastID(this.network.networkName);
      let newPodcast= new Podcast(newPodcastID, this.network.id, this.season.season, this.season.epCount, episodetitle.value, podcastdesc.value, podcastnotes.value, this.category, this.linkType, this.linkValue)
      newPodcast.printPodcast();
      this.PodcastService.addPodcast(<Podcast>newPodcast.getData()).then((value) => {
        console.log(value)
        this.uploadSuccess = true;
        this.PodcastService.getPodcasts().subscribe(podcasts =>{
          console.log(podcasts)
        });
      }, (error) => {
        alert(error)
      })
      console.log(newPodcastID)
    }else{
      console.log("Not all filled in!")
      alert("You must fill in all the details!")
    }

  }

  gotBackToAdminPanel(){
    this.uploadSuccess = false;
    this.adminPage4 = false;
    this.adminPage2 = true;

    //reset values
    this.network = this.networks[0];
    this.season = this.seasons[this.seasons.length-1];
    this.category = this.categories[0];
    this.linkType = "youtube";
    this.linkValue = null;
  }


}
