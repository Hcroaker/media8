import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';


import { AppComponent } from './app.component';
import { NetworkService } from './network.service';
import { PodcastService } from './podcast.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoSanitizePipe } from './no-sanitize.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NoSanitizePipe
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule,
    FormsModule
  ],
  providers: [
    NetworkService,
    PodcastService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(public afAuth: AngularFireAuthModule){
    console.log("Website started")
  }

}
