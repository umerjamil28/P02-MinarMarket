import sys
import torch
import requests
from transformers import AutoImageProcessor, AutoModel
from PIL import Image
import json
import io

processor = AutoImageProcessor.from_pretrained("facebook/dinov2-large")
model = AutoModel.from_pretrained("facebook/dinov2-large")

def download_image(url):
    response = requests.get(url)
    response.raise_for_status()
    img = Image.open(io.BytesIO(response.content)).convert("RGB")
    return img

def main():
    if len(sys.argv) < 2:
        print("Image URL missing", file=sys.stderr)
        sys.exit(1)

    url = sys.argv[1]
    try:
        image = download_image(url)
        inputs = processor(images=image, return_tensors="pt")
        with torch.no_grad():
            outputs = model(**inputs)
            embedding = outputs.last_hidden_state[:, 0, :].squeeze().tolist()
        print(json.dumps(embedding))
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
