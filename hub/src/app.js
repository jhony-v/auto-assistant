import Bree from "bree";
import Cabin from "cabin";
import path from "path"
import "./data/channel";

const bree = new Bree({
  logger: new Cabin(),
  root: path.join(__dirname,"jobs"),
  jobs: [
    {
      name: "reminder",
      interval: "1m",
    },
  ],
});

bree.start();
