export class Network {
  id: any;
  networkName: string;
  networkBio: string;
  networkProfilePicture: any;
  networkFB: string;
  networkTwitter: string;
  networkYoutube: string;
  networkItunes: string;
  networkSpotify: string;
  dateJoined: string;


  constructor(networkName: string, networkBio: string,
    networkProfilePicture: string,
    networkFB: string, networkTwitter: string,
    networkYoutube: string, networkItunes: string,
    networkSpotify: string){
      this.networkName = networkName;
      this.networkBio = networkBio;
      this.networkProfilePicture = networkProfilePicture;
      this.networkFB = networkFB;
      this.networkTwitter = networkTwitter;
      this.networkYoutube = networkYoutube;
      this.networkItunes = networkItunes;
      this.networkSpotify = networkSpotify;
      this.id="start"

      var date = new Date()
      console.log(date)

      this.dateJoined = date.toString();
      console.log("Network Object created!")

  }

  printNetwork(){
    return "Name: " + this.networkName + " Bio: " + this.networkBio + " networkProfilePicture: " + this.networkProfilePicture + " FB: " + this.networkFB + " Twitter: " + this.networkTwitter + " Youtube: " + this.networkYoutube + " Itunes: " + this.networkItunes + " Spotify: " + this.networkSpotify;
  }

  getData(): object {
        const result = {};
        Object.keys(this).map(key => result[key] = this[key]);
        return result;
  }
}
