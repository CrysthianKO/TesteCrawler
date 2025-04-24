import { PrismaClient } from "../generated/prisma";
import Tags from "../interfaces/tagsInterface";

const prisma = new PrismaClient();

const findTag = async (data: Tags) => {
    return await prisma.tag.findUnique({
        where: {
            name: data.name,
        }
    })
}

const createTag = async (data: Tags) => {

    const tagExists = await findTag(data);

    if(tagExists) {
        return tagExists;
    } else {
        return await prisma.tag.create({
            data: {
                name: data.name,
            }
        })
    }
}

export {
    createTag,
};