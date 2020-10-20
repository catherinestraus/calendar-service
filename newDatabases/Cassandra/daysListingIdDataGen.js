/* eslint-disable no-console */
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const faker = require("faker");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const days_by_listing_id = (num) => {
  let days = [];
  let day_id = 0;

  const getLastDay = function (yy, mm) {
    return new Date(yy, mm + 1, 0).getDate();
  };

  for (i = 1; i <= num; i++) {
    for (let month = 1; month <= 12; month += 1) {
      const startDay = dayjs()
        .startOf("month")
        .add(month - 1, "month")
        .toDate();
      const startMonth = startDay.getMonth();
      const startYear = startDay.getFullYear();
      const lastDay = getLastDay(startYear, startMonth);

      for (let day = 1; day <= lastDay; day += 1) {
        day_id = day_id + 1;
        const newDay = dayjs(startDay)
          .utc()
          .add(day - 1, "day")
          .add(6, "hours")
          .format("YYYY-MM-DD");
        const date = {
          day_id: day_id,
          listing_id: i,
          date: newDay,
          booked: faker.random.boolean(),
          price: Math.floor(faker.random.number({ min: 75, max: 450 })),
          minimum_nights: 1,
        };
        days.push(date);
      }
    }
  }
  return days;
};

const csvWriter = createCsvWriter({
  path: "./newDatabases/Cassandra/CSV/daysByListingId.csv",
  header: [
    { id: "day_id", title: "day_id" },
    { id: "listing_id", title: "listing_id" },
    { id: "date", title: "date" },
    { id: "booked", title: "booked" },
    { id: "price", title: "price" },
    { id: "minimum_nights", title: "minimum_nights" },
  ],
});

let dayDump = days_by_listing_id(3);

csvWriter.writeRecords(dayDump).then(() => {
  console.log("Done!");
});
