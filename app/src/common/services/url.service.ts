
export class Url {
  static $inject = ['$window', 'FIREBASE_CONFIG'];

  constructor(private $window, FIREBASE_CONFIG) {
    this.$window.gapi.client.setApiKey(FIREBASE_CONFIG.apiKey);
  }

  gerarShortUrl(longUrl) {
    return this.$window.gapi.client.load('urlshortener', 'v1').then(() => {
      return this.$window.gapi.client.urlshortener.url.insert({resource: {longUrl}});
    });
  }
}
