import fetch from "node-fetch"

export function handleSubmit(event) {
    event.preventDefault()
    // get input from the user
    let city = document.getElementById('input-city').value
    let startingDate = new Date(document.getElementById('input-start-date').value)
    let todaysDate = new Date()
    const daysLeft = Math.ceil((startingDate - todaysDate)/86400000)
    startingDate = startingDate.toISOString().split('T')[0]
    todaysDate = todaysDate.toISOString().split('T')[0]
    // create a variable to hold trips' data
    let tripData
    console.log(startingDate)
    console.log(todaysDate)
    console.log(daysLeft)
    if (city != 0) {
        Client.getGNData(city)
            .then(async function (geoArray){
                return await postData('http://localhost:8000/geonames-api', {
                    latitude: geoArray[0],
                    longitude: geoArray[1],
                    country: geoArray[2],
                    name: geoArray[3]
                })
            })
            .then(async function (){
                await fetch('http://localhost:8000/weatherbit-api')
            })
            .then(async function (){
                await fetch('http://localhost:8000/pixabay-api')
            })
            .then(async function (){
                const api_url = `data/${startingDate},${todaysDate},${daysLeft}`
                const response = await fetch(api_url)
                tripData = await response.json()
                console.log(tripData)
            })
            .then(async function (){
                // update interface
                console.log("this is the other function: ", tripData)
                const container = document.getElementById('trips')
                container.insertAdjacentHTML('afterbegin', 
                `<div class="trip">
                    <div class="country">${tripData[tripData.length-1].country}</div>
                    <div class="name">${tripData[tripData.length-1].name}</div>
                    <div class="latlong">${tripData[tripData.length-1].lat}, ${tripData[tripData.length-1].long}</div>
                    <div class="image"><img src=${tripData[tripData.length-1].img}></div>
                    <div class="days">Days left: ${tripData[tripData.length-1].days}</div>
                    <div class="trip-date">Departure: ${tripData[tripData.length-1].trip_date}</div>
                    <div class="trip-temp">${tripData[tripData.length-1].trip_temp}</div>
                    <div class="trip-description">${tripData[tripData.length-1].trip_description}</div>
                </div>`)
                
            })
    } else {
        alert('Enter valid data')
    }
} 


const postData = async (url='', data={}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({url: data})
    })
}