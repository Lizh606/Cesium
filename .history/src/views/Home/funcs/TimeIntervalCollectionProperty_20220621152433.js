import * as Cesium from "cesium";

const TimeIntervalCollection =(viewer)=>{
    const blueBox = viewer.entities.add({
        name: "Blue box",
        position: Cesium.Cartesian3.fromDegrees(-114.0, 40.0, 300000.0),
        box: {
          dimensions: new Cesium.Cartesian3(400000.0, 300000.0, 500000.0),
          material: Cesium.Color.BLUE,
          outline: true,
        },
      });
  viewer.flyTo(blueBox);

    let property = new Cesium.TimeIntervalCollectionProperty(Cesium.Cartesian3);
    
    
    property.intervals.addInterval(
        new Cesium.TimeInterval({
            start: Cesium.JulianDate.addSeconds(
                Cesium.JulianDate.fromDate(new Date()),
                2,
                new Cesium.JulianDate()
            ),
            stop: Cesium.JulianDate.addSeconds(
                Cesium.JulianDate.fromDate(new Date()),
                20,
                new Cesium.JulianDate()
            ),
            isStartIncluded:true,
            isStopIncluded:false,
            data: new Cesium.Cartesian3(1000.0, 1000.0, 1000.0),
        })
    );
    property.intervals.addInterval(
        new Cesium.TimeInterval({
            start: Cesium.JulianDate.addSeconds(
                Cesium.JulianDate.fromDate(new Date()),
                6,
                new Cesium.JulianDate()
            ),
            stop: Cesium.JulianDate.addSeconds(
                Cesium.JulianDate.fromDate(new Date()),
                20,
                new Cesium.JulianDate()
            ),
            isStartIncluded:true,
            isStopIncluded:false,
            data: new Cesium.Cartesian3(2000.0, 2000.0, 2000.0),
        })
    );
    property.intervals.addInterval(
        new Cesium.TimeInterval({
            start: Cesium.JulianDate.addSeconds(
                Cesium.JulianDate.fromDate(new Date()),
                10,
                new Cesium.JulianDate()
            ),
            stop: Cesium.JulianDate.addSeconds(
                Cesium.JulianDate.fromDate(new Date()),
                20,
                new Cesium.JulianDate()
            ),
            isStartIncluded:true,
            isStopIncluded:true,
            data: new Cesium.Cartesian3(3000.0, 3000.0, 3000.0),
        })
    );
    
    blueBox.box.dimensions = property;
}
export default TimeIntervalCollection;