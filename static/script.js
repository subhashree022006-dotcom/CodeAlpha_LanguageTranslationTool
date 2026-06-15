document.getElementById('translate-btn').addEventListener('click', async function() {
    const inputText = document.getElementById('input-text').value.trim();
    const sourceLang = document.getElementById('source-lang').value;
    const targetLang = document.getElementById('target-lang').value;
    const errorDiv = document.getElementById('error-message');
    
    if (!inputText) {
        showError('Please enter text to translate');
        return;
    }
    
    if (sourceLang === targetLang) {
        showError('Source and target languages must be different');
        return;
    }
    
    try {
        const response = await fetch('/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: inputText,
                source: sourceLang,
                target: targetLang
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            document.getElementById('output-text').value = data.translated_text;
            errorDiv.style.display = 'none';
        } else {
            showError(data.error || 'Translation failed');
        }
    } catch (error) {
        showError('Error connecting to server: ' + error.message);
    }
});

document.getElementById('copy-btn').addEventListener('click', function() {
    const outputText = document.getElementById('output-text');
    outputText.select();
    document.execCommand('copy');
    
    const originalText = this.textContent;
    this.textContent = '✓ Copied!';
    setTimeout(() => {
        this.textContent = originalText;
    }, 2000);
});

function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}