from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
from dotenv import load_dotenv
import requests
import time
import asyncio
import concurrent.futures
import json
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("yatra-sevak")

# Load environment variables
load_dotenv()

app = FastAPI(title="Yatra Sevak.AI API", description="Travel chatbot API using multiple AI models")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get API tokens
hf_api_token = os.getenv("HUGGINGFACEHUB_API_TOKEN")
if not hf_api_token:
    print("WARNING: HUGGINGFACEHUB_API_TOKEN not found in environment variables")

groq_api_key = os.getenv("GROQ_API_KEY")
if not groq_api_key:
    print("WARNING: GROQ_API_KEY not found in environment variables. Groq fallback will not be available.")

# Hugging Face Model configuration
HF_MODEL_NAME = "mistralai/Mixtral-8x7B-Instruct-v0.1"
HF_API_URL = f"https://api-inference.huggingface.co/models/{HF_MODEL_NAME}"
HF_HEADERS = {"Authorization": f"Bearer {hf_api_token}"}

# Groq Model configuration
GROQ_MODEL_NAME = "llama3-8b-8192"  # You can change this to any model Groq supports
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_HEADERS = {
    "Authorization": f"Bearer {groq_api_key}",
    "Content-Type": "application/json"
}

# Model configuration
MODELS = {
    "huggingface": {
        "name": HF_MODEL_NAME,
        "enabled": hf_api_token is not None,
        "priority": 1  # Lower number means higher priority
    },
    "groq": {
        "name": GROQ_MODEL_NAME,
        "enabled": groq_api_key is not None,
        "priority": 2
    }
}

# Chat templates
# Template for customize-plan mode (when coming from customize-plan page)
CUSTOMIZE_TEMPLATE = """<s>[INST] You are a helpful travel assistant named Smart.AI Travel.
Provide comprehensive, detailed travel information for: {user_input}.
Focus on flights, hotels, destinations, and travel tips.

CRITICAL INSTRUCTION: For any destination mentioned, you MUST FIRST thoroughly check if there are any recent (within the past 5-7 days) disasters, floods, attacks, political unrest, health emergencies, or other crisis situations that might affect travel safety.

Format the crisis information as follows:
⚠️ CRISIS ALERT ⚠️
[List any current crisis situations with detailed information about:
1. The exact nature of the crisis
2. When it started and current status
3. Affected areas within the destination
4. Severity level
5. Safety recommendations
6. Impact on travel infrastructure (airports, hotels, transportation)]

If a crisis exists:
- ONLY provide the crisis information and DO NOT continue with regular travel planning
- Clearly explain why travel to this destination is not recommended at this time
- Suggest alternative destinations if appropriate

If no current crisis situations exist, explicitly state "No current crisis situations reported in this area" and then continue with regular travel information.

This crisis information MUST appear at the beginning of your response, before any other travel information.

After addressing any crisis situations (or confirming there are none), provide a comprehensive, detailed response to the user's query with the following information:

1. DESTINATION OVERVIEW (if applicable):
   - Brief history and cultural significance
   - Best times to visit with seasonal considerations
   - Local customs and etiquette travelers should know
   - Language considerations and useful phrases

2. ACCOMMODATION OPTIONS (if applicable):
   - Range of options from luxury to budget
   - Recommended neighborhoods to stay in
   - Typical amenities and price ranges
   - Special accommodation types unique to the region

3. TRANSPORTATION DETAILS (if applicable):
   - Getting to the destination (flight routes, train options)
   - Getting around locally (public transit, car rentals, etc.)
   - Transportation passes or money-saving options
   - Accessibility considerations

4. ACTIVITIES AND ATTRACTIONS (if applicable):
   - Must-see attractions with visiting tips
   - Off-the-beaten-path experiences
   - Cultural events or seasonal activities
   - Family-friendly options if relevant

5. PRACTICAL TRAVEL TIPS:
   - Budget considerations and currency information
   - Safety tips specific to the destination
   - Packing recommendations
   - Visa and entry requirements
   - Local food specialties to try

Provide a thorough, well-organized response that gives the user comprehensive information while being easy to read. Use appropriate formatting to make your response scannable. [/INST]"""

# Template for regular mode (when accessing chatbot directly)
REGULAR_TEMPLATE = """<s>[INST] You are a helpful travel assistant named Smart.AI Travel.
Provide comprehensive, detailed travel information for: {user_input}.
Focus on flights, hotels, destinations, and travel tips.

CRITICAL INSTRUCTION: For any destination mentioned, you MUST FIRST thoroughly check if there are any recent (within the past 5-7 days) disasters, floods, attacks, political unrest, health emergencies, or other crisis situations that might affect travel safety.

Format the crisis information as follows:
⚠️ CRISIS ALERT ⚠️
[List any current crisis situations with detailed information about:
1. The exact nature of the crisis
2. When it started and current status
3. Affected areas within the destination
4. Severity level
5. Safety recommendations
6. Impact on travel infrastructure (airports, hotels, transportation)
7. Root causes of the crisis
8. Potential timeline for resolution if known]

If a crisis exists:
- ONLY provide the crisis information and DO NOT continue with regular travel planning
- Clearly explain why travel to this destination is not recommended at this time
- Suggest alternative destinations if appropriate

If no current crisis situations exist, explicitly state "No current crisis situations reported in this area" and then continue with regular travel information.

This crisis information MUST appear at the beginning of your response, before any other travel information.

After addressing any crisis situations (or confirming there are none), provide a comprehensive, detailed response to the user's query with the following information where relevant:

1. DESTINATION OVERVIEW (if applicable):
   - Brief history and cultural significance
   - Best times to visit with seasonal considerations
   - Local customs and etiquette travelers should know
   - Language considerations and useful phrases
   - Current local events or festivals

2. ACCOMMODATION OPTIONS (if applicable):
   - Range of options from luxury to budget
   - Recommended neighborhoods to stay in
   - Typical amenities and price ranges
   - Special accommodation types unique to the region
   - Booking tips and peak season considerations

3. TRANSPORTATION DETAILS (if applicable):
   - Getting to the destination (flight routes, train options)
   - Getting around locally (public transit, car rentals, etc.)
   - Transportation passes or money-saving options
   - Accessibility considerations
   - Traffic or transportation quirks to be aware of

4. ACTIVITIES AND ATTRACTIONS (if applicable):
   - Must-see attractions with visiting tips
   - Off-the-beaten-path experiences
   - Cultural events or seasonal activities
   - Family-friendly options if relevant
   - Outdoor activities and natural attractions
   - Shopping and entertainment districts

5. DINING AND CUISINE (if applicable):
   - Local specialties and must-try dishes
   - Price ranges for dining options
   - Food markets and street food safety
   - Dining etiquette and tipping customs
   - Dietary restriction considerations

6. PRACTICAL TRAVEL TIPS:
   - Budget considerations and currency information
   - Safety tips specific to the destination
   - Packing recommendations based on climate and activities
   - Visa and entry requirements
   - Health considerations and medical facilities
   - Internet access and communication options
   - Local laws travelers should be aware of

Provide a thorough, well-organized response that gives the user comprehensive information while being easy to read. Use appropriate formatting to make your response scannable. Make sure your response is directly relevant to what the user asked, but provide additional helpful information they might not have thought to ask about. [/INST]"""

# Request/response models
class MessageItem(BaseModel):
    text: str
    sender: str

class ChatRequest(BaseModel):
    message: str
    chat_history: Optional[List[MessageItem]] = []
    use_groq: Optional[bool] = False  # New parameter to force using Groq

class ChatResponse(BaseModel):
    response: str
    model_used: str

    model_config = {
        "protected_namespaces": ()
    }

def query_huggingface(payload):
    """
    Query Hugging Face API with retry logic
    """
    max_retries = 3
    retry_delay = 2

    for attempt in range(max_retries):
        try:
            logger.info(f"Attempting Hugging Face API call (attempt {attempt+1}/{max_retries})...")
            response = requests.post(HF_API_URL, headers=HF_HEADERS, json=payload)

            # Check for payment required error
            if response.status_code == 402:
                logger.warning("Hugging Face API returned 402 Payment Required - subscription issue")
                return {
                    "success": False,
                    "error": "Hugging Face API subscription required for this model",
                    "model": "huggingface",
                    "model_name": HF_MODEL_NAME,
                    "status_code": 402
                }

            response.raise_for_status()
            result = response.json()
            logger.info("Hugging Face API call successful")
            return {
                "success": True,
                "response": result[0]['generated_text'].strip(),
                "model": "huggingface",
                "model_name": HF_MODEL_NAME
            }
        except requests.exceptions.HTTPError as err:
            logger.error(f"Hugging Face API HTTP error: {err}")
            if response.status_code == 503:  # Model loading
                if attempt < max_retries - 1:
                    logger.info(f"Model loading, retrying in {retry_delay} seconds...")
                    time.sleep(retry_delay)
                    retry_delay *= 2
                    continue
            if attempt == max_retries - 1:
                return {
                    "success": False,
                    "error": str(err),
                    "model": "huggingface",
                    "model_name": HF_MODEL_NAME,
                    "status_code": response.status_code
                }
            raise
        except Exception as e:
            logger.error(f"Hugging Face API error: {e}")
            if attempt < max_retries - 1:
                logger.info(f"Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
                retry_delay *= 2
                continue
            return {
                "success": False,
                "error": str(e),
                "model": "huggingface",
                "model_name": HF_MODEL_NAME
            }

    return {
        "success": False,
        "error": "Failed to get response after multiple retries",
        "model": "huggingface",
        "model_name": HF_MODEL_NAME
    }

def query_groq(prompt, is_customize=False):
    """
    Query Groq API with retry logic

    Args:
        prompt: The prompt to send to the API
        is_customize: Whether this is a customize-plan query (affects crisis detail level)
    """
    max_retries = 3
    retry_delay = 2

    # Determine which system message to use based on whether this is a customize-plan query
    system_message = """You are a helpful travel assistant named Smart.AI Travel. Provide comprehensive, detailed travel information.

CRITICAL INSTRUCTION: For any destination mentioned, you MUST FIRST thoroughly check if there are any recent (within the past 5-7 days) disasters, floods, attacks, political unrest, health emergencies, or other crisis situations that might affect travel safety.

Format the crisis information as follows:
⚠️ CRISIS ALERT ⚠️
[List any current crisis situations with detailed information about the nature, status, affected areas, severity, safety recommendations, and impact on travel]

If a crisis exists:
- ONLY provide the crisis information and DO NOT continue with regular travel planning
- Clearly explain why travel to this destination is not recommended at this time
- Suggest alternative destinations if appropriate

If no current crisis situations exist, explicitly state "No current crisis situations reported in this area" and then continue with regular travel information.

This crisis information MUST appear at the beginning of your response, before any other travel information.

After addressing any crisis situations (or confirming there are none), provide a comprehensive, detailed response to the user's query with the following information:

1. DESTINATION OVERVIEW (if applicable):
   - Brief history and cultural significance
   - Best times to visit with seasonal considerations
   - Local customs and etiquette travelers should know
   - Language considerations and useful phrases

2. ACCOMMODATION OPTIONS (if applicable):
   - Range of options from luxury to budget
   - Recommended neighborhoods to stay in
   - Typical amenities and price ranges
   - Special accommodation types unique to the region

3. TRANSPORTATION DETAILS (if applicable):
   - Getting to the destination (flight routes, train options)
   - Getting around locally (public transit, car rentals, etc.)
   - Transportation passes or money-saving options
   - Accessibility considerations

4. ACTIVITIES AND ATTRACTIONS (if applicable):
   - Must-see attractions with visiting tips
   - Off-the-beaten-path experiences
   - Cultural events or seasonal activities
   - Family-friendly options if relevant

5. PRACTICAL TRAVEL TIPS:
   - Budget considerations and currency information
   - Safety tips specific to the destination
   - Packing recommendations
   - Visa and entry requirements
   - Local food specialties to try

Provide a thorough, well-organized response that gives the user comprehensive information while being easy to read."""

    # For regular mode (not customize), add more detailed crisis information requirements
    if not is_customize:
        system_message = """You are a helpful travel assistant named Smart.AI Travel. Provide comprehensive, detailed travel information.

CRITICAL INSTRUCTION: For any destination mentioned, you MUST FIRST thoroughly check if there are any recent (within the past 5-7 days) disasters, floods, attacks, political unrest, health emergencies, or other crisis situations that might affect travel safety.

Format the crisis information as follows:
⚠️ CRISIS ALERT ⚠️
[List any current crisis situations with detailed information about:
1. The exact nature of the crisis
2. When it started and current status
3. Affected areas within the destination
4. Severity level
5. Safety recommendations
6. Impact on travel infrastructure (airports, hotels, transportation)
7. Root causes of the crisis
8. Potential timeline for resolution if known]

If a crisis exists:
- ONLY provide the crisis information and DO NOT continue with regular travel planning
- Clearly explain why travel to this destination is not recommended at this time
- Suggest alternative destinations if appropriate

If no current crisis situations exist, explicitly state "No current crisis situations reported in this area" and then continue with regular travel information.

This crisis information MUST appear at the beginning of your response, before any other travel information.

After addressing any crisis situations (or confirming there are none), provide a comprehensive, detailed response to the user's query with the following information where relevant:

1. DESTINATION OVERVIEW (if applicable):
   - Brief history and cultural significance
   - Best times to visit with seasonal considerations
   - Local customs and etiquette travelers should know
   - Language considerations and useful phrases
   - Current local events or festivals

2. ACCOMMODATION OPTIONS (if applicable):
   - Range of options from luxury to budget
   - Recommended neighborhoods to stay in
   - Typical amenities and price ranges
   - Special accommodation types unique to the region
   - Booking tips and peak season considerations

3. TRANSPORTATION DETAILS (if applicable):
   - Getting to the destination (flight routes, train options)
   - Getting around locally (public transit, car rentals, etc.)
   - Transportation passes or money-saving options
   - Accessibility considerations
   - Traffic or transportation quirks to be aware of

4. ACTIVITIES AND ATTRACTIONS (if applicable):
   - Must-see attractions with visiting tips
   - Off-the-beaten-path experiences
   - Cultural events or seasonal activities
   - Family-friendly options if relevant
   - Outdoor activities and natural attractions
   - Shopping and entertainment districts

5. DINING AND CUISINE (if applicable):
   - Local specialties and must-try dishes
   - Price ranges for dining options
   - Food markets and street food safety
   - Dining etiquette and tipping customs
   - Dietary restriction considerations

6. PRACTICAL TRAVEL TIPS:
   - Budget considerations and currency information
   - Safety tips specific to the destination
   - Packing recommendations based on climate and activities
   - Visa and entry requirements
   - Health considerations and medical facilities
   - Internet access and communication options
   - Local laws travelers should be aware of

Provide a thorough, well-organized response that gives the user comprehensive information while being easy to read. Make sure your response is directly relevant to what the user asked, but provide additional helpful information they might not have thought to ask about."""

    payload = {
        "model": GROQ_MODEL_NAME,
        "messages": [
            {"role": "system", "content": system_message},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 2000,  # Significantly increased to accommodate comprehensive responses
        "top_p": 0.9
    }

    for attempt in range(max_retries):
        try:
            logger.info(f"Attempting Groq API call (attempt {attempt+1}/{max_retries})...")
            response = requests.post(GROQ_API_URL, headers=GROQ_HEADERS, json=payload)

            # Check for auth errors
            if response.status_code in [401, 403]:
                logger.warning(f"Groq API returned {response.status_code} - authentication issue")
                return {
                    "success": False,
                    "error": f"Groq API authentication error: {response.text}",
                    "model": "groq",
                    "model_name": f"groq/{GROQ_MODEL_NAME}",
                    "status_code": response.status_code
                }

            response.raise_for_status()
            response_json = response.json()
            logger.info("Groq API call successful")
            return {
                "success": True,
                "response": response_json["choices"][0]["message"]["content"],
                "model": "groq",
                "model_name": f"groq/{GROQ_MODEL_NAME}"
            }
        except requests.exceptions.HTTPError as err:
            logger.error(f"Groq API HTTP error: {err}")
            if attempt < max_retries - 1:
                logger.info(f"Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
                retry_delay *= 2
                continue
            return {
                "success": False,
                "error": str(err),
                "model": "groq",
                "model_name": f"groq/{GROQ_MODEL_NAME}",
                "status_code": getattr(response, 'status_code', None)
            }
        except Exception as e:
            logger.error(f"Groq API error: {e}")
            if attempt < max_retries - 1:
                logger.info(f"Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
                retry_delay *= 2
                continue
            return {
                "success": False,
                "error": str(e),
                "model": "groq",
                "model_name": f"groq/{GROQ_MODEL_NAME}"
            }

    return {
        "success": False,
        "error": "Failed to get response from Groq API after multiple retries",
        "model": "groq",
        "model_name": f"groq/{GROQ_MODEL_NAME}"
    }

def query_all_models(prompt, hf_payload, is_customize=False):
    """
    Query all enabled models in parallel and return all responses

    Args:
        prompt: The prompt to send to the API
        hf_payload: The payload for the Hugging Face API
        is_customize: Whether this is a customize-plan query (affects crisis detail level)
    """
    results = []

    # Query Hugging Face if enabled
    if MODELS["huggingface"]["enabled"]:
        logger.info("Querying Hugging Face model...")
        hf_result = query_huggingface(hf_payload)
        results.append(hf_result)
        logger.info(f"Hugging Face result success: {hf_result['success']}")

    # Query Groq if enabled
    if MODELS["groq"]["enabled"]:
        logger.info("Querying Groq model...")
        groq_result = query_groq(prompt, is_customize)
        results.append(groq_result)
        logger.info(f"Groq result success: {groq_result['success']}")

    logger.info(f"Got results from {len(results)} models")
    return results

def select_best_response(results):
    """
    Select the best response from multiple model results

    Strategy:
    1. Filter for successful responses
    2. If no successful responses, return error
    3. If only one successful response, return it
    4. If multiple successful responses, select based on:
       - Priority (lower number = higher priority)

    Args:
        results: List of response results from different models
    """
    # Filter for successful responses
    successful_responses = [r for r in results if r["success"]]
    logger.info(f"Found {len(successful_responses)} successful responses out of {len(results)} total")

    # If no successful responses, return error
    if not successful_responses:
        errors = [f"{r['model_name']}: {r['error']}" for r in results]
        error_msg = f"All models failed. Errors: {'; '.join(errors)}"
        logger.error(error_msg)
        return {
            "success": False,
            "error": error_msg,
            "model": "none",
            "model_name": "none"
        }

    # If only one successful response, return it
    if len(successful_responses) == 1:
        logger.info(f"Only one successful response from {successful_responses[0]['model_name']}, using it")
        return successful_responses[0]

    # Sort by priority (defined in MODELS dictionary)
    sorted_responses = sorted(
        successful_responses,
        key=lambda r: MODELS[r["model"]]["priority"]
    )

    # For now, just return the highest priority response
    logger.info(f"Selected response from {sorted_responses[0]['model_name']} based on priority")
    return sorted_responses[0]

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        # Format the prompt with chat history
        chat_history = "\n".join(
            f"{msg.sender}: {msg.text}"
            for msg in request.chat_history
        )

        # Determine which template to use based on the request source
        # If coming from customize-plan (use_groq=True), use the customize template
        # Otherwise, use the regular template for direct chatbot access
        template_to_use = CUSTOMIZE_TEMPLATE if request.use_groq else REGULAR_TEMPLATE
        logger.info(f"Using {'customize' if request.use_groq else 'regular'} template")

        prompt = template_to_use.format(
            user_input=request.message,
            chat_history=chat_history
        )

        payload = {
            "inputs": prompt,
            "parameters": {
                "max_new_tokens": 1500,  # Significantly increased to accommodate comprehensive responses
                "temperature": 0.7,
                "top_p": 0.9,
                "do_sample": True,
                "return_full_text": False
            }
        }

        logger.info(f"Processing request: {request.message[:50]}...")

        # Check if we should use Groq specifically (for customize-plan queries)
        if request.use_groq and MODELS["groq"]["enabled"]:
            logger.info("Using Groq model specifically as requested")
            best_result = query_groq(prompt, is_customize=True)
            logger.info(f"Groq result success: {best_result['success']}")
        else:
            # Query all enabled models
            results = query_all_models(prompt, payload, is_customize=request.use_groq)

            # Select the best response
            best_result = select_best_response(results)
            logger.info(f"Selected best result from model: {best_result.get('model_name', 'unknown')}")

        # If no successful responses, return error
        if not best_result["success"]:
            error_msg = best_result["error"]
            logger.error(f"Error in best result: {error_msg}")
            raise HTTPException(
                status_code=500,
                detail=error_msg
            )

        # Return the best response
        logger.info(f"Returning response from {best_result['model_name']} ({len(best_result['response'])} chars)")
        return {
            "response": best_result["response"],
            "model_used": best_result["model_name"]
        }
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        logger.error(f"Unexpected error in chat_endpoint: {str(e)}")
        logger.error(error_details)
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

@app.get("/health")
async def health_check():
    models_info = {}

    # Add information about each model
    for model_id, model_config in MODELS.items():
        models_info[model_id] = {
            "name": model_config["name"],
            "enabled": model_config["enabled"],
            "priority": model_config["priority"],
            "status": "available" if model_config["enabled"] else "not configured"
        }

    return {
        "status": "healthy",
        "models": models_info,
        "fallback_chain": "enabled"
    }

@app.get("/")
async def root():
    return {
        "message": "Welcome to Yatra Sevak.AI API",
        "docs": "/docs",
        "health": "/health"
    }