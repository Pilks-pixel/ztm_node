import { createReadStream } from "node:fs";
import { parse } from "csv-parse";

var csvFilePath = "./kepler-data.csv";
var habitablePlanets = [];
var parser = parse({
	comment: "#",
	columns: true,
});

parser.on("readable", function () {
	let record;
	while ((record = parser.read()) !== null) {
		if (isHabitablePlanet(record)) {
			habitablePlanets.push(record);
		}
	}
});

parser.on("end", function () {
	console.log(`${habitablePlanets.length} Habitable planet(s) found!`);
	for (let planet of habitablePlanets) {
		console.log(planet.kepoi_name);
	}
});

createReadStream(csvFilePath)
	.pipe(parser)
	.on("error", function (error) {
		console.log(error);
	});

function isHabitablePlanet(planet) {
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