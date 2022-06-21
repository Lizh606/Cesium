import * as Cesium from "cesium";

const loadGeo = (viewer) => {
  let geojson = viewer.dataSources.add(
    Cesium.GeoJsonDataSource.load(
      "https://geo.datav.aliyun.com/areas_v3/bound/geojson?code=310000_full",
      {
        stroke: Cesium.Color.HOTPINK,
        fill: Cesium.Color.PINK.withAlpha(0.5),
        strokeWidth: 3,
      }
    )
  );
  viewer.flyTo(geojson);
};
let highlightFace ;
const highlightGeo = (viewer) => {
  // //高亮元素
  viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {
    let pickedFeature = viewer.scene.pick(movement.position);
    let showDivPositionOld;
    //判断之前是否有高亮面存在
    if (highlightFace !== null&& highlightFace !== undefined) {
      highlightFace.material = highlightFace.material0;
    }
    pickedFeature.id.polygon.material0 = pickedFeature.id.polygon.material;
    pickedFeature.id.polygon.material = Cesium.Color.GREEN;
    highlightFace = pickedFeature.id.polygon;
    showDivPositionOld = pickedFeature.id.properties;
    // 设置要素信息框描述
    let featureName = showDivPositionOld.name._value;
    pickedFeature.id._description =
      '<table class="cesium-infoBox-defaultTable"><tbody>' +
      "<tr><th>name</th><td>" +
      featureName;
    if (typeof pickedFeature != "undefined")
      //鼠标是否点到面上
      linehHghtlight(pickedFeature.id);
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};
const linehHghtlight = (nameId) => {
  let temp = [];
  //类型“any”的参数不能赋给类型“never”的参数。
  let exists = temp.indexOf(nameId as never);
  if (exists <= -1) {
    temp.push(nameId as never);
  } else {
    temp.splice(exists, 1); //删除对应的nameID
  }
};
export { loadGeo, highlightGeo };
