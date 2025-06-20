import traceback
import sys
import os

# Add the current directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    import main
    print('Starting server...')
    print('App:', main.app)
    import uvicorn
    uvicorn.run(main.app, host='0.0.0.0', port=8000)
except Exception as e:
    print(f"Error: {e}")
    traceback.print_exc()
