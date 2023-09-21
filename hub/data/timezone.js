const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
const format = require('dayjs/plugin/customParseFormat');
const isBetween = require('dayjs/plugin/isBetween');

dayjs.extend(isBetween);
dayjs.extend(format);
dayjs.extend(duration);
