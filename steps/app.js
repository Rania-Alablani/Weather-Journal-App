/* Global Variables */
const baseURL = "https://api.openweathermap.org/data/2.5/weather?zip=";
const personalKey = '11f9f82d71e00a3eccdc9db4975a46d4';
const apiKey = `,&appid=${personalKey}&units=imperial`
const server = "http://localhost:4000";
let weatherIcon = document.querySelector('#icon');
const searchbtn = document.querySelector("#search");

// Creating a new date instance dynamically with JS
let d = new Date();
let newDate = d.toDateString();

const fetchData = () => {
  const zipCode = document.querySelector("#zipCode").value;
  const feelings = document.querySelector("#feelings").value;

  getWeatherInfo(zipCode).then((data) => {
    if (data) {
      const {
        main: { temp },
        name: city,
        weather: [{ description }],
      } = data;

      const info = {
        newDate,
        city,
        temp: Math.round(temp),
        icon: data.weather[0].icon,
        pressure: data.main.pressure,
        humidity: data.main.humidity,
        description,
        feelings,
      };

      postInfo(server + "/add", info);

      updatingInfo();
      document.querySelector('#title').style.padding = "10px 10px 20px 10px";
      document.querySelector('#entryHolder').style.margin = "10px 10px 20px 10px";
    }
  });
};

// add function to existing HTML DOM element
searchbtn.addEventListener("click", fetchData);

// Function to GET Web API info
const getWeatherInfo = async (zipCode) => {
  try {
    const response = await fetch(baseURL + zipCode + apiKey);
    const info = await response.json();

    if (info.cod != 200) {
          document.getElementById("icon").style.display ="none" ;
          document.querySelector("#temp").innerHTML = ``;
          document.querySelector("#city").innerHTML = ``;
          document.querySelector("#date").innerHTML = ``;
          document.querySelector("#content").innerHTML = ``;
      // display error alert for the user :(
      alert(info.message);
      throw `${info.message}`;
    }else{
    return info;
  }} catch (error) {
    console.log(error);
  }
};

const postInfo = async (url = "", info = {}) => {
  const response = await fetch(url, {
    method: "POST",
    mode:"cors",
    credentials:"same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(info),
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
const updatingInfo = async () => {
  const response = await fetch(server + "/all");
  try {
    const savedData = await response.json();
     let icon = savedData.icon

    document.querySelector("#temp").innerHTML =  savedData.temp + '°F'; // display letter f with the tempreture (fehrenheit)
    document.querySelector('#icon').innerHTML = savedData.icon;
    document.querySelector("#city").innerHTML =  savedData.city;
    document.querySelector("#description").innerHTML = "Description: " + savedData.description;
    document.querySelector("#date").innerHTML = "Date: " + savedData.newDate;
    document.querySelector('#pressure').innerHTML = "Pressure: " + savedData.pressure;
    document.querySelector('#humidity').innerHTML = "Humidity: " + savedData.humidity + "%";
    document.querySelector("#content").innerHTML = "You are " + savedData.feelings;
    changeIcon(icon);

  } catch (error) {
    console.log(error);
  }
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
      weatherIcon.src = "img/rain.png";
      break;
    case "10d":
      weatherIcon.src = "img/rain.png";
      break;
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
