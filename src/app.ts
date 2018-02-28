import express from "express";
import scriptsParser from "./parsers/script";
import bodyParser from "body-parser";
const app = express();

const parseArray = (text: string = "") => {
  const split = text.split(",");
  const result: Array<string> = split.map((item: string) => {
    return item.trim();
  });
  return result;
};

const xmlParser = bodyParser.text({
  type: "application/xml",
  limit: "1000000kb"
});

app.post("/scripts", xmlParser, (req, res) => {
  const folderFilterList = req.query.folderFilter;
  const folderFilter = parseArray(folderFilterList);
  const xml = req.body;
  const result = scriptsParser(xml, ["API", "Public"]);
  res.json(result);
});

export default app;
