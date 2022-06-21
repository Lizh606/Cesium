import * as Cesium from "cesium";

const tank = function (viewer) {
  //Make sure viewer is at the desired time.
  const start = Cesium.JulianDate.fromDate(new Date(2018, 11, 12, 15));
  const totalSeconds = 3;
  const stop = Cesium.JulianDate.addSeconds(
    start,
    totalSeconds,
    new Cesium.JulianDate()
  );
  viewer.clock.startTime = start.clone(); //开始时间
  viewer.clock.stopTime = stop.clone();//结束时间
  viewer.clock.currentTime = start.clone();//当前时间
  viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;//确定 Clock＃startTime 或 Clock时时钟的行为#stopTime 到达。
  viewer.timeline.zoomTo(start, stop); //时间轴是用于显示和控制当前场景时间的小部件。

  // 通过在两个位置之间移动，为我们的车辆创建路径。
  const position = new Cesium.SampledPositionProperty();
  const startPosition = new Cesium.Cartesian3(
    -2379556.799372864,
    -4665528.205030263,
    3628013.106599678
  );
  const endPosition = new Cesium.Cartesian3(
    -2379603.7074103747,
    -4665623.48990283,
    3627860.82704567
  );
  // “速度向量”（velocity vector）属性将为我们提供实体在任何给定时间的速度和方向。
  //VelocityVectorProperty将速度转成Cartesian3向量
  const velocityVectorProperty = new Cesium.VelocityVectorProperty(
    position,
    false
  );
  const velocityVector = new Cesium.Cartesian3();
  // 将车轮随时间的旋转存储在SampledProperty中。
  const wheelAngleProperty = new Cesium.SampledProperty(Number);
  let wheelAngle = 0;

  const numberOfSamples = 100;
  for (let i = 0; i <= numberOfSamples; ++i) {
    const factor = i / numberOfSamples;
    const time = Cesium.JulianDate.addSeconds(
      start,
      factor * totalSeconds,
      new Cesium.JulianDate()
    );
    // Lerp使用非线性系数，使车辆加速。
    const locationFactor = Math.pow(factor, 2);
    const location = Cesium.Cartesian3.lerp(
      startPosition,
      endPosition,
      locationFactor,
      new Cesium.Cartesian3()
    );
    position.addSample(time, location);
    // 根据车辆在每个时间步的移动速度旋转车轮。
    //getValue 是一个方法，用来获取某个时间点的特定属性值。
    //它有两个参数：第一个是time，用来传递一个时间点；第二个是result，用来存储属性值，当然也可以是undefined。这个result是Cesium的scratch机制，
    //主要是用来避免频繁创建和销毁对象而导致内存碎片。Cesium就是通过调用getValue类似的一些函数来感知Property的变化的，
    const res = velocityVectorProperty.getValue(time, velocityVector);
    console.log(res);
    
    const metersPerSecond = Cesium.Cartesian3.magnitude(velocityVector); //计算笛卡尔的大小（长度）。
    const wheelRadius = 0.52; //in meters.
    const circumference = Math.PI * wheelRadius * 2;
    const rotationsPerSecond = metersPerSecond / circumference;

    wheelAngle +=
      ((Math.PI * 2 * totalSeconds) / numberOfSamples) * rotationsPerSecond;
    wheelAngleProperty.addSample(time, wheelAngle);
  }

  function updateSpeedLabel(time, result) {
    velocityVectorProperty.getValue(time, velocityVector);
    const metersPerSecond = Cesium.Cartesian3.magnitude(velocityVector);
    const kmPerHour = Math.round(metersPerSecond * 3.6);

    return `${kmPerHour} km/hr`;
  }
  const rotationProperty = new Cesium.CallbackProperty(function (
    time,
    result
  ) {
    return Cesium.Quaternion.fromAxisAngle(
      Cesium.Cartesian3.UNIT_X,
      wheelAngleProperty.getValue(time),
      result
    );
  },
  false);
  // rotationProperty.getValue(Cesium.JulianDate.fromIso8601(nowDate))
  const wheelTransformation = new Cesium.NodeTransformationProperty({
    rotation: rotationProperty,
  });

  const nodeTransformations = {
    Wheels: wheelTransformation,
    Wheels_mid: wheelTransformation,
    Wheels_rear: wheelTransformation,
  };

  // Add our vehicle model.
  const vehicleEntity = viewer.entities.add({
    position: position,
    //VelocityOrientationProperty将Entity的postion速度转换成Orientation旋转
    orientation: new Cesium.VelocityOrientationProperty(position), // 自动将车辆方向设置为其面对的方向。
    model: {
      uri: "/ModelBuildingFiles/GroundVehicle.glb",
      runAnimations: false,
      nodeTransformations: nodeTransformations,
    },
    label: {
      text: new Cesium.CallbackProperty(updateSpeedLabel, false),
      font: "20px sans-serif",
      showBackground: true,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
        0.0,
        100.0
      ),
      eyeOffset: new Cesium.Cartesian3(0, 3.5, 0),
    },
  });
  //viewer.trackedEntity把相机绑定到entity实例上，如果entity运动的话，还可很方便地实现动画效果
  viewer.trackedEntity = vehicleEntity;
  //viewFrom 调整视角距离
  vehicleEntity.viewFrom = new Cesium.Cartesian3(-10.0, 7.0, 4.0);
};
export default tank;
