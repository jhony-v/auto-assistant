const Bree = require("bree");
const Cabin = require("cabin");
require("./data/timezone");
require("./data/channel");

const bree = new Bree({
  logger: new Cabin(),
  jobs: [
    {
      name: "reminder",
      path: "./jobs/reminder.mjs",
      interval: "1m",
    },
  ],
});

bree.start();
