import os
from dotenv import load_dotenv
import google.generativeai as genai
import re
import time

# Load environment variables from .env file
load_dotenv()

# Configure the Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("Please set the GEMINI_API_KEY environment variable in a .env file")

genai.configure(api_key=GEMINI_API_KEY)

# System prompt for the trip itinerary chatbot
SYSTEM_PROMPT = """You are a helpful travel planning assistant that creates detailed trip itineraries.
Your goal is to create personalized travel plans based on user preferences.
When creating itineraries, include:
- Day-by-day breakdown of activities
- Recommended accommodations
- Food and restaurant suggestions
- Transportation options
- Estimated costs
- Local tips and insights
- Practical information like weather considerations and cultural etiquette

Only ask for one piece of information at a time. Wait for the user to respond before asking another question.
"""

def clear_screen():
    """Clear the terminal screen."""
    os.system('cls' if os.name == 'nt' else 'clear')

def get_trip_details():
    """Collect basic trip details from the user."""
    print("\n" + "="*50)
    print("🌍 WELCOME TO TRIP PLANNER AI 🌍")
    print("="*50)
    print("\nLet's plan your perfect trip! I'll need some basic details to get started.\n")
    
    # Get destination
    destination = input("Where would you like to go? (e.g., 'Paris', 'Japan', 'Costa Rica'): ")
    
    # Get trip duration
    while True:
        try:
            days = int(input("How many days will you be traveling? (e.g., 3, 7, 14): "))
            if days <= 0:
                print("Please enter a positive number.")
                continue
            break
        except ValueError:
            print("Please enter a valid number.")
    
    # Get number of travelers
    while True:
        try:
            people = int(input("How many people are traveling? (e.g., 1, 2, 4): "))
            if people <= 0:
                print("Please enter a positive number.")
                continue
            break
        except ValueError:
            print("Please enter a valid number.")
    
    # Get budget level
    while True:
        budget = input("What's your budget level? (budget/mid-range/luxury): ").lower()
        if budget in ['budget', 'mid-range', 'luxury']:
            break
        print("Please enter 'budget', 'mid-range', or 'luxury'.")
    
    # Get interests (optional)
    interests = input("What are your interests? (e.g., 'history, food, hiking', or press Enter to skip): ")
    
    # Return collected trip details
    return {
        "destination": destination,
        "days": days,
        "people": people,
        "budget": budget,
        "interests": interests
    }

def create_initial_prompt(trip_details):
    """Create a detailed initial prompt based on the trip details."""
    prompt = f"I am a travel planning assistant. Please create a detailed {trip_details['days']}-day itinerary for {trip_details['people']} "
    prompt += f"people visiting {trip_details['destination']} with a {trip_details['budget']} budget."
    
    if trip_details['interests']:
        prompt += f" Their interests include: {trip_details['interests']}."
    
    prompt += """
    
Please include:
1. Day-by-day breakdown with activities and attractions
2. Recommended accommodations
3. Food and restaurant suggestions for each day
4. Transportation options within the destination
5. Estimated costs for activities, food, and accommodations
6. Any local tips or cultural insights

Format the itinerary in a well-structured, easy-to-read format with clear headings for each day.
"""
    return prompt

def generate_response(model, user_input):
    """Generate a response from the Gemini model."""
    try:
        # Send message and get response
        response = model.generate_content(user_input)
        # Extract text from the response
        if hasattr(response, 'text'):
            return response.text
        elif hasattr(response, 'parts'):
            return response.parts[0].text
        else:
            # Try to convert response to string as fallback
            return str(response)
    
    except Exception as e:
        print(f"Error details: {str(e)}")
        return f"Sorry, I encountered an error: {str(e)}"

def format_itinerary(text):
    """Format the itinerary text with some simple styling."""
    # Add some formatting for days
    text = re.sub(r'(Day \d+:)', r'\n\033[1m\033[94m\1\033[0m', text)
    
    # Add some formatting for section headers
    text = re.sub(r'([A-Za-z]+ & [A-Za-z]+:|[A-Za-z]+ Options:|[A-Za-z]+:)', r'\033[1m\1\033[0m', text)
    
    return text

def typing_effect(text):
    """Display text with a typing effect."""
    for char in text:
        print(char, end='', flush=True)
        time.sleep(0.001)  # Adjust typing speed here (faster)
    print()

def run_chatbot():
    """Run the trip itinerary chatbot."""
    
    # Create a model
    model = genai.GenerativeModel('gemini-1.5-pro')
    
    clear_screen()
    trip_details = get_trip_details()
    
    # Create initial prompt and generate itinerary
    clear_screen()
    print("\n🔄 Generating your personalized travel itinerary...\n")
    initial_prompt = create_initial_prompt(trip_details)
    
    try:
        itinerary = generate_response(model, initial_prompt)
        
        # Verify we have content
        if not itinerary or len(itinerary.strip()) < 10:
            print("Error: Received empty or very short response from Gemini.")
            print("Response received:", itinerary)
            return
            
        clear_screen()
        print("\n✅ Your itinerary is ready!\n")
        typing_effect(format_itinerary(itinerary))
        
        print("\n" + "="*50)
        print("💬 You can now chat with me to refine your itinerary.")
        print("Type 'exit' to quit, 'new' to start a new itinerary.")
        print("="*50 + "\n")
        
        # Start the chat loop
        conversation_context = f"{SYSTEM_PROMPT}\n\nI've created the following itinerary:\n\n{itinerary}\n\n"
        
        while True:
            user_input = input("You: ")
            
            if user_input.lower() == 'exit':
                print("\nThank you for using Trip Planner AI! Safe travels! 🧳✈️")
                break
            
            if user_input.lower() == 'new':
                # Start a new session by calling run_chatbot again
                run_chatbot()
                return
            
            print("\n🔄 Thinking...")
            
            # Update conversation context
            conversation_context += f"User: {user_input}\nAssistant: "
            
            try:
                response = generate_response(model, conversation_context + user_input)
                # Update conversation context with the response
                conversation_context += f"{response}\n\n"
                
                print("\nTrip Planner AI:")
                typing_effect(format_itinerary(response))
                print()
                
                # Keep context from growing too large
                if len(conversation_context) > 10000:  # Arbitrary limit to prevent context overflow
                    # Keep system prompt, itinerary, and the last few exchanges
                    conversation_context = f"{SYSTEM_PROMPT}\n\nI've created the following itinerary:\n\n{itinerary}\n\n"
                    conversation_context += "\n".join(conversation_context.split("\n")[-500:])
            
            except Exception as e:
                print(f"\nTrip Planner AI: Sorry, I encountered an error: {str(e)}")
    
    except Exception as e:
        print(f"Error generating itinerary: {str(e)}")

if __name__ == "__main__":
    try:
        run_chatbot()
    except KeyboardInterrupt:
        print("\n\nThank you for using Trip Planner AI! Safe travels! 🧳✈️")