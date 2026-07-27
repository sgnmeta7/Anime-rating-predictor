import numpy as np
import pandas as pd
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

model = joblib.load('xgb_model.pkl')
columns = joblib.load('model_columns.pkl')
studio_freq_map = joblib.load('studio_freq_map.pkl')
median_duration = joblib.load('median_duration.pkl')

CLASS_ORDER = ['Bad (<6.5)', 'Good Enough (6.5-7.5)', 'Great (>=7.5)']


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json(force=True)
        raw = pd.DataFrame([data])
    
        raw['airing'] = raw['airing'].astype(int)
        raw['episodes'] = raw['episodes'].astype(int)
        
        
        studio_val = raw['studio'].iloc[0] if 'studio' in raw.columns else 'Unknown'
        raw['studio_freq'] = studio_freq_map.get(studio_val, 0)
        
   
        input_onehot = pd.get_dummies(raw[['type', 'source', 'rating']], prefix=['type', 'source', 'rating'], dtype=int)
        
      
        if 'genre' in raw.columns:
            genre_str = str(raw['genre'].iloc[0])
        else:
            genre_str = ""
        genre_dict = {}
        if genre_str and genre_str != "nan":
            for genre in genre_str.split(','):
                clean_genre = genre.strip() 
                column_name = f"genre_{clean_genre}"
                genre_dict[column_name] = 1
        genre_dummies = pd.DataFrame([genre_dict])
        
    
        finaldata = pd.concat([raw[['episodes', 'airing', 'duration']], input_onehot, genre_dummies, raw['studio_freq']], axis=1)

        finaldata = finaldata.reindex(columns=columns, fill_value=0)
        
    
        prediction_idx = int(model.predict(finaldata)[0])
        probabilities = model.predict_proba(finaldata)[0].tolist()
        
        return jsonify({
            'prediction_label': CLASS_ORDER[prediction_idx],
            'probabilities':probabilities
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
