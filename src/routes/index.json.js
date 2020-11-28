import nodefetch from "node-fetch";
import params from "./secret.json";

export async function get(req, res, next) {
  const response = await nodefetch("https://graphigo.prd.dlive.tv/", params)
    .then((resp) => resp.json())
    .then((body) => body.data || {});

  if (response) {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(response));
  } else {
    next();
  }
}
