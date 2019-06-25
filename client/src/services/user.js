import axios from 'axios';

const baseUrl = '/api/users/';

const login = async obj => {
  const response = await axios.post(`${baseUrl}/login`, obj);
  return response.data;
};

export default { login };
