import Quote from "./quoteInterface";

export default interface Author {
    name: string,
    birth: string,
    death: string|null,
    genre: string,
    about: string,
    quotes: Quote[],
  }