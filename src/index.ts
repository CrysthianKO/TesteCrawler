import puppeteer from "puppeteer";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
dotenv.config();

const username = process.env.LOGIN_USERNAME!;
const password = process.env.LOGIN_PASSWORD!;

// interface Quote {
//   text: string,
//   author: Author,
//   tags: Tags[];
// }

interface Tags {
  name: String,
  quotes:[Quote]
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();

  console.log("Iniciando...");
  await page.goto("https://quotes.toscrape.com/login");
  console.log("Preenchendo os campos de login...");
  
  await page.evaluate((username, password) => {
    function fillInput(selector: string, value: string) {
      const input = document.getElementById(selector) as HTMLInputElement;
      if (input) {
        input.value = value;  
      }
    }
    fillInput("username", username);
    fillInput("password", password);
  }, username, password);

  page.click("input[type='submit']");
  page.waitForNavigation({
    waitUntil: "load",
  });

  let allQuotes: Quote[] = [];
  // Text, author, tags[]//

  let Authors: [];
  let AllTags: Tags [];
  
  let isButtonEnabled = true;
  while(isButtonEnabled){
  
    await page.waitForSelector(".quote");

    let Tags: [];

    const quotes = await page.evaluate(() => {
      const quoteElements = document.querySelectorAll(".quote");
  
      return Array.from(quoteElements).map((quote) => {
        const text = quote.querySelector(".text")?.textContent || "Texto não encontrado.";
        const tags = Array.from(quote.querySelectorAll(".tags .tag")).map(
          (el) => el.textContent
        );
        let authorLink = "exemplo";
        return { text, tags, authorLink };
      });
    });
    console.log(quotes.map( el => (  el.authorLink )));


    const nextButton = await page.$(".next a");
    isButtonEnabled = nextButton !== null;
    if(nextButton){
      await nextButton.click();
    }
  }

  console.log("Saiu while.");

  if (allQuotes.length > 0) {
    console.log("Citações encontradas:", allQuotes);
  } else {
    console.log("Nenhuma citação encontrada.");
  }

  
})();

