# Stephen King API and Data Scraper

**Authors**: [Hunter Van Lear](https://github.com/hvanlear)


## Overview
This is an open-source API that provides Novela, Short Story, character(*currently limited to villains*), and setting information for the written works of Stephen King. This information is publicly sourced; I do not claim to own.

## Technologies used
[Node.js](https://nodejs.org/en/), [PostGres](https://www.postgresql.org/), [Express](https://www.npmjs.com/package/express), [Jest](https://www.npmjs.com/package/jest), [SuperTest](https://www.npmjs.com/package/supertest), [nodemon](https://www.npmjs.com/package/nodemon), [dotenv](https://www.npmjs.com/package/dotenv), [Node Postgres](https://node-postgres.com/), [morgan](https://www.npmjs.com/package/morgan), [SuperAgent](https://www.npmjs.com/package/superagent), [node-html-parser](https://www.npmjs.com/package/node-html-parser)

## Routes
_All routes are GET routes_
* **GET /api/v1/books** - get all books (default 20 per page / 'enter TOTAL here' total books)
* **GET /api/v1/shorts** - get all short stories (default 20 per page / 'enter TOTAL here' total short stories)
* **GET /api/v1/villains** - get all villians 

## Error Conditions

Any error in query parameter values will likely respond with an empty array `[]` as a response. Double-check the parameters and ask for help if you think something isn't working properly.


## Getting Started
I welcome any and all contributions! Feel free to submit a Pull Request with your changes to make this a better API for everyone!

1. Clone and download [GitHub repo]
1. Install dependencies:\
`npm i`

## License
Standard [MIT](/LICENSE.md)
