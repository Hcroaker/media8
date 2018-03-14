import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor (db: AngularFirestore){
    console.log("Opened")
  }

  //ADMIN PAGE
  login(){
    console.log("Login to firebase auth")
  }
}
