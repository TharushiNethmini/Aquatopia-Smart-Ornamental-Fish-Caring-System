# 🐠 SMART ORNAMENTAL FISH CARING SYSTEM FOR AQUATIC INDUSTRY 
Thriving sector involving breeding, trade, and keeping fish for decorative purposes; challenges include declining productivity, disease identification, and forecasting, addressed using a Machine Learning technique; proposed system offers remedies through an intelligent agent and a buyer-seller integration platform; Frontend developed in JavaScript, Backend implemented with Python.

<h2>🧬 Fish Variety Identification</h2>
<p>The application features an image-based section enabling users to identify fish through a CNN algorithm capable of recognizing types such as "Angelfish," "Clownfish," and "Gurami." The model, developed using InceptionV3, undergoes a comprehensive process, including dataset preparation, data augmentation, fine-tuning, and training with the Adam optimizer. The training-validation split is set at 75% and 25%, respectively, with images standardized to a size of 500 x 500 pixels. Subsequently, the model is evaluated to measure its performance.</p>

<h2>🩺 Disease Identification</h2>
<p>In the dedicated section of the Aquatopia mobile app, users employ a InceptionV3 CNN architecture, trained on ImageNet, to identify Goldfish diseases by submitting images. The process includes freezing pre-trained layers, adding new layers, and implementing data augmentation for enhanced performance. The training-validation split is set at 80% and 20%, respectively, with images standardized to a size of 500 x 500 pixels.</p>

<h2>🩹 Fish Treatment Finding System</h2>
<p>Users navigate the app, answer symptom-related questions; data sent to the Fish Treatment web server, processed by a pre-trained LSTM model for treatment prediction; initial dataset includes 200 records with symptoms, diseases, and treatments</p>

<h2>📝 Best Seller Recommendation System</h2>
<p>Users access an aquarium ornament section, create orders; a Q learning algorithm filters best sellers based on product quality, delivery, and communication; the recommendation system employs reinforcement learning with a neural network, training an agent on user reviews for optimal suggestions.</p>
