export class Podcast {
  podcastID: string;
  networkID: string;
  season: number;
  episode: number;
  title: string;
  description: string;
  notes: string;
  category: string;
  link: string;
  uploadDate: string;
  views: number;

  constructor(podcastID: string, networkID: string, season: number, episode: number, title: string,
    description: string, notes: string, category: string, link: string){
      this.podcastID = podcastID;
      this.networkID = networkID;
      this.season = season;
      this.episode = episode;
      this.title = title;
      this.description = description;
      this.notes = notes;
      this.category = category;
      this.link  = link;

      var date = new Date()
      var formatted = date.toLocaleString('en-GB', { timeZone: 'UTC' })
      this.uploadDate = formatted.split(",")[0];

      this.views = 0;
  }

  printPodcast(){
    console.log("Podcast is: " + "PID: " + this.podcastID + " NID: " + this.networkID + " Season: " + this.season + " Episode: " +
    this.episode + " Title: " + this.title + " Description: " + this.description + " Notes: " + this.notes +
    " Category: " + this.category + " Link: " + this.link + " Upload Date: " + this.uploadDate + " Views: " + this.views)
  }
}
