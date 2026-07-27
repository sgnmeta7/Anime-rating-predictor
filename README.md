#  Anime Success Rating Predictor

Predict whether a planned or existing anime project will perform well, average, or poorly based on production attributes, metadata, and studio history.

**Live Demo:** [View Deployed App](https://anime-rating-predictor.vercel.app/)

---

##  Project Overview

This project is an end-to-end Machine Learning web application that forecasts the audience review score tier for an anime project. Users input production attributes—such as studio, genre mix, episode count, content rating, and source material—and receive an instant success classification (**Great**, **Good Enough**, or **Bad**).

The system uses a multi-class **XGBoost Classifier** trained on historical MyAnimeList (MAL) data, wrapped in a Flask REST API and served via a React frontend.

---

##  Tech Stack

* **Frontend:** React.js
* **Backend:** Python / Flask API
* **Machine Learning:** XGBoost, Scikit-Learn, Pandas, NumPy, Joblib
* **Deployment:** Vercel (Frontend), Render (Backend API)

---

##  Dataset & Preprocessing

* **Dataset Source:** [MyAnimeList Kaggle Dataset](https://www.kaggle.com/datasets/azathoth42/myanimelist)
* **Target Classes (`score`):**
  *  **Bad:** Score `< 6.5`
  * **Good Enough:** Score `6.5 - 7.5`
  * **Great:** Score `>= 7.5`

### Preprocessing Pipeline
1. **Filtering Unrated Shows:** Removed entries with `score = 0` (unreleased or unrated titles).
2. **Regex Duration Parsing:** Converted raw runtime strings (e.g., `"1 hr 20 min"`) into standardized float minutes per episode.
3. **Studio Frequency Encoding:** Mapped high-cardinality studio names to their historical production counts (`studio_freq`).
4. **Multi-Hot Genre Encoding:** Extracted comma-separated genre lists into individual binary flag columns (`genre_Action`, `genre_Drama`, etc.).
5. **One-Hot Encoding:** Applied to categorical features (`type`, `source`, `rating`).
6. **Class Imbalance Handling:** Applied balanced sample weights (`compute_sample_weight('balanced', y_train)`) during XGBoost training.

---

## Features Used in Prediction

* **`type`**: Format of the media (e.g., TV, Movie, OVA, ONA).
* **`source`**: Original source material (e.g., Manga, Light novel, Original, Game).
* **`episodes`**: Total number of episodes in the anime.
* **`airing`**: Airing status boolean (1 for On Air, 0 for Finished Airing).
* **`duration`**: Runtime per episode measured in float minutes.
* **`rating`**: Content age rating (e.g., PG-13, R - 17+, G).
* **`studio`**: Animation production studio that produced the anime (e.g., MAPPA, Madhouse, ufotable).
* **`genre`**: Genre tags of the anime where multiple options can be selected (e.g., Action, Drama, Sci-Fi).

---
Note: there is no styling added to the frontend due to time limitations that will be added as soon as possible.
the model has been trained to achieve a macro f1 score of 0.67 and an accuracy of 0.77 upon training with more recent training data from 
other datasets it can be refined even more.
 
**Request Body (JSON):**
```json
{
  "type": "TV",
  "source": "Manga",
  "episodes": 12,
  "airing": 0,
  "duration": 24,
  "rating": "PG-13 - Teens 13 or older",
  "studio": "MAPPA",
  "genre": "Action, Drama"
}
