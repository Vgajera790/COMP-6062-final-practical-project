const app = Vue.createApp({
    data() {
    return {
      user: {
        first_name: "",
        last_name: "",
        age: "",
        profile_picture: ""
      },
      weather: {
        city: "London",
        province: "Ontario",
        country: "Canada"
      },
      weatherData: {
        temperature: "",
        wind: "",
        description: "",
        latitude: "",
        longitude: "",
        population: ""
      },
      showWeather: false,

      dictionary: {
        word: ""
      },
      dictionaryResult: {
        word: "",
        phonetic: "",
        definition: ""
      }
    };
  },

  mounted() {
    this.fetchUser();
  },

  methods: {
    fetchUser() {
      fetch("http://comp6062.liamstewart.ca/random-user-profile")
        .then(res => res.json())
        .then(data => this.user = data)
        .catch(err => console.error("User error:", err));
    },

    fetchWeather() {
      const proxy = "https://corsproxy.io/?";
      const { city, province, country } = this.weather;
      const url = `${proxy}http://comp6062.liamstewart.ca/weather-information?city=${city}&province=${province}&country=${country}`;

      fetch(url)
        .then(res => res.json())
        .then(data => {
          this.weatherData.temperature = data.temperature;
          this.weatherData.wind = data.wind_speed;
          this.weatherData.description = data.weather_description;
          this.weatherData.latitude = data.location.latitude;
          this.weatherData.longitude = data.location.longitude;
          this.weatherData.population = data.location.population;
          this.showWeather = true;
        })
        .catch(err => console.error("Weather error:", err));
    },

    fetchDefinition() {
      const word = this.dictionary.word.trim();
      if (!word) return;

      fetch(`https://comp6062.liamstewart.ca/define?word=${word}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            this.dictionaryResult.word = data[0].word;
            this.dictionaryResult.phonetic = data[0].phonetic;
            this.dictionaryResult.definition = data[0].definition;
          } else {
            this.dictionaryResult.word = "Not found";
            this.dictionaryResult.phonetic = "-";
            this.dictionaryResult.definition = "No definition found.";
          }
        })
        .catch(err => {
          console.error("Dictionary API error:", err);
          this.dictionaryResult.word = "Error";
          this.dictionaryResult.phonetic = "-";
          this.dictionaryResult.definition = "Could not fetch data.";
        });
    }
  }
});app.mount('#app')
