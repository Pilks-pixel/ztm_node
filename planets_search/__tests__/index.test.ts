import { isHabitablePlanet, Planet, parser } from "../index.ts";
import test from "node:test";
import { strict as assert } from "node:assert/strict";
import { Readable } from "node:stream";

var planet: Planet = {
  kepoi_name: "K07016.01",
  koi_disposition: "CONFIRMED",
  koi_prad: 1.09,
  koi_insol: 0.56,
};

var csvData = `kepoi_name,koi_disposition,koi_prad,koi_insol
K07016.01,CONFIRMED,1.09,0.56
K02626.01,CONFIRMED,1.58,0.81
K03010.01,CONFIRMED,1.39,0.84`;

test("should return true if planet object is habitable", function () {
  assert.strictEqual(isHabitablePlanet(planet), true);
});

test("should return array of habitable planets", async function () {
  const habitablePlanets: Planet[] = [];

  await new Promise((resolve, reject) => {
    Readable.from(csvData)
      .pipe(parser)
      .on("readable", function () {
        let record: Planet | null;
        while ((record = parser.read()) !== null) {
          if (isHabitablePlanet(record)) {
            habitablePlanets.push(record);
          }
        }
      })
      .on("end", function () {
        try {
          resolve(null);
          assert.strictEqual(habitablePlanets.length, 2);
        } catch (error) {
          reject(error);
        }
      })
      .on("error", function (error) {
        reject(error);
      });
  });
});
