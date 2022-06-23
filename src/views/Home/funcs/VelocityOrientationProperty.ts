import * as Cesium from "cesium";

const VelocityOrientation = (viewer) => {
  //基于太阳位置启用照明
  viewer.scene.globe.enableLighting = true;

  //启用深度测试，使地形后面的东西消失。
  viewer.scene.globe.depthTestAgainstTerrain = true;

  //设置随机数种子以获得一致的结果。
  Cesium.Math.setRandomNumberSeed(3);

  ///设置模拟时间的界限
  const start = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16));
  const stop = Cesium.JulianDate.addSeconds(
    start,
    360,
    new Cesium.JulianDate()
  );

  viewer.clock.startTime = start.clone();
  viewer.clock.stopTime = stop.clone();
  viewer.clock.currentTime = start.clone();
  viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //Loop at the end
  viewer.clock.multiplier = 10;

  viewer.timeline.zoomTo(start, stop);

  //生成具有不同高度的随机圆形图案。
  function computeCirclularFlight(lon, lat, radius) {
    const property = new Cesium.SampledPositionProperty();
    for (let i = 0; i <= 360; i += 45) {
      const radians = Cesium.Math.toRadians(i);
      const time = Cesium.JulianDate.addSeconds(
        start,
        i,
        new Cesium.JulianDate()
      );
      const position = Cesium.Cartesian3.fromDegrees(
        lon + radius * 1.5 * Math.cos(radians),
        lat + radius * Math.sin(radians),
        Cesium.Math.nextRandomNumber() * 500 + 1750
      );
      property.addSample(time, position);

      //Also create a point for each sample we generate.
      viewer.entities.add({
        position: position,
        point: {
          pixelSize: 8,
          color: Cesium.Color.TRANSPARENT,
          outlineColor: Cesium.Color.YELLOW,
          outlineWidth: 3,
        },
      });
    }
    return property;
  }

  //计算实体位置属性。
  const position = computeCirclularFlight(-112.110693, 36.0994841, 0.03);

  //实际创建的实体
  const entity = viewer.entities.add({
    //Set the entity availability to the same interval as the simulation time.
    availability: new Cesium.TimeIntervalCollection([
      new Cesium.TimeInterval({
        start: start,
        stop: stop,
      }),
    ]),

    //使用我们的计算位置
    position: position,

    //Automatically compute orientation based on position movement.
    orientation: new Cesium.VelocityOrientationProperty(position),

    //Load the Cesium plane model to represent the entity
    model: {
      uri: "/ModelBuildingFiles/Cesium_Air.glb",
      minimumPixelSize: 64,
    },

    //Show the path as a pink line sampled in 1 second increments.
    path: {
      resolution: 1,
      material: new Cesium.PolylineGlowMaterialProperty({
        glowPower: 0.1,
        color: Cesium.Color.YELLOW,
      }),
      width: 10,
    },
  });
  viewer.flyTo(entity);
};
export default VelocityOrientation;
