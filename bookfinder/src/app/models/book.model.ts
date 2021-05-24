export class Book {
    id: string;
    title: string;
    private _authorsArr: string[];
    imageURL: string;
    description: string;
    publishedDate: string;
    publisher: string;
    pageCount: number;
    language: string;

    static mapBook( data: any ){
      let id = data['id'];
      let title = data['title'];
      let authors = data['authors'];
      let imageURL = data['imageURL'];
      let description = data['description'];
      let publishedDate = data['publishedDate'];
      let publisher = data['publisher'];
      let pageCount = data['pageCount'];
      let language = data['language'];

      return new Book( id, title, authors, imageURL, description, publishedDate, publisher, pageCount, language );
    }

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
        this._authorsArr = authors;
        this.imageURL = imageURL;
        this.description = description;
        this.publishedDate = publishedDate;
        this.publisher = publisher;
        this.pageCount = pageCount;
        this.language = language;
    }

    get authors(){
      if( !this._authorsArr || !Array.isArray( this._authorsArr ))
        return '';

      let authorsStr: string = ''
      let lastIndex = this._authorsArr.length - 1;
      for( let idx = 0; idx < this._authorsArr.length; idx++ ){
        let author = this._authorsArr[idx];
        authorsStr += idx !== lastIndex ? `${ author }, `:`${ author }.`
      }
      return authorsStr;
    }

    
}