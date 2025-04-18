import puppeteer from "puppeteer";

interface Quote {
  text: string,
  author: string,
  tags: (string|null)[];
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();

  console.log("Iniciando...");
  await page.goto("https://quotes.toscrape.com/login");
  console.log("Preenchendo os campos de login...");

  await page.evaluate(() => {
    function fillInput(selector: string, value: string) {
      const input = document.getElementById(selector) as HTMLInputElement;
      if (input) {
        input.value = value;
      }
    }
    fillInput("username", "Nome teste");
    fillInput("password", "Senha teste");
  });

  page.click("input[type='submit']");
  page.waitForNavigation({
    waitUntil: "load",
  });

  let allQuotes: Quote[] = [];
  
  
  let isButtonEnabled = true;
  while(isButtonEnabled){
  
    await page.waitForSelector(".quote");
    const quotes = await page.evaluate(() => {
      const quoteElements = document.querySelectorAll(".quote");
  
      return Array.from(quoteElements).map((quote) => {
        const text = quote.querySelector(".text")?.textContent || "Texto não encontrado.";
        const author = quote.querySelector('.author')?.textContent || "Autor(a) não encontrado(a).";
        const tags = Array.from(quote.querySelectorAll(".tags .tag")).map(
          (el) => el.textContent
        );
  
        return { text, author, tags };
      });
    });
    allQuotes.push(...quotes);

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
