import { createReadStream } from "node:fs";
import { parse } from "csv-parse";

var csvFilePath = "./kepler-data.csv";
var habitablePlanets: Planet[] = [];
var parser = parse({
  comment: "#",
  columns: true,
});

type Planet = {
  kepoi_name: string;
  koi_disposition: string;
  koi_insol: number;
  koi_prad: number;
};

parser.on("readable", function () {
  let record: Planet | null;
  while ((record = parser.read()) !== null) {
    if (isHabitablePlanet(record)) {
      console.log(record);
      habitablePlanets.push(record);
    }
  }
});

parser.on("end", function () {
  console.log(`${habitablePlanets.length} Habitable planet(s) found!`);
  for (const planet of habitablePlanets) {
    console.log(planet.kepoi_name);
  }
});

createReadStream(csvFilePath)
  .pipe(parser)
  .on("error", function (error) {
    console.log(error);
  });

function isHabitablePlanet(planet: Planet): boolean {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

// ZTM solution
// fs.createReadStream("kepler_data.csv")
// 	.pipe(
// 		parse({
// 			comment: "#",
// 			columns: true,
// 		})
// 	)
// 	.on("data", data => {
// 		if (isHabitablePlanet(data)) {
// 			habitablePlanets.push(data);
// 		}
// 	})
// 	.on("error", err => {
// 		console.log(err);
// 	});

export { isHabitablePlanet, Planet, parser };