import { useState } from "react";

const type = ["TV", "OVA", "Special", "Movie", "ONA", "Music", "Unknown"];

const source = [
  "Original", "Manga", "Visual novel", "Game", "Light novel", "Novel", 
  "Music", "4-koma manga", "Web manga", "Picture book", "Book", 
  "Card game", "Digital manga", "Radio", "Unknown"
];

const rating = [
  "PG-13 - Teens 13 or older",
  "G - All Ages",
  "PG - Children",
  "Rx - Hentai",
  "R - 17+ (violence & profanity)",
  "R+ - Mild Nudity"
];

const studio = [
  "Unknown", "MAPPA", "Madhouse","Bones", "Kyoto Animation", "Wit Studio",
"A-1 Pictures","ufotable", "Toei Animation", "J.C.Staff", "CloverWorks",
"Studio Pierrot", "Production I.G", "Sunrise","Shaft","Studio Ghibli"]

const genre = [
  "Action", "Adventure", "Cars", "Comedy", "Dementia", "Demons", 
"Drama","Ecchi", "Fantasy", "Game", "Harem", "Historical",
"Horror","Josei","Kids","Magic","Martial Arts" ,"Mecha", 
"Military", "Music","Mystery", "Parody","Police","Psychological", 
"Romance" , "Samurai", "School", "Sci-Fi","Seinen","Shoujo", 
"Shoujo Ai","Shounen", "Shounen Ai", "Slice of Life", "Space", 
  "Sports", "Super Power","Supernatural","Thriller", "Vampire", 
"Yaoi", "Yuri"
]

export default function UI() {
  const [formData, setFormData] = useState({
    type: "TV",
    source: "Manga",
    episodes: 12,
    airing: 0,
    duration: 24,
    rating: "PG-13 - Teens 13 or older",
    studio: "Mappa",
  });

  const [selectedGenres, setSelectedGenres] = useState(["Action"])
  const [pred, setpred] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

 const selectGenre = (genre) => {
  setSelectedGenres((prev) => {
    const alrSelected = prev.includes(genre);

    if (alrSelected) {
     
      return prev.filter((g) => g !== genre);
    }
    return [...prev, genre];
  });
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setpred(null);

    const input = {
      type: formData.type,
      source: formData.source,
      episodes: parseInt(formData.episodes, 10) || 0,
      airing: parseInt(formData.airing, 10),
      duration: parseFloat(formData.duration) || 0,
      rating: formData.rating,
      studio: formData.studio,
      genre: selectedGenres.join(", "), 
    };

    try {
      const response = await fetch("https://anime-rating-predictor.onrender.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error("connection to server failed")
      }

      const data = await response.json()
      setpred(data.predicted_class || data.predicted_score || data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div >
      <h1>Anime Success Rating Predictor</h1>
      <h2>Enter Anime Details!</h2>

      <form onSubmit={handleSubmit}>
        <label>
          <h3>Type</h3>
          <select name="type" value={formData.type} onChange={handleInputChange}>
            {type.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>
        <label>
          <h3>Source</h3>
          <select name="source" value={formData.source} onChange={handleInputChange}>
            {source.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>

        <label>
          <h3>No. of episodes</h3>
          <input
            type="number"
            name="episodes"
            value={formData.episodes}
            onChange={handleInputChange}
            placeholder="enter no. of episodes"
            min="1"
            required
          />
        </label>
        <label>
          <h3>Airing?</h3>
          <select name="airing" value={formData.airing} onChange={handleInputChange}>
            <option value={1}>On Air</option>
            <option value={0}>Finished Airing</option>
          </select>
        </label>
        <label>
          <h3>Episode Duration in minutes</h3>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            placeholder="enter duration in minutes"
            min="1"
            required
          />
        </label>

        <label>
          <h3>Age Rating</h3>
          <select name="rating" value={formData.rating} onChange={handleInputChange}>
            {rating.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </label>
        <label>
          <h3>Studio</h3>
          <select name="studio" value={formData.studio} onChange={handleInputChange}>
            {studio.map((stud) => (
              <option key={stud} value={stud}>{stud}</option>
            ))}
          </select>
        </label>

        <div>
          <h3>Genres</h3>
            {genre.map((g) => (
              <label key={g} >
                <input
                  type="checkbox"
                  checked={selectedGenres.includes(g)}
                  onChange={() => selectGenre(g)}
                />
                {" "}{g}
              </label>
            ))}
          
        </div>

        <button
          type="submit"
          disabled={loading}
        
        >
          {loading ? "Predicting.." : "Predict Success Rating"}
        </button>
      </form>

  
      {pred && (
        <div>
          <h3>Predicted Result:</h3>
          <p >{JSON.stringify(pred)}</p>
        </div>
      )}

      {error && (
          <p><b>Error:</b> {error}</p>
      
      )}
    </div>
  );
}
