// Creating a new date instance dynamically with JS
let d = new Date();
let newDate = d.toDateString();

// The URL to retrieve weather information from API (country is by default = US)
const baseURL = "https://api.openweathermap.org/data/2.5/weather?zip=";

// Personal API Key for OpenWeatherMap API + we used "imperial" to get the Temperature in Fehrenheit
const apiKey = ",&appid=11f9f82d71e00a3eccdc9db4975a46d4&units=imperial";

// Server's URL
const server = "http://localhost:4000";

const fetchData = () => {
  const zipCode = document.getElementById("zipCode").value;
  const feelings = document.getElementById("feelings").value;

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
        description,
        feelings,
      };

      postInfo(server + "/add", info);

      updatingInfo();
      document.getElementById('title').style.padding = "10px 10px 50px 10px";
    }
  });
};

// add function to existing HTML DOM element
document.getElementById("search").addEventListener("click", fetchData);

// Function to GET Web API info
const getWeatherInfo = async (zipCode) => {
  try {
    const response = await fetch(baseURL + zipCode + apiKey);
    const info = await response.json();

    if (info.cod != 200) {
      // display error alert for the user :(
      alert(info.message);
      throw `${info.message}`;
    }

    return info;
  } catch (error) {
    console.log(error);
  }
};

const postInfo = async (url = "", info = {}) => {
  const response = await fetch(url, {
    method: "POST",
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
    document.getElementById("date").innerHTML = savedData.newDate;
    document.getElementById("city").innerHTML = savedData.city;
    document.getElementById("temp").innerHTML = savedData.temp + '&degF'; // display letter f with the tempreture (fehrenheit)
    document.getElementById("description").innerHTML = savedData.description;
    document.getElementById("content").innerHTML = savedData.feelings;
  } catch (error) {
    console.log(error);
  }
};
