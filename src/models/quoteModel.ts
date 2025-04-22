import { PrismaClient } from "../generated/prisma" 
import { findAuthor, createAuthor } from "./authorModel";
// import { Quote } from "../interfaces/quote";

const prisma = new PrismaClient();

const createQuote = async (dataQuote: Quote, dataAuthor: Author) => {

    const authorExists = await findAuthor(dataAuthor.name, dataAuthor.birth);
    
    if(authorExists!) {
        const author = await createAuthor(dataAuthor);

    }

    const { text, authorId, tags } = dataQuote;

    await prisma.quote.create({
        data: {
            text: text,
            authorId: authorId,
            tags: tags?null
        }
    })
}

export interface Quote {
    text: string,
    authorId: number,
    tags: (string|null)[];
  };

export interface Author {
    name: string,
    birth: string,
    death: string|null,
    genre: string,
    about: string,
    quotes: [Quote],
  }