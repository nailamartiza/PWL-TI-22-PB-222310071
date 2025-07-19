from flask import Flask, render_template, request, jsonify
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)


df = pd.read_csv('data/fanfiction.csv')

def build_cf_similarity_matrix():
    inter = pd.read_csv('data/user_fanfic.csv')
    matrix = inter.pivot_table(index='fanfic_id', columns='user_id', aggfunc=len, fill_value=0)
    sim_matrix = cosine_similarity(matrix)
    sim_df = pd.DataFrame(sim_matrix, index=matrix.index, columns=matrix.index)
    return sim_df

def normalize_prompt(text):
    mapping = {
        "romance": "romansa",
        "fluff": "romansa",
        "comedy": "komedi",
        "humor": "komedi",
        "tragedy": "tragis",
        "horror": "horor",
        "thriller": "horor",
        "drama": "drama",
        "friendship": "persahabatan",
        "friend": "persahabatan",
        "fantasy": "fantasi",
        "slice of life": "persahabatan",
        "love": "romantis",
        "sad": "tragis",
        "ghost": "hantu horor",
        "supernatural": "horor"
    }

    for key, value in mapping.items():
        if key in text.lower():
            text += " " + value
    
    return text.lower() 

@app.route('/')
def index():
    fanfics = df[['title', 'genre', 'description']].to_dict(orient='records')
    return render_template('index.html', fanfics=fanfics)

@app.route('/recommend', methods=['POST'])
def recommend():
    prompt = request.json['prompt'].lower()

    df['full_text'] = df['description'] + " " + df['genre'] + " " + df['characters']
    corpus = [prompt] + df['full_text'].tolist()

    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(corpus)

    content_scores = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()

    cf_matrix = build_cf_similarity_matrix()
    collaborative_scores = np.zeros(len(df))

    top_content_indices = content_scores.argsort()[-5:][::-1]
    top_fanfic_ids = df.iloc[top_content_indices]['id'].tolist()

    for fid in top_fanfic_ids:
        if fid in cf_matrix.index:
            similar_scores = cf_matrix.loc[fid]
            for idx, row in df.iterrows():
                if row['id'] in similar_scores:
                    collaborative_scores[idx] += similar_scores[row['id']]

    if collaborative_scores.max() > 0:
        collaborative_scores = collaborative_scores / collaborative_scores.max()

    alpha = 0.7
    final_scores = alpha * content_scores + (1 - alpha) * collaborative_scores

    for idx, row in df.iterrows():
        if row['characters'].lower() in prompt:
            final_scores[idx] += 0.1
        if row['genre'].lower() in prompt:
            final_scores[idx] += 0.1

    top_indices = final_scores.argsort()[-3:][::-1]
    recommendations = df.iloc[top_indices][['title', 'genre', 'characters', 'link']].to_dict(orient='records')

    print("\n=== [DEBUG: HYBRID FILTERING] ===")
    for idx in top_indices:
        try:
            title = df.iloc[idx]['title']
            genre = df.iloc[idx]['genre']
            character = df.iloc[idx]['characters']
            content = content_scores[idx]
            collab = collaborative_scores[idx]
            final = final_scores[idx]

            print(f"Judul: {title}")
            print(f"Genre: {genre}, Karakter: {character}")
            print(f"[Content Score ]: {content:.4f}")
            print(f"[Collaborative ]: {collab:.4f}")
            print(f"[Final (Hybrid)]: {final:.4f}")
            print("------------------------")
        except Exception as e:
            print(f"⚠️ Error saat debug: {e}")

    return jsonify({"results": recommendations})


if __name__ == '__main__':
    app.run(debug=True)
