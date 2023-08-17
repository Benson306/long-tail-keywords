const axios = require('axios');
const natural = require('natural');
const { TfIdf } = natural;

// Define the target keyword
const targetKeyword = 'seo';

// Define the URL to scrape
const url = 'https://blog.hubspot.com/marketing/seo';

// Fetch the data using axios
axios.get(url)
  .then(response => {
    const scrapedData = response.data;

    // Initialize TF-IDF instance
    const tfidf = new TfIdf();

    // Add documents (text) to the TF-IDF instance
    tfidf.addDocument(scrapedData);

    let tokenizer = new natural.WordTokenizer();
    // Tokenize the target keyword
    
    let targetKeywordTokens = tokenizer.tokenize(targetKeyword);
    
    // Calculate TF-IDF for the target keyword
    const keywordScores = {};
    targetKeywordTokens.forEach(token => {
      tfidf.tfidfs(token, (i, measure) => {
        if (!keywordScores[token]) {
          keywordScores[token] = 0;
        }
        keywordScores[token] += measure;
      });
    });

    // Sort keywords by TF-IDF score
    const sortedKeywords = Object.keys(keywordScores).sort((a, b) => keywordScores[b] - keywordScores[a]);

    // Extract long-tail keywords (e.g., top 10)
    const longTailKeywords = sortedKeywords.slice(0, 10);

    console.log('Long-tail keywords:', longTailKeywords);
  })
  .catch(error => {
    console.error('Error scraping data:', error);
  });
