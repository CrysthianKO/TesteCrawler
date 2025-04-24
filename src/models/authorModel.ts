import { PrismaClient } from "../generated/prisma";
import Author from "../interfaces/authorInterface";

const prisma = new PrismaClient();

const findAuthor = async (name: string) => {
  return await prisma.author.findFirst({
    where: {
      name: name,
    },
  });
};

const createAuthor = async (data: Author) => {
  const authorExists = await findAuthor(data.name);

  if (authorExists) {
    return authorExists;
  } else {
    const author = {
      name: data.name,
      birth: data.birth,
      death: data.death,
      genre: data.genre,
      about: data.about,
    };
    return await prisma.author.create({
      data: author,
    });
  }
};

export { findAuthor, createAuthor };
