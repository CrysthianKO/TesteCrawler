import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36"
  );

  await page.goto(
    "https://www.goodreads.com/author/show/9810.Albert_Einstein",
    { waitUntil: "load" }
  );

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

  console.log(author);
})();
