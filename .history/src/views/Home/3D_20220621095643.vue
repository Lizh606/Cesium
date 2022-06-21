<template>
  <div class="map-box">
    <Menu class="left" :theme="theme">
      <Submenu name="1">
        <template #title>
          <Icon type="ios-paper" />
          cesuim高亮
        </template>
        <MenuItem name="1-1" @click="init">cesium</MenuItem>
        <MenuItem name="1-2" @click="load3DTile">加载3DTiles</MenuItem>
        <MenuItem name="1-3" @click="hightlight">高亮3DTiles</MenuItem>
        <MenuItem name="1-4" @click="loadGeoJson">加载GeoJson</MenuItem>
        <MenuItem name="1-5" @click="hightlightGeoJson">高亮GeoJson</MenuItem>
      </Submenu>
      <Submenu name="2">
        <template #title>
          <Icon type="ios-people" />
          cesuim.property
        </template>
        <MenuItem name="2-1" @click="go">飞机</MenuItem>
        <MenuItem name="2-2" @click="totank">坦克</MenuItem>
      </Submenu>
      <!-- <Submenu name="3">
        <template #title>
          <Icon type="ios-stats" />
          统计分析
        </template>
        <MenuGroup title="使用">
          <MenuItem name="3-1">新增和启动</MenuItem>
          <MenuItem name="3-2">活跃分析</MenuItem>
          <MenuItem name="3-3">时段分析</MenuItem>
        </MenuGroup>
        <MenuGroup title="留存">
          <MenuItem name="3-4">用户留存</MenuItem>
          <MenuItem name="3-5">流失用户</MenuItem>
        </MenuGroup>
      </Submenu> -->
    </Menu>
    <div class="right">
      <div id="cesiumContainer"></div>
    </div>

    <button class="btn1" style="left: 307.35px; top: 24.5px" @click="text">
      测试
    </button>
    <button class="btn1" style="left: 357.35px; top: 24.5px" @click="change">
      change
    </button>
  </div>
</template>

<script setup>
import { onMounted, reactive, toRaw } from "vue";
import fly from "./funcs/fly.ts";
import tank from "./funcs/tank.ts";
import { ref } from "vue";
import { getCurrentInstance } from "vue";
import * as Cesium from "cesium";
let viewer;
const init = () => {
  const viewer1 = new Cesium.Viewer("cesiumContainer", {
    infoBox: true, // If set to false, the InfoBox widget will not be created.
    shouldAnimate: true,
  });
  viewer = toRaw(viewer1);
  console.log(viewer);
  viewer.dataSources.add(
    Cesium.GeoJsonDataSource.load(
      "https://geo.datav.aliyun.com/areas_v3/bound/geojson?code=310000_full",
      {
        stroke: Cesium.Color.HOTPINK,
        fill: Cesium.Color.PINK.withAlpha(0.5),
        strokeWidth: 3,
      }
    )
  );
  viewer.scene.primitives.add(
    new Cesium.GroundPolylinePrimitive({
      //贴地primitive线
      geometryInstances: new Cesium.GeometryInstance({
        geometry: new Cesium.GroundPolylineGeometry({
          //贴地线几何
          positions: Cesium.Cartesian3.fromDegreesArray([90, 28, 100, 28]),
        }),
      }),
      appearance: new Cesium.PolylineMaterialAppearance({
        material: Cesium.Material.fromType("Color", {
          color: Cesium.Color.RED,
        }),
      }),
    })
  );
  let yellowLine = viewer.entities.add({
    name: "Red line on the surface",
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArray([
        112.82436, 23.071506, 112.82742, 23.067512, 112.828878, 23.064659,
        112.830799, 23.060947, 112.832166, 24.058329,
      ]),
      width: 2,
      material: Cesium.Color.YELLOW,
    },
  });
  viewer.flyTo(yellowLine);
  // eslint-disable-next-line no-console
  // 根据元素的clampToGround属性贴地
  let options = {
    camera: viewer.scene.camera,

    canvas: viewer.scene.canvas,

    clampToGround: true, //开启贴地
  };

  viewer.camera.flyHome(0);

  let a = viewer.dataSources.add(
    Cesium.GeoJsonDataSource.load(
      "https://geo.datav.aliyun.com/areas_v3/bound/geojson?code=310000_full",
      {
        stroke: Cesium.Color.HOTPINK,
        fill: Cesium.Color.PINK.withAlpha(0.5),
        strokeWidth: 3,
      }
    )
  );
  console.log(viewer.flyTo(a));
};
const hightlight = () => {
  // //高亮元素
  
  let nameOverlay = document.createElement("div");
  viewer.container.appendChild(nameOverlay);
  nameOverlay.className = "backdrop";
  nameOverlay.style.display = "none";
  nameOverlay.style.position = "absolute";
  nameOverlay.style.bottom = "0";
  nameOverlay.style.left = "0";
  nameOverlay.style["pointer-events"] = "none";
  nameOverlay.style.padding = "4px";
  nameOverlay.style.backgroundColor = "red";
  //设置样式
  let selected = {
    // feature: undefined,
    originalColor: new Cesium.Color(),
  };

  let selectedEntity = new Cesium.Entity();

  let clickHandler = viewer.screenSpaceEventHandler.getInputAction(
    Cesium.ScreenSpaceEventType.LEFT_CLICK
  );

  // 如果支持剪影，则鼠标上方的剪影功能为蓝色，鼠标单击的剪影功能为绿色
  // 如果不支持轮廓，请将特征颜色更改为鼠标悬停时为黄色，单击鼠标时为绿色
  if (Cesium.PostProcessStageLibrary.isSilhouetteSupported(viewer.scene)) {
    // 支持轮廓
    let silhouetteBlue =
      Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
    silhouetteBlue.uniforms.color = Cesium.Color.BLUE; //蓝色
    silhouetteBlue.uniforms.length = 0.01;
    silhouetteBlue.selected = [];

    let silhouetteGreen =
      Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
    silhouetteGreen.uniforms.color = Cesium.Color.LIME;
    silhouetteGreen.uniforms.length = 0.01;
    silhouetteGreen.selected = [];

    viewer.scene.postProcessStages.add(
      Cesium.PostProcessStageLibrary.createSilhouetteStage([
        silhouetteBlue,
        silhouetteGreen,
      ])
    );

    // 在悬停时勾勒出蓝色的轮廓
    viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(
      movement
    ) {
      // 如果先前高亮显示了某个要素，请撤消该高亮显示
      silhouetteBlue.selected = [];

      //点击新要素
      let pickedFeature = viewer.scene.pick(movement.endPosition);
      if (!Cesium.defined(pickedFeature)) {
        nameOverlay.style.display = "none";
        return;
      }

      //要素被点击，显示它的覆盖内容
      nameOverlay.style.display = "block";
      nameOverlay.style.bottom =
        viewer.canvas.clientHeight - movement.endPosition.y + "px";
      nameOverlay.style.left = movement.endPosition.x + "px";
      let name = pickedFeature.getProperty("name");
      nameOverlay.textContent = name;

      // 突出显示尚未选定的功能
      if (pickedFeature !== selected.feature) {
        silhouetteBlue.selected = [pickedFeature];
      }
    },
    Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // 在信息框中显示选定内容和元数据
    viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(
      movement
    ) {
      // 如果先前选择了某个特征，请撤消高亮显示
      silhouetteGreen.selected = [];

      // 点击新要素
      let pickedFeature = viewer.scene.pick(movement.position);
      if (!Cesium.defined(pickedFeature)) {
        clickHandler(movement);
        return;
      }

      if (silhouetteGreen.selected[0] === pickedFeature) {
        return;
      }

      // 保存选定要素的原始颜色
      let highlightedFeature = silhouetteBlue.selected[0];
      if (pickedFeature === highlightedFeature) {
        silhouetteBlue.selected = [];
      }

      // 高亮新选择要素
      silhouetteGreen.selected = [pickedFeature];

      // 设置要素信息框描述
      let featureName = pickedFeature.getProperty("name");
      selectedEntity.name = featureName;
      selectedEntity.description =
        'Loading <div class="cesium-infoBox-loading"></div>';
      viewer.selectedEntity = selectedEntity;
      selectedEntity.description =
        '<table class="cesium-infoBox-defaultTable"><tbody>' +
        "<tr><th>name</th><td>" +
        pickedFeature.getProperty("name");
    },
    Cesium.ScreenSpaceEventType.LEFT_CLICK);
  } else {
    // 不支持轮廓。相反，更改特征颜色
    // 有关当前突出显示的功能的信息
    let highlighted = {
      feature: undefined,
      originalColor: new Cesium.Color(),
    };

    // 鼠标移动显示黄色
    viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(
      movement
    ) {
      // 如果先前高亮显示了某个要素，请撤消该高亮显示
      if (Cesium.defined(highlighted.feature)) {
        highlighted.feature.color = highlighted.originalColor;
        highlighted.feature = undefined;
      }
      // 点击新要素
      let pickedFeature = viewer.scene.pick(movement.endPosition);
      if (!Cesium.defined(pickedFeature)) {
        nameOverlay.style.display = "none";
        return;
      }
      // 要素被点击，显示它的覆盖内容
      nameOverlay.style.display = "block";
      nameOverlay.style.bottom =
        viewer.canvas.clientHeight - movement.endPosition.y + "px";
      nameOverlay.style.left = movement.endPosition.x + "px";
      let name = pickedFeature.getProperty("name");
      if (!Cesium.defined(name)) {
        name = pickedFeature.getProperty("id");
      }
      nameOverlay.textContent = name;
      // Highlight the feature if it's not already selected.
      if (pickedFeature !== selected.feature) {
        highlighted.feature = pickedFeature;
        Cesium.Color.clone(pickedFeature.color, highlighted.originalColor);
        pickedFeature.color = Cesium.Color.YELLOW;
      }
    },
    Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    //为所选内容上色并在信息框中显示元数据
    viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(
      movement
    ) {
      // 如果先前选择了某个特征，请撤消高亮显示
      if (Cesium.defined(selected.feature)) {
        selected.feature.color = selected.originalColor;
        selected.feature = undefined;
      }
      // 点击新要素
      let pickedFeature = viewer.scene.pick(movement.position);
      if (!Cesium.defined(pickedFeature)) {
        clickHandler(movement);
        return;
      }
      // Select the feature if it's not already selected
      if (selected.feature === pickedFeature) {
        return;
      }
      selected.feature = pickedFeature;
      // Save the selected feature's original color
      if (pickedFeature === highlighted.feature) {
        Cesium.Color.clone(highlighted.originalColor, selected.originalColor);
        highlighted.feature = undefined;
      } else {
        Cesium.Color.clone(pickedFeature.color, selected.originalColor);
      }
      // Highlight newly selected feature
      pickedFeature.color = Cesium.Color.LIME;
      // Set feature infobox description
      let featureName = pickedFeature.getProperty("name");
      selectedEntity.name = featureName;
      selectedEntity.description =
        'Loading <div class="cesium-infoBox-loading"></div>';
      viewer.selectedEntity = selectedEntity;
      selectedEntity.description =
        '<table class="cesium-infoBox-defaultTable"><tbody>' +
        "<tr><th>name</th><td>" +
        pickedFeature.getProperty("name");
    },
    Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }
};
// hightlight();
const load3DTile = () => {
  
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
// load3DTile();
const loadGeoJson = () => {
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
// loadGeoJson();
const linehHghtlight = (nameId) => {
  let exists = that.temp.indexOf(nameId);
  if (exists <= -1) {
    temp.push(nameId);
  } else {
    temp.splice(exists, 1); //删除对应的nameID
  }
};
// linehHghtlight();
const hightlightGeoJson = () => {
  // //高亮元素
  viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {
    let pickedFeature = viewer.scene.pick(movement.position);
    let highlightFace;
    let showDivPositionOld;
    //判断之前是否有高亮面存在
    if (highlightFace !== null) {
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
// hightlightGeoJson();
const go = async () => {
  await fly(viewer);
};
// go();
const totank = async () => {
  await tank(viewer);
};
// totank();
const text = () => {
  this.blueBox = viewer.entities.add({
    name: "Blue box",
    position: Cesium.Cartesian3.fromDegrees(-114.0, 40.0, 300000.0),
    box: {
      dimensions: new Cesium.Cartesian3(400000.0, 300000.0, 500000.0),
      material: Cesium.Color.BLUE,
      outline: true,
    },
  });
  viewer.flyTo(this.blueBox);
  let property = new Cesium.SampledProperty(Cesium.Cartesian3);
  let nowDate = new Date().toJSON();
  property.addSample(
    Cesium.JulianDate.fromIso8601("2022-06-18T00:00:00.00Z"),
    new Cesium.Cartesian3(400000.0, 300000.0, 200000.0)
  );

  property.addSample(
    Cesium.JulianDate.fromIso8601("2022-06-20T24:00:00.00Z"),
    new Cesium.Cartesian3(400000.0, 300000.0, 700000.0)
  );

  let result = property.getValue(Cesium.JulianDate.fromIso8601(nowDate));
  console.log(result);
  this.blueBox.box.dimensions = property;
  this.change();
};
// text();
const change = () => {
  setInterval(() => {
    let nowDate = new Date().toJSON();
    this.z = this.blueBox.box.dimensions.getValue(
      Cesium.JulianDate.fromIso8601(nowDate)
    );
    // console.log(this.z.z);
  }, 1000);
  // this.blueBox.box.dimensions.setValue(
  //   new Cesium.Cartesian3(400000.0, 300000.0, 700000.0)
  // );
};
// change();
onMounted(() => {
  //  const viewer = new Cesium.Viewer("cesiumContainer", {
  //   infoBox: true, // If set to false, the InfoBox widget will not be created.
  //   shouldAnimate: true,
  // });
  init();
  console.log(viewer);
});
</script>

<style scoped>
.map-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
}
.left {
  margin-left: -30px;
  width: 200px;
}
.right {
  flex: 1;
}
#cesiumContainer {
  width: 100%;
  height: 100%;
}
.btn1 {
  position: absolute;
  z-index: 99;
  top: 0px;
}
#toolbar,
#loadingOverlay {
  z-index: 99;
  position: absolute;
  top: 0;
  background: #eee;
}
</style>
