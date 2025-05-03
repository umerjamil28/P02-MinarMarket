# recommender.py
import numpy as np
import pickle
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense, Concatenate, Dropout
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping

# Load dataset
with open("dataset.pkl", "rb") as f:
    X_user_context, X_product, y = pickle.load(f)

# Input layers
user_input = Input(shape=(384,), name="user_context")  # 384 = embedding size
product_input = Input(shape=(384,), name="product_embedding")

# Merge
merged = Concatenate()([user_input, product_input])
x = Dense(256, activation="relu")(merged)
x = Dropout(0.3)(x)
x = Dense(128, activation="relu")(x)
x = Dropout(0.3)(x)
x = Dense(64, activation="relu")(x)
output = Dense(1, activation="sigmoid")(x)

model = Model(inputs=[user_input, product_input], outputs=output)
model.compile(optimizer=Adam(1e-4), loss="binary_crossentropy", metrics=["accuracy"])

# Train
model.fit(
    [X_user_context, X_product],
    y,
    epochs=50,
    batch_size=64,
    validation_split=0.1,
    callbacks=[EarlyStopping(patience=3, restore_best_weights=True)],
)

# Save model
model.save("recommender_model.h5")
