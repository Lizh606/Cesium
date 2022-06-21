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
        <MenuItem name="1-5" @click="highlightGeo">高亮GeoJson</MenuItem>
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
      13{{ change1 }}
    </button>
  </div>
</template>

<script setup>
import { onMounted, reactive, toRaw ,ref} from "vue";
import fly from "./funcs/fly.ts";
import tank from "./funcs/tank.ts";
import {load,highlight} from './funcs/3dTiles'
import {loadGeo,highlightGeo} from './funcs/GeoJSON'

import * as Cesium from "cesium";
onMounted(() => {
  init();
});
let viewer;
const init = () => {
  if (viewer) {
    viewer.destroy();
  }
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
const hightlight = async() => {
  await highlight(viewer)
};
const load3DTile =  async() => {
  await load(viewer)
};
const loadGeoJson = async() => {
  await loadGeo(viewer)
};
// loadGeoJson();
const linehHghtlight = (nameId) => {
  let temp = [];
  let exists = temp.indexOf(nameId);
  if (exists <= -1) {
    temp.push(nameId);
  } else {
    temp.splice(exists, 1); //删除对应的nameID
  }
};
// linehHghtlight();

  highlightGeo(viewer)

// change();

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
