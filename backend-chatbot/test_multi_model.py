import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# API endpoint
API_URL = "http://localhost:8000/chat"

def test_chat_api():
    """
    Test the chat API with a simple query
    """
    print("Testing chat API...")
    
    # Test data
    test_data = {
        "message": "What are the best places to visit in India?",
        "chat_history": []
    }
    
    # Send request
    try:
        response = requests.post(API_URL, json=test_data)
        response.raise_for_status()
        
        # Parse response
        data = response.json()
        
        # Print results
        print("\nAPI Response:")
        print(f"Status Code: {response.status_code}")
        print(f"Model Used: {data.get('model_used', 'Unknown')}")
        print(f"Response: {data.get('response', 'No response')[:100]}...")
        
        return True
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

def test_health_endpoint():
    """
    Test the health endpoint
    """
    print("\nTesting health endpoint...")
    
    # Send request
    try:
        response = requests.get("http://localhost:8000/health")
        response.raise_for_status()
        
        # Parse response
        data = response.json()
        
        # Print results
        print("\nHealth Response:")
        print(f"Status Code: {response.status_code}")
        print(f"Status: {data.get('status', 'Unknown')}")
        print("Models:")
        for model_id, model_info in data.get('models', {}).items():
            print(f"  - {model_id}: {model_info.get('name')} (Enabled: {model_info.get('enabled')})")
        
        return True
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

if __name__ == "__main__":
    print("=== Multi-Model API Test ===\n")
    
    # Test health endpoint
    health_success = test_health_endpoint()
    
    # Test chat API
    chat_success = test_chat_api()
    
    # Print summary
    print("\n=== Test Summary ===")
    print(f"Health Endpoint: {'✅ Passed' if health_success else '❌ Failed'}")
    print(f"Chat API: {'✅ Passed' if chat_success else '❌ Failed'}")
