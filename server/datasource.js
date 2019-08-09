const { RESTDataSource } = require("apollo-datasource-rest");

class CountriesAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://restcountries.eu/rest/v2/";
  }

  async getAllCountries() {
    return this.get("all");
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
