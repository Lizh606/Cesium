import * as Cesium from "cesium";

const load = (viewer) => {
    // a.then(viewer.flyTo(a));
  
    // let x = 0.0;
    // let y = -100.0;
    // let z = 0.0;
    // // let x = 0;
    // // let y = 0;
    // // let z = 0;
    // let m = Cesium.Matrix4.fromArray([
    //   1.0,
    //   0.0,
    //   0.0,
    //   0.0,
    //   0.0,
    //   1.0,
    //   0.0,
    //   0.0,
    //   0.0,
    //   0.0,
    //   1.0,
    //   0.0,
    //   x,
    //   y,
    //   z,
    //   1.0,
    // ]);
    let palaceTileset = new Cesium.Cesium3DTileset({
      url: "/ModelBuildingFiles/ModelBuildingFiles.json",
      maximumScreenSpaceError: 2, //最大的屏幕空间误差
      maximumNumberOfLoadedTiles: 1000, //最大加载瓦片个数
      clampToGround: true,
      // modelMatrix: m, //形状矩阵
    });
    let b = viewer.scene.primitives.add(palaceTileset);
    viewer.flyTo(b);
    let height = 1; //根据地形设置调整高度
    //贴地显示
    // let cartographic = Cesium.Cartographic.fromCartesian(
    //   tileset.boundingSphere.center
    // );
    // let surface = Cesium.Cartesian3.fromRadians(
    //   cartographic.longitude,
    //   cartographic.latitude,
    //   cartographic.height
    // );
    // let offset = Cesium.Cartesian3.fromRadians(
    //   cartographic.longitude,
    //   cartographic.latitude,
    //   height
    // );
    // let translation = Cesium.Cartesian3.subtract(
    //   offset,
    //   surface,
    //   new Cesium.Cartesian3()
    // );
    // palaceTileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
    palaceTileset.readyPromise.then(function (argument) {
      let cartographic = Cesium.Cartographic.fromCartesian(
        palaceTileset.boundingSphere.center
      );
      let surface = Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude,
        cartographic.height
      );
      let offset = Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude,
        height
      );
      let translation = Cesium.Cartesian3.subtract(
        offset,
        surface,
        new Cesium.Cartesian3()
      );
      palaceTileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
    });
  };

export default load;
