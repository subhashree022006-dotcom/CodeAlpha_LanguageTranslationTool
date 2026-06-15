from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

TRANSLATION_API = "https://api.mymemory.translated.net/get"

LANGUAGES = {
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese',
    'ja': 'Japanese',
    'ko': 'Korean',
    'zh': 'Chinese',
    'hi': 'Hindi'
}

@app.route('/')
def index():
    return render_template('index.html', languages=LANGUAGES)

@app.route('/translate', methods=['POST'])
def translate():
    data = request.json
    text = data.get('text')
    source_lang = data.get('source')
    target_lang = data.get('target')
    
    try:
        params = {
            'q': text,
            'langpair': f'{source_lang}|{target_lang}'
        }
        response = requests.get(TRANSLATION_API, params=params)
        result = response.json()
        
        if result['responseStatus'] == 200:
            translated_text = result['responseData']['translatedText']
            return jsonify({'translated_text': translated_text})
        else:
            return jsonify({'error': 'Translation failed'}), 500
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)