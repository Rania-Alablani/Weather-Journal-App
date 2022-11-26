/* Global Variables */
const url = "https://api.openweathermap.org/data/2.5/weather?zip=";
const perKey = '11f9f82d71e00a3eccdc9db4975a46d4';
const apiKey = `,&appid=${perKey}&units`
let weatherIcon = document.querySelector('#icon'); //variable for the img in HTML
const searchBtn = document.querySelector("#search");
let d = new Date();
let newDate = d.toDateString();

/* steps:
    1- Call API
    2- Post Data
    3- Update UI
*/

/*************************** Step 1: Call API ***************************/
const getInfo = async(url, zipCode, apiKey) => {
    const response = await fetch(url + zipCode + apiKey);
  try {
    const info = await response.json();
    return info;
  } catch (error) {
    console.log(error);
  }
};

// Add event Listener to the btn!
searchBtn.addEventListener("click", async function () {
  if (zipCode.value == "" || feelings.value == "") {
    alert("Enter your zip code and fealings :)");
  }else{
    const zipCode = document.querySelector("#zipCode").value; //to get the entered value for ZIP
    const feelings = document.querySelector("#feelings").value; //to get the entered value for user's feelings

    getInfo(url, zipCode, apiKey).then(function(data) {
      try{
        if(data){
              const info = {
                temp: data.main.temp,
                icon: data.weather[0].icon,
                city: data.name,
                description:data.weather[0].description,
                newDate,
                pressure: data.main.pressure,
                humidity: data.main.humidity,
                feelings,
              };
              postInfo("http://localhost:4000/add", info);
              updateInfo();
              document.querySelector('#title').style.padding = "10px 10px 20px 10px";
              document.querySelector('#entryHolder').style.margin = "10px 10px 20px 10px";
        }}catch(error){
          console.log(error);
        }})
  }});

/*************************** Step 2: Post Data ***************************/
async function postInfo(url,data) {
  const response = await fetch(url, {
    method: 'POST',
    mode:"cors",
    credentials:"same-origin",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  try {
    const newData = await response.json();
    return newData;
  } catch (error) {
    console.log(error);
  }
};

/*************************** Step 3: Update UI ***************************/
const updateInfo = async () => {
  const response = await fetch("http://localhost:4000/all");
  const savedData = await response.json();

    document.querySelector("#temp").innerHTML =  Math.round(toFahrenheit(savedData.temp)) + '°F'; // tempreture in Fahrenheit
    // Q: Do I have to do the same for icon??  >> document.querySelector("#icon").innerHTML =  savedData.icon;
    // Answer:  I think no because I will call changeIcon ...
    changeIcon(savedData.icon);//savedData.icon will return the value of the icon such as: 01d, 02d, etc...
    document.querySelector("#city").innerHTML =  savedData.city;
    document.querySelector("#description").innerHTML = "Description: " + savedData.description;
    document.querySelector("#date").innerHTML = "Date: " + savedData.newDate;
    document.querySelector('#pressure').innerHTML = "Pressure: " + savedData.pressure;
    document.querySelector('#humidity').innerHTML = "Humidity: " + savedData.humidity + "%";
    document.querySelector("#content").innerHTML = "You are " + savedData.feelings;
};

/*************************** Helper functions ***************************/
// Function 1: changeIcon >> To change the icon
// resource: Icon list >> https://openweathermap.org/weather-conditions
function changeIcon(icon){
  if (icon == "01d" || icon == "01n")
    weatherIcon.src = "img/sun.png";
  else if (icon == "02d" || icon == "02n" || icon == "03d" || icon == "03n" || icon == "04d" || icon == "04n")
    weatherIcon.src = "img/cloudy.png";
  else if (icon == "09d" || icon == "09n" || icon == "10d" || icon == "10n")
    weatherIcon.src = "img/rain.png";
  else if (icon == "11d" || icon == "11n")
    weatherIcon.src = "img/storm.png";
  else if (icon == "13d" || icon == "13n")
    weatherIcon.src = "img/snow.png";
  else if (icon == "50d" || icon == "50n")
    weatherIcon.src = "img/fog.png";
  else
    weatherIcon.src = "img/weather.png";
}

// Function 2: toFahrenheit >> to convert temp to Fahrenheit
//resource: https://www.w3schools.com/howto/howto_js_temperature_converter.asp
function toFahrenheit(kelvin) {
    if (kelvin >= (0)){
      return (((kelvin - 273.15)*1.8)+32).toFixed(2);
    } else {
        return 'below zero degrees';
    }
}
