import { Podcast } from './classes/podcast';

export class SeasonStorage {
  podcasts: Array<Podcast>;
  seasonNum: number;

  constructor(seasonNum:number, podcast: Podcast){
    this.seasonNum = seasonNum
    this.podcasts = [podcast]
  }

  addPodcast(podcast: Podcast){
    this.podcasts.push(podcast);
    console.log("Appended")
  }
}
