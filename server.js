// Comments in this file are for perspective clients and employers to demonstrate my understanding of the code and help the reader understand my thought process.
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const natural = require('natural');
const Sentiment = require('sentiment'); 
const cors = require('cors');
const helmet = require('helmet'); 
const app = express();
const port = process.env.PORT || 5000;

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://vercel.live"],
      // Add other directives as needed
    },
  },
}));

// Middleware to parse incoming requests. i.e. JSON data/bodies
app.use(bodyParser.json());

// Conditionally apply CORS middleware based on environment
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://ai-showcase-server.vercel.app/");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
} else {
  app.use(cors());
}
// Handle root URL
app.get('/', (req, res) => {
  res.send('Welcome to the AI Showcase Server');
});
// Example route for NLP sentiment analysis (original)
app.post('/analyze-sentiment', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).send('No text provided');
  }

  // Using the natural package for basic sentiment analysis
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(text);

  // Optional: Using a simple sentiment analyzer (this can be made more advanced)
  const sentimentAnalyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
  const sentiment = sentimentAnalyzer.getSentiment(tokens);

  // Respond with the sentiment score
  res.json({ sentiment });
});

// New POST route for sentiment analysis using the 'sentiment' package (simpler and more efficient)
app.post('/sentiment', (req, res) => {
  const sentiment = new Sentiment();
  const { text } = req.body; // Extract the text to be analyzed from the request body

  if (!text) {
    return res.status(400).json({ error: 'No text provided for sentiment analysis' });
  }

  // Analyze the sentiment of the text and return the score
  const result = sentiment.analyze(text);
  
  // Respond with sentiment score and comparative score (to explain the sentiment strength)
  res.json({ 
    score: result.score, // Total sentiment score
    comparative: result.comparative, // Comparative sentiment score based on sentence length
    explanation: 'Score represents the positivity or negativity of the text. Comparative is adjusted for the length of the text.'
  });
});

// Start the server and listen for requests
app.listen(port, () => {
  console.log(`ai-showcase server running on port ${port}`);
});
