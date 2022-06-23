import * as Cesium from "cesium";

const BoxCallback = (viewer) => {
  let nowDate = new Date().toJSON();
  const box = viewer.entities.add({
    name: "box",
    position: Cesium.Cartesian3.fromDegrees(121.54035, 38.92146, 2000),
    box: {
      dimensions: new Cesium.Cartesian3(1000.0, 1000.0, 1000.0),
    },
  });
  viewer.flyTo(box);
  let l = 2000.0;
  box.box.dimensions = new Cesium.CallbackProperty(function (time, result) {
    result = result || new Cesium.Cartesian3(0, 0, 0);

    l += 20.0;
    if (l > 7000.0) {
      l = 2000.0;
    }

    result.x = 4000.0;
    result.y = 3000.0;
    result.z = l;
    return result;
  }, false);
  box.box.material = new Cesium.ColorMaterialProperty(
    new Cesium.CallbackProperty(function () {
      return Cesium.Color.fromRandom({
        alpha: 1.0,
      });
    }, false)
  );
  //BoxCallbackProperty
  //   var property = new Cesium.TimeIntervalCollectionProperty(Cesium.Cartesian3);

  //   property.intervals.addInterval(Cesium.TimeInterval.fromIso8601({
  //     iso8601 : '2022-06-22T00:00:00.00Z/2022-06-22T12:00:00.00Z',
  //     isStartIncluded : true,
  //     isStopIncluded : false,
  //     data : new Cesium.Cartesian3(400000.0, 300000.0, 200000.0)
  //   }));

  //   property.intervals.addInterval(Cesium.TimeInterval.fromIso8601({
  //     iso8601 : '022-06-22T12:00:01.00Z/022-06-22T00:00:00.00Z',
  //     isStartIncluded : true,
  //     isStopIncluded : false,
  //     data : new Cesium.Cartesian3(400000.0, 300000.0, 00000.0)
  //   }));
  //   let result = property.getValue(Cesium.JulianDate.fromIso8601(nowDate));
  //   console.log(result);
  //   let property = new Cesium.TimeIntervalCollectionProperty(Cesium.Cartesian3);

  //   property.intervals.addInterval(
  //     new Cesium.TimeInterval({
  //       start: Cesium.JulianDate.addSeconds(
  //         Cesium.JulianDate.fromDate(nowDate),
  //         2,
  //         new Cesium.JulianDate()
  //       ),
  //       stop: Cesium.JulianDate.addSeconds(
  //         Cesium.JulianDate.fromDate(nowDate),
  //         20,
  //         new Cesium.JulianDate()
  //       ),
  //       isStartIncluded: true,
  //       isStopIncluded: false,
  //       data: new Cesium.Cartesian3(1000.0, 1000.0, 1000.0),
  //     })
  //   );
  //   property.intervals.addInterval(
  //     new Cesium.TimeInterval({
  //       start: Cesium.JulianDate.addSeconds(
  //         Cesium.JulianDate.fromDate(nowDate),
  //         6,
  //         new Cesium.JulianDate()
  //       ),
  //       stop: Cesium.JulianDate.addSeconds(
  //         Cesium.JulianDate.fromDate(nowDate),
  //         20,
  //         new Cesium.JulianDate()
  //       ),
  //       isStartIncluded: true,
  //       isStopIncluded: false,
  //       data: new Cesium.Cartesian3(2000.0, 2000.0, 2000.0),
  //     })
  //   );
  //   property.intervals.addInterval(
  //     new Cesium.TimeInterval({
  //       start: Cesium.JulianDate.addSeconds(
  //         Cesium.JulianDate.fromDate(nowDate),
  //         10,
  //         new Cesium.JulianDate()
  //       ),
  //       stop: Cesium.JulianDate.addSeconds(
  //         Cesium.JulianDate.fromDate(nowDate),
  //         20,
  //         new Cesium.JulianDate()
  //       ),
  //       isStartIncluded: true,
  //       isStopIncluded: true,
  //       data: new Cesium.Cartesian3(3000.0, 3000.0, 3000.0),
  //     })
  //   );
  //   let result = property.getValue(Cesium.JulianDate.fromIso8601(nowDate));
  //   console.log(result);
  //   box.box.dimensions = property;
};
const LineCallback = (viewer) => {
  let yellowLine = viewer.entities.add({
    name: "Red line on the surface",
    polyline: {
      positions: new Cesium.CallbackProperty(getEndPoint, false),
      width: 2,
      material: Cesium.Color.YELLOW,
    },
  });
  yellowLine.polyline.material = new Cesium.ColorMaterialProperty(
    new Cesium.CallbackProperty(function () {
      return Cesium.Color.fromRandom({
        alpha: 1.0,
      });
    }, false)
  );
  viewer.flyTo(yellowLine);
};
let startLatitude = 35;
let startLongitude = 120;
let endLongitude;
let startTime = Cesium.JulianDate.now();

const getEndPoint = (time, result) => {
  endLongitude =
    startLongitude -
    0.001 * Cesium.JulianDate.secondsDifference(time, startTime);
  return Cesium.Cartesian3.fromDegreesArray(
    [startLongitude, startLatitude, endLongitude, startLatitude],
    Cesium.Ellipsoid.WGS84,
    result
  );
};
export { BoxCallback, LineCallback };
