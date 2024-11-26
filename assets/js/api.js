const dictionaryCheckbox = document.getElementById('dictionary-checkbox');
const quotesCheckbox = document.getElementById('quotes-checkbox');
const parameterInput = document.getElementById('parameter-input');
const responseText = document.getElementById('api-response-text');
const errorMessage = document.getElementById('api-error-message');

// Results and input clearing when toggling
function clearInputAndResults() {
    parameterInput.value = '';
    responseText.style.display = 'none';
    responseText.innerText = '';
    errorMessage.style.display = 'none';
    errorMessage.innerText = '';
}

dictionaryCheckbox.addEventListener('change', function () {
    if (dictionaryCheckbox.checked) {
        quotesCheckbox.checked = false; // Properly untoggle to pick one API at a time
        clearInputAndResults();
    }
});

quotesCheckbox.addEventListener('change', function () {
    if (quotesCheckbox.checked) {
        dictionaryCheckbox.checked = false; // Properly untoggle to pick one API at a time
        clearInputAndResults();
    }
});

document.getElementById('api-request-button').addEventListener('click', async function () {
    const dictionaryChecked = dictionaryCheckbox.checked;
    const quotesChecked = quotesCheckbox.checked;
    const query = parameterInput.value.trim();

    // Clear previous results
    responseText.style.display = 'none';
    responseText.innerText = '';
    errorMessage.style.display = 'none';
    errorMessage.innerText = '';

    // Input validation
    if (!query) {
        alert('Please try typing a word or category.');
        return;
    }
    if (!dictionaryChecked && !quotesChecked) {
        alert('Please select an option: Dictionary or Quotes.');
        return;
    }

    let apiUrl = '';
    const headers = {
        'X-Api-Key': 'u48ds7v9dF4B8yUEAR+9IA==Ey27bWw1vk8FgVrh' // API key obtained from NINJA API
    };

    if (dictionaryChecked) {
        apiUrl = `https://api.api-ninjas.com/v1/dictionary?word=${encodeURIComponent(query)}`;
    } else if (quotesChecked) {
        apiUrl = `https://api.api-ninjas.com/v1/quotes?category=${encodeURIComponent(query)}`;
    }

    try {
        const response = await fetch(apiUrl, { headers });
        const data = await response.json();

        if (!response.ok) {
            // API error message
            errorMessage.style.display = 'block';
            errorMessage.innerText = data.error || 'An error occurred. Please check your input or try again later.';
            return;
        }

        // API response
        responseText.style.display = 'block';
        responseText.innerText = dictionaryChecked
            ? `Definition of ${query}: ${data.definition || 'No definition retrieved.'}`
            : `Quote in ${query} category: "${data[0]?.quote || 'No quote retrieved.'}"`;
    } catch (error) {
        // Connection errors
        errorMessage.style.display = 'block';
        errorMessage.innerText = 'Failed to connect to the API. Please try again later.';
    }
});