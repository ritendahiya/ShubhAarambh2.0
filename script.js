
const searchBox = document.getElementById('search-box');
const autocompleteResults = document.getElementById('autocomplete-results');
const countries = [
    'abraham',
    'Ballu',
    'Bali',
    'Cindy',
    'Drake',
    'Elephant',
    'Paraphernalia',
    'Relevant',
    'Suresh Singh',
    'surender sodhi',
    'the',
];

function calculateClosestMatch(searchTerm) {
    return countries
        .map(country => ({//maps country name with its minimum edit distance, which allows us to segregate the most appropriate result
            country,
            distance: levenshteinDistance(searchTerm.toLowerCase(), country.toLowerCase())//takes country name, in lower case and the search word in lower case
        }))
        .sort((a, b) => a.distance - b.distance)
        .map(entry => entry.country);
}

function levenshteinDistance(a, b) {//a is searchitem, b is our sample
    //check if empty 
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    matrix[0] = Array.from({ length: b.length + 1 }, (_, i) => i);

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            //if char match, no transformation
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,//insert
                matrix[i][j - 1] + 1,//delete
                matrix[i - 1][j - 1] + cost//replace
            );
        }
    }

    return (matrix[a.length][b.length])/Math.max(a.length,b.length);
}

function displayResults(results) {
    const resultItems = results.map(item => `
    <button class="result_id" data-country="${item}" ><div id="listelement" class="result-item${item}">${item}</div></button>
    `).join('');
    autocompleteResults.innerHTML = resultItems;
    autocompleteResults.style.display = 'block';
}

function hideResults() {
    autocompleteResults.style.display = 'none';
}

function autocomplete(event) {
    const searchTerm = event.target.value;
    //check if search box is empty
    if (!searchTerm) {
        hideResults();
        return;
    }   
    //store resultant array in var
    const closestMatches = calculateClosestMatch(searchTerm);
    displayResults(closestMatches);
}
//allows auto initiation of autocomplete when we enter anything in the search box
searchBox.addEventListener('input', autocomplete);

//TO OPEN A NEW PAGE ON CLICK OF BUTTON
document.addEventListener('click', event => {
    const clickedButton = event.target.closest('.result_id');
    if (clickedButton) {
        const countryName = clickedButton.getAttribute('data-country');
        if (countryName) {
            window.location.href = `result.html?country=${encodeURIComponent(countryName)}`;
        }
    }
});


document.addEventListener('click', event => {
    if (!event.target.closest('.autocomplete')) {
        hideResults();
    }
});
