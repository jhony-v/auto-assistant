import Bree from "bree";
import Cabin from "cabin";
import "./data/channel";

const bree = new Bree({
  logger: new Cabin(),
  jobs: [
    {
      name: "reminder",
      path: "./jobs/reminder.js",
      interval: "1m",
    },
  ],
});

bree.start();
