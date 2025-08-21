# Product Authenticity Analyzer

This project is a web service that analyzes product information, including reviews, product links, and images, to generate a "Falsity Score" and determine the likelihood of the information being fake or manipulated. It uses the Google Gemini 1.5 Flash model for the analysis.

## Features

- Analyzes user-submitted text reviews.
- Analyzes a link to the product page.
- Analyzes a user-submitted product image.
- Provides a "Falsity Score" as a percentage.
- Returns the analysis in both English and Korean.

## How It Works

The application runs an Express.js server that exposes a single API endpoint: `/analyze`. When a POST request is sent to this endpoint with product data, the server forwards this data to the Google Gemini API for analysis and returns the processed result.

## API

### `POST /analyze`

This endpoint accepts a JSON object containing the product information to be analyzed.

**Request Body:**

```json
{
  "reviews": "Optional: A string containing product reviews.",
  "productLink": "Optional: A string containing the URL to the product.",
  "imageData": "Optional: A Base64 encoded string of the product image."
}
```

**Success Response (200 OK):**

```json
{
  "text": "The detailed analysis in English and Korean...",
  "score": "A 'Falsity-Score' percentage (e.g., '25%') or 'N/A'."
}
```

**Error Response (500 Internal Server Error):**

```json
{
  "error": "An error occurred during analysis."
}
```

## Setup and Installation

Follow these steps to run the project locally.

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <your-project-directory>
```

### 2. Install Dependencies

Install the required Node.js packages using npm.

```bash
npm install
```

### 3. Set Up Environment Variables

This project requires a Google Gemini API key to function.

1.  Create a new file named `.env` in the root of the project directory.
2.  Open the `.env` file and add your API key in the following format:

    ```
    GEMINI_API_KEY=YOUR_GOOGLE_GEMINI_API_KEY
    ```

**Important:** The `.env` file contains your secret keys and should **never** be committed to GitHub. The included `.gitignore` file is already configured to prevent this.

### 4. Run the Server

Start the Express server with the following command:

```bash
node server.js
```

The server will start and listen on `http://localhost:3000`.
