import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import { Network } from '../classes/network'

@Injectable()
export class NetworkService {

  private networksCollection: AngularFirestoreCollection<Network>;
  networks: Observable<Network[]>;

  constructor(public afs: AngularFirestore, private storage: AngularFireStorage) {
    this.networksCollection = afs.collection<Network>('Networks');
    this.networks = this.networksCollection.snapshotChanges().map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Network;
        data.id = a.payload.doc.id;
        return data;
      })
    });
  }

  addNetwork(network: Network): any {
    return(
      this.networksCollection.add(network).then((value) => {
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

  uploadNetworkProfilePic(file){
    var id = Array(24).fill(0).map(x => Math.random().toString(36).charAt(2)).join('')

    const filePath = 'NetworkProfilePics' + '/' + id;
    return (
      this.storage.upload(filePath, file).then(val =>{
        console.log(val)
        return val.downloadURL
      })
    )
  }

  getNetworkWithID(networkID: string): any{
    console.log("NETWORKID")
    console.log(networkID)
    return(
      this.afs.doc<Network>(`Networks/${networkID}`).ref.get().then(doc=>{
        return doc.data()
      }).catch(function(error) {
          console.log("Error getting document:", error);
      })
    )
  }

  getNetworks(): any{
    return this.networks;
  }

  

}
