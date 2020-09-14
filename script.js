const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');

function showLoadingSpinner() {
    loader.hidden = false;
    quoteContainer.hidden = true;
}

function removeLoadingSpinner() {
    if(!loader.hidden){
        quoteContainer.hidden=false;
        loader.hidden=true;
    }
}

async function getQuote(count) {
    if (count === ''){
        count = 0;
    }
    showLoadingSpinner();
    const proxyURL = 'https://cors-anywhere.herokuapp.com/'
    const apiURL = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
    try {
        const response = await fetch(proxyURL + apiURL);
        const data = await response.json();
        if (data.quoteAuthor === ''){
            authorText.innerText = 'Unknown'
        }
        else {
            authorText.innerText = data.quoteAuthor;
        }
        // Reduce font size for long quote
        if (data.quoteText.length > 120){
            quoteText.classList.add('long-quote');
        }
        else {
            quoteText.classList.remove('long-quote');
        }
        quoteText.innerText = data.quoteText;
        removeLoadingSpinner();
    } catch (error) {
        // Occasionally this api returns poorly formed JSON and fails. In that case resend the request.
        if (count < 10) {
            getQuote(count+1);
        }
        else {
            authorText.innerText = '';
            quoteText.innerText = 'We could not find an appropriate quote at this time, try again soon.';
            quoteText.classList.add('long-quote');
            removeLoadingSpinner();
        }
        console.log('Whoops, no quote', error);
    }
}

function tweetQuote(){
    console.log('tweet')
    const quote = quoteText.innerText;
    const author = authorText.innerText;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
    console.log(quote + ' ' + author)
    window.open(twitterUrl, '_blank');
}



// Event Listeners
newQuoteBtn.addEventListener('click',getQuote);
twitterBtn.addEventListener('click', tweetQuote);

// On Load
getQuote(0);