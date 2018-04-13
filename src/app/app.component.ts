import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

import { NetworkService } from './services/network.service';
import { Network } from './classes/network';

import { PodcastService } from './services/podcast.service';
import { Podcast } from './classes/podcast';
import { Season } from './classes/season';

import { DomSanitizer } from '@angular/platform-browser';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  authState: any;
  page: string;
  started: boolean = false;

  //PAGE 1 - Admin Login
  adminEmail: any;
  adminPassword: any;

  //Page2

  //Page 3 - Upload Network
  uploadSuccess: boolean;
  selectedFiles: any;

  //Page 4 - Upload Podcast
  networks: [Network];
  network: Network;

  seasons: any;
  season: any;

  categories: any;
  category: any;

  linkType: string;
  linkValue: string;

  //Page 5 - Home Page
  podcasts: Observable<Array<Podcast>>;


  //Page 6 - View Podcast
  podcastViewed: Podcast;
  networkAssociated: Network;
  relatedPodcasts: Array<Podcast>;

  //Page 7 - View NETWORK
  networkViewing: Network;
  networkViewingTotalViews: number;


  constructor (db: AngularFirestore, public afAuth: AngularFireAuth, public NetworkService: NetworkService, public PodcastService: PodcastService, public sanitizer: DomSanitizer, private spinnerService: Ng4LoadingSpinnerService){

    this.spinnerService.show()

    this.categories = ["Arts", "Comedy", "Education", "Games and Hobbies", "Politics", "Health", "Kids and Family", "News", "Spirituality and Religion", "Science and Medicine", "Society and Culture", "Sports and Rec", "Technology", "Business", "Film"]

    console.log("Hey")

    this.linkType="youtube";
    this.category = this.categories[0];

    // Check if the user is already logged in
    this.afAuth.authState.subscribe((auth) => {
          this.authState = auth
          if(this.authState){
            this.page = "adminPage2"
            console.log("Logged in")
          }
          else{
            this.page = "homePage"
          }
    });

    // GET ALL THE NETWORKS
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
            this.seasons = seasons
            this.season = this.seasons[this.seasons.length-1]
            return;
          }
          else{
            console.log("You have no podcasts")
            var newSeason = new Season(1,1)
            this.seasons = [newSeason]
            this.season = this.seasons[this.seasons.length-1]
            // return podcasts;
          }
        })
      }

      this.spinnerService.hide()

    });

    this.PodcastService.getPodcasts().subscribe(pods =>{
      this.podcasts = pods


    });



  }



  /*
  ADMIN PAGE

  This includes all the functions for the admin page, including adding a new network and adding a Podcast
  */

  //A function that directs the admin to the home page
  goHomeFromAdmin(){
    this.page="homePage"
  }

  //A login function if a admin has not yet logged in
  login(){
    console.log("Login to firebase auth")
    console.log(this.adminEmail);
    console.log(this.adminPassword);

    this.afAuth.auth.signInWithEmailAndPassword(this.adminEmail, this.adminPassword)
    .then(() => {
      this.page="adminPage2"
    })
    .catch(error => console.log(error));

  }

  //This opens up the add a new network page
  openPage3(){
    console.log("Hey")
    this.page="adminPage3"
  }


  /*

  This is the functions for adding a networks

  */

  //This detects the files for upload a profile picture
  detectFiles(event){
    this.selectedFiles = event.target.files;
  }

  //Accesses the network service to upload a profile picutre and returns the firebase download url
  uploadSingle(){
    let file = this.selectedFiles.item(0);
    return(
      this.NetworkService.uploadNetworkProfilePic(file).then(val=>{
        return val
      })
    )

  }

  //Sumbits a network and adds it to the firebase
  submitNetwork(name,bio,fb,twitter,youtube,itunes,spotify){
    if(name.value && bio.value && this.selectedFiles){
      this.spinnerService.show();
      this.uploadSingle().then(downloadURL =>{
        console.log(downloadURL)
        let network = new Network(name.value,bio.value,downloadURL,fb.value,twitter.value,youtube.value,itunes.value,spotify.value)
        console.log(network.printNetwork());
        this.NetworkService.addNetwork(<Network>network.getData()).then((value)=>{
          console.log(value)
          this.spinnerService.hide();
          this.uploadSuccess = true;
          this.NetworkService.getNetworks().subscribe(networks =>{
            console.log(networks)
          });
        }, (error) => {
          this.spinnerService.hide();
          alert(error)
        })
      })

    }else{
      alert("You must enter the name, bio and profile picture")
    }

  }

  //Goes back to the admin panel home page
  goHome(){
    this.uploadSuccess = false;
    this.page = "adminPage2"
  }

  //Goes to the add podcast page
  addPodcastFromNewNetwork(){
    this.uploadSuccess = false;
    this.page="adminPage4"
  }


  /*
  Upload podcast PAGE

  */

  //Opens the add podcast page for an admin
  openPage4(){
    this.page="adminPage4"
  }


  //Creates a new season object
  newSeason(seasons){
    console.log('New Season')
    var newSeason = new Season(seasons.length + 1,1)
    this.seasons.push(newSeason)
    this.season = this.seasons[this.seasons.length-1]
  }

  //Gets the podcasts for the current selected network
  networkChanged(network){
    console.log(network)
    let newPodcasts = this.PodcastService.getNetworksPodcasts(network.id).then((podcasts) => {
      console.log(podcasts)
      if(podcasts){
        console.log("You have some podcasts")
        var seasons = this.PodcastService.getSeasons(podcasts)
        console.log(seasons);
        this.seasons = seasons
        this.season = this.seasons[this.seasons.length-1]
      }
      else{
        console.log("You have no podcasts")
        var newSeason = new Season(1,1)
        this.seasons = [newSeason]
        this.season = this.seasons[this.seasons.length-1]
      }
    })


  }

  //Creates a new episode within the current season
  addEp(){
    this.season.increaseEpCount();
  }

  //Submits the podcast and uploads it to the firebase
  submitToExistingNetwork(episodetitle,podcastdesc,podcastnotes){
    if(this.network && this.season && this.category && episodetitle.value && podcastdesc.value && podcastnotes.value && this.linkType && this.linkValue){
      // console.log(this.network, this.season, this.category,episodetitle.value,podcastdesc.value,podcastnotes.value,this.linkType,this.linkValue)
      this.spinnerService.show();
      var newPodcastID = this.PodcastService.createPodcastID(this.network.networkName);
      let newPodcast= new Podcast(newPodcastID, this.network.id, this.network.networkName, this.season.season, this.season.epCount, episodetitle.value, podcastdesc.value, podcastnotes.value, this.category, this.linkType, this.linkValue)
      newPodcast.printPodcast();
      this.PodcastService.addPodcast(<Podcast>newPodcast.getData()).then((value) => {
        console.log(value)
        this.spinnerService.hide();
        this.uploadSuccess = true;
        this.PodcastService.getPodcasts().subscribe(podcasts =>{
          console.log(podcasts)
        });
      }, (error) => {
        this.spinnerService.hide();
        alert(error)
      })
      console.log(newPodcastID)
    }else{
      console.log("Not all filled in!")
      alert("You must fill in all the details!")
    }

  }

  //Goes back to the admin panel home page
  gotBackToAdminPanel(){
    this.uploadSuccess = false;
    this.page="adminPage2"

    //reset values
    this.network = this.networks[0];
    this.season = this.seasons[this.seasons.length-1];
    this.category = this.categories[0];
    this.linkType = "youtube";
    this.linkValue = null;
  }


  /*
  HOME PAGE

  This includes all the functions for the home page, including filtering, viewing a podcats and more
  */

  trackByFn(index, item){
    console.log("hey")
    return index;
  }

  //A function to filter the podcasts by a certain category
  filterByCategory(category){

    console.log(category)
    $('#exampleModalCenter').modal('hide')
    this.PodcastService.filterByCategory(category).then(filteredPodcasts=>{
      console.log(filteredPodcasts)
      this.podcasts = filteredPodcasts
    })
  }

  //A function to filter by the latest
  sortbyLatest(){
    console.log("Latest")
    this.PodcastService.getLatest().then(podcasts=>{
      console.log(podcasts)
      this.podcasts = podcasts
    })
  }

  //A function to filter by the most viewed
  sortByPopularity(){
    this.PodcastService.getMostPopular().then(podcasts=>{
      console.log(podcasts)
      this.podcasts = podcasts
    })
  }

  //A function that is called when a podcast is clicked
  increaseViews(podcastClicked: Podcast) {
    console.log("PODCAST CLICKED")
    console.log(podcastClicked)

    this.PodcastService.increaseViews(podcastClicked)
    this.podcastViewed=podcastClicked
    this.page="viewPodcast"

    this.NetworkService.getNetworkWithID(podcastClicked.networkID).then(network =>{
      this.networkAssociated = network
    })

    this.PodcastService.getCurrentSeasonForNetwork(podcastClicked.networkID, podcastClicked.season).then(relatedPods =>{
      console.log(relatedPods)
      this.relatedPodcasts = relatedPods
    })

  }

  /*
  View Podcast PAGE

  */

  goToHomePage(){
    this.page="homePage"
  }

  viewNetwork(networkAssociated){
    this.page='viewNetwork';
    this.beginViewNetworkPage(networkAssociated)
  }


  /*
  View Network Page

  */

  beginViewNetworkPage(network){
    this.networkViewing = network;

    this.PodcastService.getTotalViewsForNetwork(network.id).then(result=>{
      this.networkViewingTotalViews = result
    });
  }

  // VIEW ABOUT PAGE

  goToAboutPage(){
    this.page="aboutPage"
  }


  // VIEW SUBMIT PAGE

  goToSubmitPage(){
    this.page="submitPage"
  }


}
