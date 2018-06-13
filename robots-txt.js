// https://github.com/itgalaxy/generate-robotstxt
module.exports = {
  policy: [
    {
      userAgent: '*',
      allow: '/',
      disallow: ['/lists/search', '/search', '/anonymous'],
      crawlDelay: 1
    }
  ],
  host: 'http://www.hackforplay.xyz'
};
