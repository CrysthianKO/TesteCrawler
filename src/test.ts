const puppeteer = require("puppeteer");

interface QuotesQuery {
  text: string;
  tags: string[];
  authorLink: string;
  authorName: string;
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36"
  );

  console.log("Iniciando...");
  await page.goto("https://quotes.toscrape.com/login");
  console.log("Preenchendo os campos de login...");

  await page.evaluate((username: string, password: string) => {
    function fillInput(selector: string, value: string) {
      const input = document.getElementById(selector) as HTMLInputElement;
      if (input) {
        input.value = value;
      }
    }
    fillInput("username", "teste");
    fillInput("password", "passwr");
  });

  page.click("input[type='submit']");
  page.waitForNavigation({
    waitUntil: "load",
  });

  // Logica para conseguir os dados
  await page.waitForNavigation({
    waitUntil: "load",
  });

  let quotes: QuotesQuery[] = [];
  let isButtonEnabled = true;

  // while(isButtonEnabled){

  //   await page.waitForSelector(".quote");

  //   quotes = await page.evaluate(() => {
  //     const quoteElements = document.querySelectorAll(".quote");

  //     return Array.from(quoteElements).map((quote) => {
  //       const text = quote.querySelector(".text")?.textContent || "Texto não encontrado.";
  //       const tags = Array.from(quote.querySelectorAll(".tags .tag")).map(
  //         (el) => el.textContent
  //       );
  //       const authorName = quote.querySelector(".author")?.textContent || "Autor não encontrado.";
  //       const authorLink = Array.from(quote.querySelectorAll("a")).find(
  //         (el) => el.textContent?.trim() === "(Goodreads page)"
  //       )?.getAttribute("href") || "Link não encontrado.";

  //       return { text, tags, authorLink, authorName };
  //     });
  //   });

  //   const nextButton = await page.$(".next a");
  //   isButtonEnabled = nextButton !== null;
  //   if(nextButton){
  //     await nextButton.click();
  //   }

  //   console.log(quotes);
  // }

  quotes = await page.evaluate(() => {
    const quoteElements = document.querySelectorAll(".quote");

    return Array.from(quoteElements).map((quote) => {
      const text =
        quote.querySelector(".text")?.textContent || "Texto não encontrado.";
      const tags = Array.from(quote.querySelectorAll(".tags .tag")).map(
        (el) => el.textContent
      );
      const authorName =
        quote.querySelector(".author")?.textContent || "Autor não encontrado.";
      const authorLink =
        Array.from(quote.querySelectorAll("a"))
          .find((el) => el.textContent?.trim() === "(Goodreads page)")
          ?.getAttribute("href") || "Link não encontrado.";

      return { text, tags, authorLink, authorName };
    });
  });

  console.log(quotes);

  const authorLinks = quotes.map((quote) => quote.authorLink);
  const filteredLinks = authorLinks.filter(
    (link, i) => authorLinks.indexOf(link) === i
  );

  const authorList = [];

  for (const link of authorLinks) {
    try {
      await page.goto(link, { waitUntil: "load" });

      const author = await page.evaluate(() => {
        const birth =
          document.querySelector('[itemprop="birthDate"]')?.textContent?.trim() ||
          "Data de nascimento não encontrada.";
        const death =
          document.querySelector('[itemprop="deathDate"]')?.textContent?.trim() ||
          "Data de falecimento não encontrada.";
        const genre = Array.from(document.querySelectorAll('a[href^="/genres/'))
          .filter((el) => !el.classList.contains("genreList__genreLink"))
          .map((el) => el.textContent?.trim() || "Gênero não encontrado.");
        const about =
          document.querySelector("#freeTextContainerauthor9810")?.textContent ||
          "Sobre o autor não encontrado.";
        return { birth, death, genre, about };
      });

      authorList.push(author);
    } catch (error) {
      console.error(`Erro ao navegar para ${link}:`, error);
    }
  }
  
  console.log(authorList);
})();
