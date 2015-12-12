
export class Url {
  static $inject = ['$window', 'GOOGLE_API_KEY'];

  constructor(private $window, GOOGLE_API_KEY) {
    this.$window.gapi.client.setApiKey(GOOGLE_API_KEY);
  }

  gerarShortUrl(longUrl) {
    return this.$window.gapi.client.load('urlshortener', 'v1').then(() => {
      return this.$window.gapi.client.urlshortener.url.insert({resource: {longUrl}});
    });
  }
}
