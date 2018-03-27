export class Season {
  season: number;
  epCount: number;

  constructor(season: number){
    this.season = season;
    this.epCount = 1;
  }

  increaseEpCount(){
    this.epCount = this.epCount + 1;
  }
}
