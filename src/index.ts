import puppeteer from "puppeteer";

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();

    console.log('Iniciando...')
    await page.goto("https://quotes.toscrape.com/login");

    console.log("waitfor navitaion");

    await page.evaluate(() => {
        console.log("entrou evaluate")
        function fillInput(selector: string, value: string ){
            const input = document.getElementById(selector) as HTMLInputElement;
            if (input) {
                input.value = value;
            }
        }
        console.log("teste");
        fillInput('username', 'Nome teste');
        fillInput('password', 'Senha teste');
      });

      page.click("input[type='submit']");

      
    

})();