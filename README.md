# Voyage

## Overview
Voyage is an AI-powered web application that helps users create personalized travel itineraries based on their preferences, such as destination, budget, number of days, food preferences, and mood. The app leverages the Gemini API to generate detailed itineraries, hotel recommendations, and tourist attractions, which are displayed in a user-friendly interface with support for text-to-speech functionality for accessibility.

## Features
- **Personalized Itineraries**: Generate travel plans tailored to user inputs like destination, budget, and preferences.
- **Hotel & Attraction Recommendations**: Display hotels and attractions with names, booking links (placeholder), and images (placeholder).
- **Text-to-Speech**: Listen to itineraries with adjustable voice, language, and speed settings.
- **Secure Authentication**: User sign-in via Clerk for a seamless and secure experience.
- **Responsive Design**: Optimized for both desktop and mobile devices using Tailwind CSS.

## Tech Stack
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Authentication**: Clerk
- **AI Integration**: Gemini API
- **Accessibility**: Web Speech API (for text-to-speech)
- **Styling**: Tailwind CSS 

## Setup Instructions
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Anu0517/Voyage.git
   cd Voyage
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Set Up Environment Variables**:
   Create a `.env.local` file in the root directory and add the following:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
   CLERK_SECRET_KEY=your-clerk-secret-key
   GEMINI_API_KEY=your-gemini-api-key
   ```
   - Obtain Clerk keys from [Clerk Dashboard](https://clerk.com/).
   - Obtain the Gemini API key from your Gemini API provider.
4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser to view the app.

## Usage
1. Sign in using Clerk authentication.
2. Fill out the form with your travel preferences (e.g., destination, days, budget, food preferences, mood).
3. Click "Generate Itinerary" to fetch a personalized travel plan from the Gemini API.
4. View the itinerary, hotel recommendations, and attractions.
5. Use the text-to-speech feature to listen to the itinerary with customizable voice settings.

## APIs Used
- **Gemini API**: Generates travel itineraries, hotel recommendations, and attractions.
- **Clerk API**: Manages user authentication and sessions.
- **Web Speech API**: Enables text-to-speech functionality for accessibility.

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit them (`git commit -m "Add your feature"`).
4. Push to your branch (`git push origin feature/your-feature`).
5. Open a pull request with a description of your changes.
