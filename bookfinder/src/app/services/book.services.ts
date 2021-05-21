export class BookService {

  private API_URL = "http://localhost:3000";

  constructor() { }

  fetchBooks = async (query: string, page: number) => {
    let fetchURL = `${this.API_URL}/api/books?q=${query}&page=${page}`;
    console.log(fetchURL)
    try {
      let response = await fetch(fetchURL);
      let data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  fetchBook = async (id: string) => {
    let fetchURL = `${this.API_URL}/api/books/${id}`;
    console.log(fetchURL);
    try {
      let response = await fetch(fetchURL);
      let data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  favorireBook = async (id: string) => {
    let fetchURL = `${this.API_URL}/api/books/favorites/${id}`;
    let headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}` || 'Bearer '
    };
    console.log(localStorage.getItem('token'))
    let options = {
      method: 'POST',
      headers
    }
    try {
      let response = await fetch(fetchURL, options);
      let data = await response.json();
      console.log( 'data', data );
    } catch (error) {
      throw error;
    }
  }
}