import sirv from "sirv";
import * as polka from "polka";
import * as compression from "compression";
import * as sapper from "@sapper/server";
import { json } from "body-parser";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";

polka() // You can also use Express
  .use(
    compression({ threshold: 0 }),
    sirv("static", { dev }),
    sapper.middleware()
  )
  .use(json())
  .listen(PORT, (err) => {
    if (err) console.log("error", err);
  });
