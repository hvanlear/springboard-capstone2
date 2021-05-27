const axios = require("axios");
const { html } = require("cheerio");
// var cheerio = require("cheerio");

const $ = require("cheerio");
const cheerioTableparser = require("cheerio-tableparser");

// const bookParse = require("./bookParse");

const WIKI_URL = "https://en.wikipedia.org/wiki/Stephen_King_bibliography";

const createBookObject = (bookDataArray) => {
  const keys = ["publishYear", "title", "publisher", "isbn", "pages", "notes"];
};

const getBooks = async (url) => {
  const scrapedBooks = [];
  try {
    const res = await axios.get(url);
    const htmlParse = $(
      "#mw-content-text > div.mw-parser-output > table:nth-child(6) > tbody > tr",
      res.data
    );
    //delete all new line's
    // let filtData = [];
    // for (let i = 0; i < htmlParse.length; i++) {
    //   filtData.push(
    //     htmlParse[i].children.filter((child) => child.data !== "\n")
    //   );
    // }
    // htmlParse[i].children[5].attribs["rowspan"]

    // console.log(
    //   `****************************`,
    //   // htmlParse[1].children[5].children[0].attribs["title"],
    //   htmlParse.find("tr").text(),
    //   `****************************`
    // );

    // console.log(`****************************`, htmlParse[1].chil);

    // htmlParse.each((index, el) => {
    //   console.log($(el).find("th").text());
    //   scrapedBooks.push(
    //     $(el)
    //       .text()
    //       .split("\n")
    //       .filter((item) => item.trim().length > 0)
    //   );
    // });

    let headers = [];
    htmlParse.each((index, el) => {
      headers.push(
        $(el)
          .find("th")
          .text()
          .split("\n")
          .filter((item) => item.length)
      );
    });
    headers = headers[0];

    let data = [];

    htmlParse.each((index, el) => {
      let item = $(el).find("td");
      item.attr("rowspan") ? data.push(item.get()) : data.push("NOT FOUND");
    });

    console.log(data);

    // for (i = 0; i < scrapedBooks.length; i++) {
    //   const publishYear = scrapedBooks[i][0];
    //   console.log(publishYear);
    // }

    //   return bookLinks;
  } catch (err) {
    console.log(err);
  }
};

getBooks(WIKI_URL);
