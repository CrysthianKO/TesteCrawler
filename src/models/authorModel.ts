import { PrismaClient } from "../generated/prisma" 

const prisma = new PrismaClient();

const findAuthor = async (name: string, born: string) => {
  await prisma.author.findFirst({
    where: { 
      name: name,
      birth: born,
    }
  })
}

const createAuthor = async (data: Author) => {
    const { name, birth, death, genre, about } = data;

    return await prisma.author.create({
        data: {
            name: name,
            birth: birth,
            death: death,
            genre: genre,
            about: about
        },
      })
};

interface Author {
    name: string,
    birth: string,
    death: string|null,
    genre: string,
    about: string,
    quotes: [Quote],
  }

interface Quote {
    text: string,
    author: Author,
    authorId: number,
    tags: (string|null)[];
  };

export {
  findAuthor,
  createAuthor
};