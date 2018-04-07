export class Season {
  season: number;
  epCount: number;

  constructor(season: number, episode: number){
    this.season = season;
    this.epCount = episode;
  }

  increaseEpCount(){
    this.epCount = this.epCount + 1;
  }
}
