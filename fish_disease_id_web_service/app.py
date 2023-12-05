import os
import numpy as np
import tensorflow as tf
import cv2
# Keras
from tensorflow.keras.applications.inception_v3 import preprocess_input,InceptionV3
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

from flask import Flask, redirect, url_for, request, render_template
from werkzeug.utils import secure_filename

# Define a flask app
app = Flask(__name__)

# Model saved with Keras model.save()
MODEL_PATH ='E:\\SLIIT\\4th yr 2nd semester\\RP\\fish_disease_id_web_service\\model\\final_model.h5'

class_dict = {0:'Dropsy',
              1:'Neurofibroma',
              2:'Cannot Identify'}

# Load your trained model
model = load_model(MODEL_PATH)

def model_predict(model, img_path, confidence_threshold=0.9):
    img = image.load_img(img_path, target_size=(224, 224))

    # Preprocessing the image
    x = image.img_to_array(img)
    x = x / 255
    x = np.expand_dims(x, axis=0)

    preds = model.predict(x)
    max_pred = np.max(preds)
    if max_pred < confidence_threshold:
        return class_dict[2], "Cannot Identify"
    else:
        pred_class_idx = np.argmax(preds)
        pred_class = class_dict[pred_class_idx]
        pred_description = get_fish_description(pred_class_idx)  # Modify this to get the description
        return pred_class, pred_description

def get_fish_description(class_idx):
    # Modify this function to provide descriptions for each class index
    descriptions = {
        0: "Dropsy is the buildup of fluid inside the body cavity or tissues of a fish.",
        1: "Neurofibroma is a peripheral nerve tumor that forms soft bumps on or under the skin.",
        2: "Cannot Identify",
    }
    return descriptions.get(class_idx, "Unknown")

@app.route('/',methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def upload():
    if request.method == 'POST':
        # Get the file from the post request
        f = request.files['file']

        # Save the file to ./uploads
        basepath = os.path.dirname(__file__)
        file_path = os.path.join(
            basepath, 'uploads', secure_filename(f.filename))
        f.save(file_path)

        # Make prediction
        pred_class, pred_description = model_predict(model, file_path)

        # Check if the prediction is "Cannot Identify" and return an appropriate response
        if pred_class == class_dict[2]:
            return "Cannot identify, please try again", 200  
        else:
            result = f"{pred_class}. \n \n {pred_description}"
            return result, 200

    return None

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5002,debug=True)