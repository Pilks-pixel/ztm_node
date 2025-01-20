"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_fs_1 = require("node:fs");
var csv_parse_1 = require("csv-parse");
var csvFilePath = "./kepler-data.csv";
var habitablePlanets = [];
var parser = (0, csv_parse_1.parse)({
    comment: "#",
    columns: true,
});
parser.on("readable", function () {
    var record;
    while ((record = parser.read()) !== null) {
        if (isHabitablePlanet(record)) {
            console.log(record);
            habitablePlanets.push(record);
        }
    }
});
parser.on("end", function () {
    console.log("".concat(habitablePlanets.length, " Habitable planet(s) found!"));
    for (var _i = 0, habitablePlanets_1 = habitablePlanets; _i < habitablePlanets_1.length; _i++) {
        var planet = habitablePlanets_1[_i];
        console.log(planet.kepoi_name);
    }
});
(0, node_fs_1.createReadStream)(csvFilePath)
    .pipe(parser)
    .on("error", function (error) {
    console.log(error);
});
function isHabitablePlanet(planet) {
    return (planet["koi_disposition"] === "CONFIRMED" &&
        planet["koi_insol"] > 0.36 &&
        planet["koi_insol"] < 1.11 &&
        planet["koi_prad"] < 1.6);
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
