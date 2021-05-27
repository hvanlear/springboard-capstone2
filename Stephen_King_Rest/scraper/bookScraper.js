const axios = require("axios");
const $ = require("cheerio");
const bookParse = require("./bookParse");
const seventiesBooks =
  "https://stephenking.fandom.com/wiki/Category:1970s_books";
const baseUrl = "https://stephenking.fandom.com";

//this accepts a url and scrapes that page for elements with the class of category-page__member-link
// it loops through those elements and pushes the href attribuite to the bookLinks array and returns it

//TODO refactor the function to accept an additional parameter specifying what element to search for ie the categor-page_member-link

const getBooks = async (url) => {
  const bookLinks = [];
  try {
    const res = await axios.get(url);
    const htmlParse = $(".category-page__member-link", res.data);
    const totalLinks = htmlParse.length;

    for (let i = 0; i < totalLinks; i++) {
      bookLinks.push(htmlParse[i].attribs.href);
    }
    return bookLinks;
  } catch (err) {
    console.log(err);
  }
};

const makeBooks = async (categoryUrl) => {
  const pathArr = await getBooks(categoryUrl);
  try {
    res = await Promise.all(
      pathArr.map((link) => bookParse(`${baseUrl}${link}`))
    );
    console.log(res);
  } catch (err) {
    console.log(err);
  }
};

makeBooks(seventiesBooks);
