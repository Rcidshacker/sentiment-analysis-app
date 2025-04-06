# backend/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import nltk
import os # Added for NLTK data path check

# Initialize Flask app
app = Flask(__name__)
# Enable CORS for all routes and origins (adjust in production)
CORS(app)

# --- NLTK Data Check ---
# Ensure VADER lexicon is downloaded. Sometimes nltk.download needs help finding the path.
# You might need to adjust NLTK_DATA environment variable if it still fails.
try:
    print("Checking for VADER lexicon...")
    analyzer_test = SentimentIntensityAnalyzer()
    print("VADER lexicon found.")
except LookupError:
    print("VADER lexicon not found or NLTK_DATA path issue. Attempting download again...")
    try:
        nltk.download('vader_lexicon')
        analyzer_test = SentimentIntensityAnalyzer() # Try initializing again after download
        print("VADER lexicon downloaded successfully.")
    except Exception as download_err:
        print(f"FATAL: Failed to download/locate VADER lexicon: {download_err}")
        print("Please ensure you have write permissions and internet access.")
        print("You might need to manually run: python -m nltk.downloader vader_lexicon")
        # Or set the NLTK_DATA environment variable
        exit(1) # Exit if VADER can't be loaded, as the app won't work

# Initialize VADER sentiment analyzer (now we assume it loaded successfully)
analyzer = SentimentIntensityAnalyzer()
print("SentimentIntensityAnalyzer initialized successfully.")


@app.route('/analyze', methods=['POST'])
def analyze_sentiment():
    """
    Analyzes the sentiment of the text provided in the request body.
    Expects JSON input: {"text": "some text to analyze"}
    Returns JSON output: {"sentiment": "positive/negative/neutral", "score": compound_score}
    """
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"error": "Missing 'text' key in request body"}), 400

        text_to_analyze = data['text']
        if not isinstance(text_to_analyze, str) or not text_to_analyze.strip():
             return jsonify({"error": "Text must be a non-empty string"}), 400

        # Perform sentiment analysis
        vs = analyzer.polarity_scores(text_to_analyze)

        # Determine sentiment label based on compound score
        compound_score = vs['compound']
        sentiment_label = "neutral" # Default
        if compound_score >= 0.05:
            sentiment_label = "positive"
        elif compound_score <= -0.05:
            sentiment_label = "negative"

        print(f"Analyzed: '{text_to_analyze[:50]}...' -> Score: {compound_score}, Sentiment: {sentiment_label}") # Server log

        # Return results
        return jsonify({
            "sentiment": sentiment_label,
            "score": compound_score,
            "scores": vs # Optionally return all scores (pos, neg, neu, compound)
        })

    except Exception as e:
        print(f"Error during analysis: {e}") # Log the error
        return jsonify({"error": "An internal server error occurred"}), 500

# Health check route
@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "Backend is running!"})

if __name__ == '__main__':
    print("Starting Flask server...")
    # Use host='0.0.0.0' to make it accessible on your network if needed
    # Port 5000 is the default Flask port
    app.run(debug=True, port=5000, host='0.0.0.0')

