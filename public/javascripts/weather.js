
    const form = document.getElementById("weather");
    const resultDiv = document.getElementById("result");



form.addEventListener('submit', async(e) =>{
    e.preventDefault();

    const location = document.getElementById("location").value 
    const queryType = document.getElementById("type").value
    console.log(process.env.WEATHER_API)
    const weatherToken = process.env.WEATHER_API
    const searchUrl = {
    'current': `https://api.weatherapi.com/v1/${queryType}.json?key=${weatherToken}&q=${location}`,
    'forecast': `https://api.weatherapi.com/v1/${queryType}.json?key=${weatherToken}&&q=${location}&days=3`
}
    try{
        const res = await fetch(searchUrl[queryType])
        const data = await res.json()
        console.log(data)
        if(queryType === 'forecast'){
           resultDiv.innerHTML = `
           <h1>Weather in ${data.location.name}, ${data.location.country} for the next 3 days </h1><br>
           <div class ="d-flex justify-content-center gap-4">
                                <div class="border border-light rounded">
                                <h5>Date: ${data.forecast.forecastday[0].date} </h5>
                                <img src="${data.forecast.forecastday[0].day.condition.icon}">
                                <h3>Temperature Max: ${data.forecast.forecastday[0].day.maxtemp_f}F / ${data.forecast.forecastday[0].day.maxtemp_c}C </h3>
                                <h3>Temperature Min: ${data.forecast.forecastday[0].day.mintemp_f}F / ${data.forecast.forecastday[0].day.mintemp_c}C </h3>
                                <h4>Condition: ${data.forecast.forecastday[0].day.condition.text} </h4><br>
                                </div>
                                 <div class="border border-light rounded">
                               <h5>Date: ${data.forecast.forecastday[1].date} </h5>
                                <img src="${data.forecast.forecastday[1].day.condition.icon}">
                                <h3>Temperature Max: ${data.forecast.forecastday[1].day.maxtemp_f}F / ${data.forecast.forecastday[1].day.maxtemp_c}C </h3>
                                <h3>Temperature Min: ${data.forecast.forecastday[1].day.mintemp_f}F / ${data.forecast.forecastday[1].day.mintemp_c}C </h3>
                                <h4>Condition: ${data.forecast.forecastday[1].day.condition.text} </h4><br>
                                </div>
                                <div class="border border-light rounded"> 
                               <h5>Date: ${data.forecast.forecastday[2].date} </h5>
                                <img src="${data.forecast.forecastday[2].day.condition.icon}">
                                <h3>Temperature Max: ${data.forecast.forecastday[2].day.maxtemp_f}F / ${data.forecast.forecastday[2].day.maxtemp_c}C </h3>
                                <h3>Temperature Min: ${data.forecast.forecastday[2].day.mintemp_f}F / ${data.forecast.forecastday[2].day.mintemp_c}C </h3>
                                <h4>Condition: ${data.forecast.forecastday[2].day.condition.text} </h4>
                                </div>
                                </div>` 
                                
        }else{resultDiv.innerHTML = `<h1>Weather in ${data.location.name}, ${data.location.country} </h1>
        <div class="border border-light rounded"> 
                                <h5>Local Time: ${data.location.localtime} </h5>
                                <img src="${data.current.condition.icon}">
                                <h3>Temperature: ${data.current.temp_f}F / ${data.current.temp_c}C </h3>
                                <h4>Condition: ${data.current.condition.text} </h4>
                            </div>`}
    }catch(err){
        
        console.log(err)
    }
});