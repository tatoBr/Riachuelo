import { HttpClient, HttpRequest } from "@angular/common/http";


export class Book {
    id: string;
    title: string;
    authors: string[];
    imageURL: string;
    description: string;
    publishedDate: string;
    publisher: string;
    pageCount: number;
    language: string;
    private static API_URL: string = "http://localhost:3000/api"
    constructor(
        id: string,
        title: string,
        authors: string[],
        imageURL: string,
        description: string,
        publishedDate: string,
        publisher: string,
        pageCount: number,
        language: string
    ) {
        this.id = id;
        this.title = title;
        this.authors = authors;
        this.imageURL = imageURL;
        this.description = description;
        this.publishedDate = publishedDate;
        this.publisher = publisher;
        this.pageCount = pageCount;
        this.language = language;
    }

    static sendGetBooksRequest() {
    }
    static async getBooks(
        httpClient: HttpClient,
        keyword?: string,
        startIndex: number = 0,
        maxResults: number = 10
    ) {
        let fetchUrl = `${this.API_URL}/books`;
        let headers = { 'Content-Type': 'application/json' };
        let body = { keyword, startIndex, maxResults };
        let getBooksrequest = new HttpRequest('GET', fetchUrl, { body: body });
        try {
            let data = await httpClient.request<any>(getBooksrequest).toPromise();
            console.log('data', data)
            let books: Book[] = []
            // for (let d of data) {
            //     console.log(d)
            //     let { id, title, authors, description, imageUrl,
            //         publishedDate, publisher, pageCount, language
            //     } = d
            //     books.push(new Book(
            //         id, title, authors, imageUrl, description,
            //         publishedDate, publisher, pageCount, language
            //     ));
            // }
            return books;
        } catch (error) {
            console.log('error', error)
            return []
        }
    }
}