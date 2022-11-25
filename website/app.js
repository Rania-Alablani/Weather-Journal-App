/* Global Variables */
const url = "https://api.openweathermap.org/data/2.5/weather?zip=";
const personalKey = '11f9f82d71e00a3eccdc9db4975a46d4';
const apiKey = `,&appid=${personalKey}&units`
let weatherIcon = document.querySelector('#icon');
const searchbtn = document.querySelector("#search");

// Create new date instance dynamically
let d = new Date();
let newDate = d.toDateString();

const fetchData = async() => {
  const zipCode = document.querySelector("#zipCode").value;
  const feelings = document.querySelector("#feelings").value;

  getInfo(zipCode).then((data) => {
    if (data) {
      const {
        main: { temp },
        name: city,
        weather: [{ description }],
      } = data;

      const info = {
        newDate,
        city,
        temp: Math.round(kelvinToFahrenheit(temp)),
        icon: data.weather[0].icon,
        pressure: data.main.pressure,
        humidity: data.main.humidity,
        description,
        feelings,
      };
      postInfo("http://localhost:4000/add", info);
      updateInfo();
      document.querySelector('#title').style.padding = "10px 10px 20px 10px";
      document.querySelector('#entryHolder').style.margin = "10px 10px 20px 10px";
    }
  })
};

// Add event Listen to the btn!
searchbtn.addEventListener("click", fetchData);

// Function to GET Web API info
const getInfo = async(zipCode) => {
    const response = await fetch(url + zipCode + apiKey);
  try {
    const info = await response.json();
    return info;
  } catch (error) {
    console.log(error);
  }
};

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
    console.log(`saved`, newData);
    return newData;
  } catch (error) {
    console.log(error);
  }
};

// This Function to GET info and update the displayed info
const updateInfo = async () => {
  const response = await fetch("http://localhost:4000/all");
  const savedData = await response.json();
  let icon = savedData.icon;

    document.querySelector("#temp").innerHTML =  savedData.temp + '°F'; // display letter f with the tempreture (fehrenheit)
    document.querySelector('#icon').innerHTML = savedData.icon;
    document.querySelector("#city").innerHTML =  savedData.city;
    document.querySelector("#description").innerHTML = "Description: " + savedData.description;
    document.querySelector("#date").innerHTML = "Date: " + savedData.newDate;
    document.querySelector('#pressure').innerHTML = "Pressure: " + savedData.pressure;
    document.querySelector('#humidity').innerHTML = "Humidity: " + savedData.humidity + "%";
    document.querySelector("#content").innerHTML = "You are " + savedData.feelings;
    changeIcon(icon);
};

const changeIcon = (icon) => {
  switch (icon) {
    case "01d":
      weatherIcon.src = "img/sun.png";
      break;
    case "01n":
      weatherIcon.src = "img/moon.png";
      break;
    case "02d":
    case "02n":
    case "03d":
    case "03n":
    case "04d":
    case "04n":
      weatherIcon.src = "img/cloudy.png";
      break;
    case "09d":
    case "09n":
    case "10d":
    case "10n":
      weatherIcon.src = "img/rain.png";
      break;
    case "11d":
    case "11n":
      weatherIcon.src = "img/storm.png";
      break;
    case "13d":
    case "13n":
      weatherIcon.src = "img/snow.png";
      break;
    case "50d":
    case "50n":
      weatherIcon.src = "img/fog.png";
      break;
    default:
      weatherIcon.src = "img/weather.png";
  }
}

// Function to convert temp to Fahrenheit
//resource: https://www.w3schools.com/howto/howto_js_temperature_converter.asp
function kelvinToFahrenheit(kelvin) {
    if (kelvin < (0)) {
        return 'below absolute zero (0 K)';
    } else {
        return (((kelvin - 273.15)*1.8)+32).toFixed(2);
    }
}
