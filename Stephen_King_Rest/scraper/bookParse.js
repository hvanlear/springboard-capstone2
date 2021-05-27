const $ = require("cheerio");
const axios = require("axios");

let sampleT =
  "one for the Road is a short story written by Stephen King. The story was originally published in the March/April 1977 issue of Maine Magazine,";

const splitter = (text) => {
  const split = text.split(" ");
  // const filteredParts = split.filter((part) => {
  //   return part === words;
  // });
  for (i = 0; i < text.length; i++) {}
  console.log(split);
};

splitter(sampleT);

//this scrapes a single page and returns an object with requested data
const bookParse = async (url) => {
  try {
    const res = await axios.get(url);
    const firstPara = $(".mw-parser-output > p", res.data).text();
    const bookTitle = $("#firstHeading", res.data).text();
    // const pubDate = $(".mw-parser-output > p", res.data).text().match(/\d+/g)[0];
    const pubDateIndex = firstPara.indexOf("19");
    const date = firstPara.slice(pubDateIndex, pubDateIndex + 4);

    //split the paragraph

    //grab the index starting with Published + 3

    return {
      title: bookTitle,
      publishYear: date,
    };
  } catch (err) {
    console.log(err);
  }
};

// bookParse("https://stephenking.fandom.com/wiki/One_for_the_Road");

module.exports = bookParse;
