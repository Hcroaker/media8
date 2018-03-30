import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import { Podcast } from './podcast'
import { Season } from './season'

@Injectable()
export class PodcastService {

  private podcastsCollection: AngularFirestoreCollection<Podcast>;
  podcasts: Observable<Podcast[]>;

  constructor(public afs: AngularFirestore, private storage: AngularFireStorage) {
    this.podcastsCollection = afs.collection<Podcast>('Podcasts');
    this.podcasts = this.podcastsCollection.snapshotChanges().map(changes => {
      return changes.map(a => {
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
  getSeasons(podcasts: any){

    var seasons = new Array<Season>();
    podcasts.forEach(function(podcast) {
      for(var i=0; i<seasons.length; i+=1){
        if(seasons[i].season == podcast.season){
          seasons[i].increaseEpCount()
        }
        else{
          var newSeason = new Season(podcast.season)
          seasons.push(newSeason)
        }
      }
    })

    return seasons
  }

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
  
  increaseViews(podcast: Podcast){

    var databasePodcast = this.afs.doc<Podcast>('Podcasts/' + podcast.id)
    var newViews = podcast.views+1
    console.log(databasePodcast)
    console.log(newViews)
    var data = {
      views: newViews
    }
    databasePodcast.update(data)

  }

}
