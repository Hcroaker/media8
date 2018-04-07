import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import { Podcast } from '../classes/podcast'
import { Season } from '../classes/season'
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class PodcastService {

  private podcastsCollection: AngularFirestoreCollection<Podcast>;
  podcasts: Observable<Podcast[]>;
  podcastDoc: AngularFirestoreDocument<Podcast>;

  constructor(public afs: AngularFirestore, private storage: AngularFireStorage,  public sanitizer: DomSanitizer) {
    this.podcastsCollection = afs.collection<Podcast>('Podcasts', ref => ref.orderBy('uploadDate', 'desc'));
    this.podcasts = this.podcastsCollection.snapshotChanges().map(changes => {
      return changes.map(a => {
        console.log("Collection Changed")
        console.log(changes)
        console.log(a)
        const data = a.payload.doc.data() as Podcast;
        data.id = a.payload.doc.id;
        return data;
      })
    });
  }

  //Create a new podcastID 'networkName' + n alphanumericCharacters
  createPodcastID(networkName: string){
    var alphaNum = Array(15).fill(0).map(x => Math.random().toString(36).charAt(2)).join('')
    return networkName + '_' + alphaNum;
  }

  //Add a podcast for a given network
  addPodcast(podcast: Podcast): any {
    return(
      this.podcastsCollection.doc(podcast.id).set(podcast).then((value) => {
        console.log("SUCCESS")
        // alert("Upload success")
        return value;
      }, (error) => {
        //Failure
        console.log("FAILURE")
        // alert("Upload Failure" + error)
        return error;

      })
    );
  }

  //Get all the podcasts
  getPodcasts(): any{
    return this.podcasts
  }

  //Get Podcasts for a given network
  getNetworksPodcasts(networkID: string): any{
  console.log(networkID)
    return(
      this.podcastsCollection.ref.where('networkID', '==', networkID).get().then(querySnapshot => {

        var newPodcasts = Array<Podcast>();

        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            const data2 = doc.data() as Podcast;
            data2.id = doc.id;
            console.log(data2)
            newPodcasts.push(data2)
        });

        return newPodcasts
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      })
    )



  }

  //Returns the seasons and number of episodes for each season given a networks podcasts
  getSeasons(podcasts: any): any{
    console.log(podcasts)

    //search through each podcast
    var seasons = new Array<Season>();
    podcasts.forEach(function(podcast) {
      console.log(podcast)

      var foundSeason = false;

      //check if its season already exists
      for(var i=0; i<seasons.length; i+=1){
        if(seasons[i].season == podcast.season){
          seasons[i].increaseEpCount()
          foundSeason = true;
          break
        }
      }

      //else, create a newseason
      if(!foundSeason){
        var newSeason = new Season(podcast.season, 0)
        seasons.push(newSeason)
      }

    })

    seasons.forEach(function(season){
      season.increaseEpCount()
    })
    console.log("SEASONS")
    console.log(seasons)

    return seasons
  }

  //Filters the podcasts by a category
  filterByCategory(category: string): any{
    return(
      this.podcastsCollection.ref.where('category', '==', category).get().then(querySnapshot => {

          var newPodcasts = Array<Podcast>();

          querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
              const data2 = doc.data() as Podcast;
              data2.id = doc.id;
              console.log(data2)
              newPodcasts.push(data2)
          })

          return newPodcasts

      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      })
    )
  }

  getLatest(): any{
    return(
      this.podcastsCollection.ref.orderBy('uploadDate','desc').get().then(querySnapshot => {

          var newPodcasts = Array<Podcast>();

          querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
              const data2 = doc.data() as Podcast;
              data2.id = doc.id;
              console.log(data2)
              newPodcasts.push(data2)
          })

          return newPodcasts

      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      })
    )
  }

  getMostPopular(): any{
    return(
      this.podcastsCollection.ref.orderBy('views','desc').get().then(querySnapshot => {

          var newPodcasts = Array<Podcast>();

          querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
              const data2 = doc.data() as Podcast;
              data2.id = doc.id;
              console.log(data2)
              newPodcasts.push(data2)
          })

          return newPodcasts

      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      })
    )
  }

  getCurrentSeasonForNetwork(networkID:string, season: number): any{
    return(
      this.podcastsCollection.ref.where('networkID', '==', networkID).where('season', '==', season).orderBy('episode', 'asc').get().then(querySnapshot => {

          var networksPodcasts = Array<Podcast>();

          querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
              const data2 = doc.data() as Podcast;
              data2.id = doc.id;
              console.log(data2)
              networksPodcasts.push(data2)
          })

          return networksPodcasts

      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      })
    )
  }

  increaseViews(podcast: Podcast){
    this.podcastDoc = this.afs.doc(`Podcasts/${podcast.id}`)
    var data = {
      views: podcast.views+1
    }
    this.podcastDoc.update(data)
    console.log(this.podcastDoc)

  }

}
