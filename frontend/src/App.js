import React, { useState, useCallback } from 'react'; // Added useCallback
import './App.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Use environment variable for API URL, fallback to localhost
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/analyze';

  const handleInputChange = (event) => {
    setInputText(event.target.value);
    // Clear previous result and error when user types new input
    if (result || error) {
        setResult(null);
        setError('');
    }
  };

  // useCallback to memoize the function if needed, though not critical here
  const analyzeSentiment = useCallback(async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to analyze.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null); // Clear previous results

    try {
      console.log(`Sending request to: ${apiUrl}`); // Log API URL
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      // Check if the response is ok (status code 200-299)
      if (!response.ok) {
        let errorData = { error: `HTTP error! Status: ${response.status}` }; // Default error
        try {
            // Try to parse error message from backend if available JSON
            const backendError = await response.json();
            if (backendError && backendError.error) {
                 errorData.error = backendError.error;
            }
        } catch (parseError) {
            // If response is not JSON or empty, use the default HTTP error
             console.warn("Could not parse error response as JSON:", parseError);
        }
        throw new Error(errorData.error);
      }

      const data = await response.json();
      setResult(data); // Store the entire result object

    } catch (error) {
      console.error('Analysis error:', error);
      setError(`Failed to analyze sentiment. ${error.message}. Check if the backend is running at ${apiUrl.replace('/analyze', '')}.`);
      setResult(null); // Clear result on error
    } finally {
      setIsLoading(false); // Stop loading indicator regardless of success/failure
    }
  }, [inputText, apiUrl]); // Add apiUrl to dependency array

  // Helper to format the score
  const formatScore = (score) => {
      return score !== undefined && score !== null ? score.toFixed(4) : 'N/A';
  }

  return (
    <div className="App">
      <h1>Sentiment Analysis AI</h1>
      <textarea
        value={inputText}
        onChange={handleInputChange}
        placeholder="Enter text here to analyze its sentiment..."
        rows={5} // Use rows attribute for default size
        aria-label="Text input for sentiment analysis" // Accessibility
      />
      <button onClick={analyzeSentiment} disabled={isLoading || !inputText.trim()}>
        {isLoading ? 'Analyzing...' : 'Analyze Sentiment'}
      </button>

      {error && <p className="error" role="alert">{error}</p>}

      {isLoading && <p className="loading">Loading results...</p>}

      {result && !isLoading && (
        <div className="result">
          <h2>Analysis Result:</h2>
          <p>
            Overall Sentiment: <span className={`label ${result.sentiment}`}>{result.sentiment.toUpperCase()}</span>
          </p>
          <p>Compound Score: {formatScore(result.score)}</p>
          {/* Optional: Display detailed scores */}
          {/*
          <h3>Detailed Scores:</h3>
          <p>Positive: {formatScore(result.scores?.pos)}</p>
          <p>Neutral: {formatScore(result.scores?.neu)}</p>
          <p>Negative: {formatScore(result.scores?.neg)}</p>
          */}
        </div>
      )}
    </div>
  );
}

export default App;
