import axios from 'axios';
let cardsGallery = document.querySelector('.gallery');

const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '30552752-3be072d05b9e26cabdad4f15d';

export default class fetchApi {
  constructor() {
    this.searchQuery = '';
    this.perPage = 40;
    this.page = 1;
  }

  async makesRequest() {
    const params = new URLSearchParams({
      key: API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: this.perPage,
    });
    const url = `${BASE_URL}/?${params}`;

    this.incrementPage();

    return await axios.get(url);
  }

  get perPages() {
    return (this.perPage = 40);
  }
  get thisPage() {
    return this.page;
  }
  incrementPage() {
    this.page += 1; //добавлення сторінки з бек при скролі
  }

  resetPage() {
    this.page = 1; //скидання сторінки
  }

  get query() {
    return this.searchQuery;
  }
  //Контроль  запроса
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
