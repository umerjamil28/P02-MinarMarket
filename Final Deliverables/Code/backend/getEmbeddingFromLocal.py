import sys
import torch
from transformers import AutoImageProcessor, AutoModel
from PIL import Image
import numpy as np
import json

# Path to image file passed as a command line argument
image_path = sys.argv[1]

# Initialize DINOv2 model and processor
processor = AutoImageProcessor.from_pretrained("facebook/dinov2-large")
model = AutoModel.from_pretrained("facebook/dinov2-large")
model.eval()

# Load and preprocess the image
image = Image.open(image_path).convert("RGB")
inputs = processor(images=image, return_tensors="pt")

# Compute the image embedding
with torch.no_grad():
    outputs = model(**inputs)
    embedding = outputs.last_hidden_state[:, 0, :]

# Convert the embedding to a list and print it as JSON
embedding_list = embedding.squeeze(0).cpu().numpy().tolist()
print(json.dumps(embedding_list))
