<template>
  <div class="map-box">
    <Menu class="left" :theme="theme">
      <Submenu name="1">
        <template #title>
          <Icon type="ios-paper" />
          cesuim
        </template>
        <MenuItem name="1-1" @click="init">cesium初始化</MenuItem>
      </Submenu>
      <Submenu name="2">
        <template #title>
          <Icon type="ios-paper" />
          cesuim高亮
        </template>
        <MenuItem name="2-2" @click="load3DTile">加载3DTiles</MenuItem>
        <MenuItem name="2-3" @click="hightlight">高亮3DTiles</MenuItem>
        <MenuItem name="2-4" @click="loadGeoJson">加载GeoJson</MenuItem>
        <MenuItem name="2-5" @click="hightlightGeoJson">高亮GeoJson</MenuItem>
      </Submenu>
      <Submenu name="3">
        <template #title>
          <Icon type="ios-people" />
          cesuim.property
        </template>
        <MenuItem name="3-1" @click="go">飞机</MenuItem>
        <MenuItem name="3-2" @click="totank">坦克</MenuItem>
      </Submenu>
    </Menu>
    <div class="right">
      <div id="cesiumContainer"></div>
    </div>

    <button class="btn1" style="left: 307.35px; top: 24.5px" @click="text">
      测试
    </button>
    <button class="btn1" style="left: 357.35px; top: 24.5px" @click="change">
      {{ change1.z }}
    </button>
  </div>
</template>

<script setup>
import { onMounted, reactive, toRaw, ref } from "vue";
import fly from "./funcs/fly.ts";
import tank from "./funcs/tank.ts";
import { load, highlight } from "./funcs/3dTiles";
import { loadGeo, highlightGeo } from "./funcs/GeoJSON";

import * as Cesium from "cesium";
//菜单样式
const theme = "light";
//初始化cesium
let viewer;
const init = () => {
  if (viewer) {
    viewer.destroy();
  }
  const viewer1 = new Cesium.Viewer("cesiumContainer", {
    infoBox: false, // If set to false, the InfoBox widget will not be created.
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
  highlight(viewer);
};
const load3DTile = () => {
  load(viewer);
};
const loadGeoJson = () => {
  loadGeo(viewer);
};
const go = () => {
  fly(viewer);
};
const totank = () => {
  tank(viewer);
};
const hightlightGeoJson = () => {
  highlightGeo(viewer);
};
const text = () => {
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
  let property = new Cesium.SampledProperty(Cesium.Cartesian3);
  let nowDate = new Date().toJSON();
  property.addSample(
    Cesium.JulianDate.fromIso8601("2022-06-18T00:00:00.00Z"),
    new Cesium.Cartesian3(400000.0, 300000.0, 200000.0)
  );

  property.addSample(
    Cesium.JulianDate.fromIso8601("2022-06-21T24:00:00.00Z"),
    new Cesium.Cartesian3(400000.0, 300000.0, 700000.0)
  );

  let result = property.getValue(Cesium.JulianDate.fromIso8601(nowDate));
  blueBox.box.dimensions = property;
  change(blueBox);
};
let change1 = ref("");
const change = (blueBox) => {
  setInterval(() => {
    let nowDate = new Date().toJSON();
    let z = blueBox.box.dimensions.getValue(
      Cesium.JulianDate.fromIso8601(nowDate)
    );
    change1.value = z;
    console.log(change1.value);
  }, 1000);
  // this.blueBox.box.dimensions.setValue(
  //   new Cesium.Cartesian3(400000.0, 300000.0, 700000.0)
  // );
};
onMounted(() => {
  init();
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
