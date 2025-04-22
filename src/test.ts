const puppeteer = require('puppeteer');

interface Author {
  name: String,
  born: String,
  died: String|null,
  genre: String,
  about: String;
};

const login = async (username:any, password:any) => {
  const browser = await puppeteer.launch({
    headless: false,
  })
  const page = await browser.newPage()

  console.log("Iniciando...");
  await page.goto("https://quotes.toscrape.com/login");
  console.log("Preenchendo os campos de login...");
  
  await page.evaluate((username:string, password:string) => {
    function fillInput(selector: string, value: string) {
      const input = document.getElementById(selector) as HTMLInputElement;
      if (input) {
        input.value = value;  
      }
    }
    fillInput("username", username);
    fillInput("password", password);
  }, username, password);

  page.click("a span");

  await page.waitForNavigation({
    waitUntil: "load",
  });

const authorData = await page.evaluate()

};
login("teste","teste");
export default login;
