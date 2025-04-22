import { Author } from './author'

export interface Quote {
    text: string,
    authorId: number,
    tags: (string|null)[];
  };