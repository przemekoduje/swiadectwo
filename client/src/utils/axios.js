import axios from 'axios';

// Utwórz instancję axios z domyślnym URL
const api = axios.create({
  baseURL: 'http://localhost:3001/api', // URL backendu
});

export default api;
