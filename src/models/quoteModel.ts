import { PrismaClient } from "../generated/prisma" 
import { findAuthor, createAuthor } from "./authorModel";
import { createTag } from "./tagsModel";
import Quote from "../interfaces/quoteInterface";
import Author from "../interfaces/authorInterface";
import Tags from "../interfaces/tagsInterface";

const prisma = new PrismaClient();

const testeQuote: Quote = {
    text: "tdasdsadasdasto",
    tags: ["tag1","tag2","tag3"],
    authorId: 1231
}

const testeAuthor: Author = {
    name: "nome",
    birth: "in Ulm, kingdom of Württemberg, German empireMarch 14, 1879",
    death: null,
    genre: "Science Philosophy Physics",
    about: "sobre",
    quotes: [],
  }

const testeTags: Tags = {
    name: "romance",
    quotes: []
}


const createQuote = async (dataQuote: Quote, dataAuthor: Author, dataTags: Tags) => {

    const authorExists = await findAuthor(dataAuthor.name, dataAuthor.birth);
    let authorId: number;

    if(!authorExists) {
        authorId = (await createAuthor(dataAuthor)).id;
    } else {
        authorId = authorExists.id;
    }
    const { text } = dataQuote;

    const tagName = (await createTag(dataTags)).name;

    return await prisma.quote.create({
        data: {
            text: text,
            author: { connect: {id: authorId}}, 
            tags: {
                connect: [ {
                    name: tagName
                }]
            }
        },
        include: { tags: true}
    });
}

export {
    createQuote
};

// Teste
// (async() => {
//     try {
//         const criado = await createQuote(testeQuote, testeAuthor, testeTags);
//         console.log("teste")
//         console.log(criado);
//     } catch (error) {
//         console.log("teste error")
//         console.log(error);
//     }
// })();