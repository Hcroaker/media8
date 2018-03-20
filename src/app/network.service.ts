import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Network } from './network'

@Injectable()
export class NetworkService {

  private networksCollection: AngularFirestoreCollection<Network>;
  networks: Observable<Network[]>;

  constructor(afs: AngularFirestore) {
    this.networksCollection = afs.collection<Network>('Networks');
    this.networks = this.networksCollection.valueChanges();
  }

  addNetwork(network: Network) {
    this.networksCollection.add(network).then((value) => {
      console.log("SUCCESS")
      return value;
    }, (error) => {
      //Failure
      console.log("FAILURE")
      return error;
    });
  }

}
