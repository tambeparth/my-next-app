# Yatra Sevak.AI Backend

This is the FastAPI backend for the Yatra Sevak.AI travel chatbot.

## Setup

1. Install the required dependencies:

```bash
pip install -r requirements.txt
```

2. Create a `.env` file with your Hugging Face API token:

```
HUGGINGFACEHUB_API_TOKEN=your_huggingface_token_here
```

You can get an API token from [Hugging Face](https://huggingface.co/settings/tokens).

## Running the Backend

To run the backend server:

```bash
uvicorn main:app --reload
```

This will start the server at http://localhost:8000.

## API Endpoints

- `POST /chat`: Main endpoint for chatbot interactions
- `GET /health`: Health check endpoint
- `GET /`: Root endpoint with API information
- `GET /docs`: Interactive API documentation (Swagger UI)
- `POST /config/model`: Configure which model to use (primary or fallback)

## Model Configuration

The backend supports multiple models, prioritizing dynamic API responses:

1. **Primary Model**: `mistralai/Mixtral-8x7B-Instruct-v0.1` (requires PRO subscription)
2. **Default Fallback Model**: `facebook/opt-1.3b` (free tier, good quality)
3. **Additional Fallback Models** (all free tier, in order of preference):
   - `facebook/opt-350m` (smaller but still good quality)
   - `google/flan-t5-base` (good for instruction following)
   - `microsoft/DialoGPT-medium` (good for conversational responses)
   - `gpt2` (original GPT-2 model)
   - `EleutherAI/gpt-neo-125m` (small but decent quality)
   - `distilgpt2` (very small but fast)

You can switch between models using the provided batch files:

```bash
# Main models
use_primary_model.bat     # Switch to the primary model (requires PRO subscription)
use_fallback_model.bat    # Switch to the default fallback model (facebook/opt-1.3b)

# Alternative models (ordered by quality)
use_opt_1.3b.bat          # Switch to facebook/opt-1.3b (default fallback)
use_opt_350m.bat          # Switch to facebook/opt-350m
use_flan_t5_base.bat      # Switch to google/flan-t5-base
use_dialogpt.bat          # Switch to microsoft/DialoGPT-medium
use_gpt2.bat              # Switch to gpt2
use_gpt_neo.bat           # Switch to EleutherAI/gpt-neo-125m
use_distilgpt2.bat        # Switch to distilgpt2
```

Or directly using Python:

```bash
# Main models
python switch_model.py primary
python switch_model.py fallback

# Specific models
python switch_model.py facebook/opt-1.3b
python switch_model.py facebook/opt-350m
python switch_model.py google/flan-t5-base
python switch_model.py microsoft/DialoGPT-medium
python switch_model.py gpt2
python switch_model.py EleutherAI/gpt-neo-125m
python switch_model.py distilgpt2

# You can also try other Hugging Face models
python switch_model.py organization/model-name
```

### Dynamic Model Selection and Fallback

The system prioritizes dynamic API responses through several mechanisms:

1. **Optimized Parameters**: Each model uses custom parameters optimized for its architecture
2. **Automatic Fallback Chain**: If one model fails, the system automatically tries others in order of preference
3. **Last Resort Fallback**: Only if all API models fail will the system use rule-based responses

This ensures you get the best possible dynamic responses from the API models.

## Request Format

```json
{
  "message": "Your message here",
  "chat_history": [
    {
      "text": "Previous message",
      "sender": "user"
    },
    {
      "text": "Previous response",
      "sender": "ai"
    }
  ]
}
```

## Response Format

```json
{
  "response": "AI response text",
  "model_used": "google/flan-t5-large"
}
```

The `model_used` field indicates which model was used to generate the response.
