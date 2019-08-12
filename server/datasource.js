const { RESTDataSource } = require("apollo-datasource-rest");
const axios = require("axios");

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

module.exports = {
  CountriesAPI
};
