import * as Cesium from "cesium";

const TimeIntervalCollection = (viewer) => {
    debugger;
    let nowDate = new Date().toJSON();
    const box = viewer.entities.add({
        name: "box",
        position: Cesium.Cartesian3.fromDegrees(121.54035, 38.92146, 2000),
        box: {
            dimensions: new Cesium.Cartesian3(1000.0, 1000.0, 1000.0),
        },
    });
  viewer.flyTo(box);

  let property = new Cesium.TimeIntervalCollectionProperty(Cesium.Cartesian3);

  property.intervals.addInterval(
    new Cesium.TimeInterval({
      start: Cesium.JulianDate.addSeconds(
        Cesium.JulianDate.fromDate(nowDate),
        2,
        new Cesium.JulianDate()
      ),
      stop: Cesium.JulianDate.addSeconds(
        Cesium.JulianDate.fromDate(nowDate),
        20,
        new Cesium.JulianDate()
      ),
      isStartIncluded: true,
      isStopIncluded: false,
      data: new Cesium.Cartesian3(1000.0, 1000.0, 1000.0),
    })
  );
  property.intervals.addInterval(
    new Cesium.TimeInterval({
      start: Cesium.JulianDate.addSeconds(
        Cesium.JulianDate.fromDate(nowDate),
        6,
        new Cesium.JulianDate()
      ),
      stop: Cesium.JulianDate.addSeconds(
        Cesium.JulianDate.fromDate(nowDate),
        20,
        new Cesium.JulianDate()
      ),
      isStartIncluded: true,
      isStopIncluded: false,
      data: new Cesium.Cartesian3(2000.0, 2000.0, 2000.0),
    })
  );
  property.intervals.addInterval(
    new Cesium.TimeInterval({
      start: Cesium.JulianDate.addSeconds(
        Cesium.JulianDate.fromDate(nowDate),
        10,
        new Cesium.JulianDate()
      ),
      stop: Cesium.JulianDate.addSeconds(
        Cesium.JulianDate.fromDate(nowDate),
        20,
        new Cesium.JulianDate()
      ),
      isStartIncluded: true,
      isStopIncluded: true,
      data: new Cesium.Cartesian3(3000.0, 3000.0, 3000.0),
    })
  );
//   let result = property.getValue(Cesium.JulianDate.fromIso8601(nowDate));
//   console.log(result);
  box.box.dimensions = property;
};
export default TimeIntervalCollection;
