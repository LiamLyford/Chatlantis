const axios = require('axios');
var baseAmount = 100;
var baseCurrency = 'USD';
var exchangeCurrencies = ['CAD', 'GBP', 'HKD', 'PLN'];

var exchange = async (baseAmount, baseCurrency, exchangeCurrencies) => {
    // use APIs/get info
    var exchangeSymbols = exchangeCurrencies.join();
    let rates = await axios.get('https://api.exchangeratesapi.io/latest?base='+ encodeURIComponent(baseCurrency) + '&symbols=' + encodeURIComponent(exchangeSymbols));
    let countries = await axios.get('https://restcountries.eu/rest/v2/currency/' + encodeURIComponent(baseCurrency));
    
    // Calculate exchanged currencies and store them in an array
    var exchangedCurrencies = []
    for(i = 0; i < exchangeCurrencies.length; i++){
        // console.log(rates.data.rates);
        // console.log(exchangeCurrencies[i]);
        finalRate = eval('rates.data.rates.' + exchangeCurrencies[i]);
        // console.log(stringRates);
        exchangedCurrencies.push(baseAmount*finalRate);        
    }
    
    // Get the country names from the second API
    var validCountries = []
    for(i = 0; i < countries.data.length; i++){
        // console.log(countries.data[i].name);
        validCountries.push(countries.data[i].name);
    }
    
    // Convert currency information to an output string
    currencyString = ''
    for(i = 0; i < exchangeCurrencies.length; i++){
        currencyString += exchangedCurrencies[i].toFixed(2) + ' ' + exchangeCurrencies[i];
        if(i < exchangeCurrencies.length - 1){
            currencyString += ' / '
        } 
    }
    
    // Combine all information into a return string
    resultString = `${baseAmount} ${baseCurrency} is worth ${currencyString}. You can spend it in the following countries: ${validCountries.join(', ')}`;
    return resultString;
}
exchange(baseAmount, baseCurrency, exchangeCurrencies).then((status) => {
    console.log(status)}).catch((e) => {
        console.log(e.message);
    });