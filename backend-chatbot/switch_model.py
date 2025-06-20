import requests
import sys
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Default API URL
API_URL = os.getenv("NEXT_PUBLIC_API_URL", "http://localhost:8000")

def switch_model(model_name):
    """
    Switch the active model in the FastAPI backend.

    Args:
        model_name (str): "primary", "fallback", or a specific model name
    """
    # These are valid shortcuts
    valid_shortcuts = ["primary", "fallback"]

    # Allow any model name that contains a slash (organization/model format)
    if model_name not in valid_shortcuts and "/" not in model_name:
        print(f"Warning: '{model_name}' is not a standard model shortcut. Valid shortcuts are: {', '.join(valid_shortcuts)}")
        print("Proceeding anyway as it might be a valid alternative model name...")
        print("For custom models, use the format 'organization/model-name'")
        # Continue anyway, the server will validate

    try:
        response = requests.post(
            f"{API_URL}/config/model",
            json={"model_name": model_name}
        )

        if response.status_code == 200:
            data = response.json()
            print(f"Success: {data['message']}")
            print(f"Current model: {data['current_model']}")
            return True
        else:
            print(f"Error: Failed to switch model. Status code: {response.status_code}")
            print(response.text)
            return False

    except Exception as e:
        print(f"Error: {str(e)}")
        return False

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python switch_model.py [primary|fallback]")
        sys.exit(1)

    model_name = sys.argv[1].lower()
    success = switch_model(model_name)
    sys.exit(0 if success else 1)
