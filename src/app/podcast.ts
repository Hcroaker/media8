export class Podcast {
  id?: string;
  networkID: string;
  season: number;
  episode: number;
  title: string;
  description: string;
  notes: string;
  category: string;
  linkType: string;
  linkValue: string;
  uploadDate: string;
  views: number;

  constructor(id: string, networkID: string, season: number, episode: number, title: string,
    description: string, notes: string, category: string, linkType: string, linkValue: string){
      this.id = id;
      this.networkID = networkID;
      this.season = season;
      this.episode = episode;
      this.title = title;
      this.description = description;
      this.notes = notes;
      this.category = category;
      this.linkType  = linkType;
      this.linkValue = linkValue;

      var date = new Date()
      var formatted = date.toLocaleString('en-GB', { timeZone: 'UTC' })
      this.uploadDate = formatted.split(",")[0];

      this.views = 0;

      console.log("Podcast Created")
  }

  printPodcast(){
    console.log("Podcast is: " + "PID: " + this.id + " NID: " + this.networkID + " Season: " + this.season + " Episode: " +
    this.episode + " Title: " + this.title + " Description: " + this.description + " Notes: " + this.notes +
    " Category: " + this.category + " LinkType: " + this.linkType + " LinkValue: " + this.linkValue + " Upload Date: " + this.uploadDate + " Views: " + this.views)
  }

  getData(): object {
        const result = {};
        Object.keys(this).map(key => result[key] = this[key]);
        return result;
  }
}
