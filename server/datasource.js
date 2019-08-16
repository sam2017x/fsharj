const { RESTDataSource } = require("apollo-datasource-rest");

class CountriesAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://restcountries.eu/rest/v2/";
    //this.baseURL = "https://wft-geo-db.p.rapidapi.com/v1/geo/";
  }

  async getAllCountries() {
    /*const temp = await this.get("countries?limit=", undefined, {
      headers: {
        "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
        "x-rapidapi-key": "725dc16711mshb82b0d640fd1243p1febfbjsn804312b8f0d2"
      }
    });*/
    const temp = await this.get("all");
    return temp;
  }

  /*async getACar(plateNumber) {
    const result = await this.get("car", {
      plateNumber
    });

    return result[0];
  }*/
}

class WeatherAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "http://api.apixu.com/v1/";
    this.state = { key: "16fe37087cea4422a8500301191903" };
  }

  async getCurrentWeather(capital) {
    const resp = await this.get(
      `forecast.json?key=${this.state.key}&q=${capital}&days=3`
    );

    return { value: JSON.stringify(resp) };
  }
}

class SpaceAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://api.spacexdata.com/v3";
  }

  async getLaunches() {
    const resp = await this.get("launches");

    return { value: JSON.stringify(resp) };
  }
}

module.exports = {
  CountriesAPI,
  WeatherAPI,
  SpaceAPI
};
