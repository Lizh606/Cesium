<template>
  <div class="map-box">
    <Menu class="left" :theme="theme">
      <Submenu name="1">
        <template #title>
          <Icon type="ios-paper" />
          cesuim高亮
        </template>
        <MenuItem name="1-1" @click="load3DTile">加载3DTiles</MenuItem>
        <MenuItem name="1-2" @click="hightlight">高亮3DTiles</MenuItem>
        <MenuItem name="1-3" @click="loadGeoJson">加载GeoJson</MenuItem>
        <MenuItem name="1-4" @click="hightlightGeoJson">高亮GeoJson</MenuItem>
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
      <div id="toolbar">
        <table   v-if="showTool" class="infoPanel">
          <tbody>
            <tr>
              <td>
                Click on the 3D window then use the keyboard to change settings.
              </td>
            </tr>
            <tr>
              <td>Heading: <span id="heading"></span>°</td>
            </tr>
            <tr>
              <td>← to left/→ to right</td>
            </tr>
            <tr>
              <td>Pitch: <span id="pitch"></span>°</td>
            </tr>
            <tr>
              <td>↑ to up/↓ to down</td>
            </tr>
            <tr>
              <td>roll: <span id="roll"></span>°</td>
            </tr>
            <tr>
              <td>← + ⇧ left/→ + ⇧ right</td>
            </tr>
            <tr>
              <td>Speed: <span id="speed"></span>m/s</td>
            </tr>
            <tr>
              <td>↑ + ⇧ to speed up/↓ + ⇧ to speed down</td>
            </tr>
            <tr>
              <td>
                following aircraft
                <input id="fromBehind" type="checkbox" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div id="cesiumContainer"></div>
    </div>
    <!-- <button class="btn1" @click="load3DTile">加载3DTiles</button>
    <button class="btn1" style="top: 24.5px" @click="hightlight">
      高亮3DTiles
    </button>
    <button class="btn1" style="left: 87.35px" @click="loadGeoJson">
      加载GeoJson
    </button>
    <button
      class="btn1"
      style="left: 87.35px; top: 24.5px"
      @click="hightlightGeoJson"
    >
      高亮GeoJson
    </button>
    <button class="btn1" style="left: 187.35px; top: 24.5px" @click="go">
      飞机
    </button>
    <button class="btn1" style="left: 257.35px; top: 24.5px" @click="totank">
      坦克
    </button>
    <button class="btn1" style="left: 307.35px; top: 24.5px" @click="text">
      测试
    </button>
    <button class="btn1" style="left: 357.35px; top: 24.5px" @click="change">
      change {{ this.z }}
    </button> -->
  </div>
</template>

<script>
// import {onMounted} from 'vue';
import * as Cesium from "cesium";
import MeauList from "./Meau/meau.vue";
export default {
  name: "HelooWorld",
  components: {
    MeauList,
  },
  data() {
    return {
      viewer: null,
      theme: "light",
      temp: [],
      highlightFace: null,
      showDivPositionOld: null,
      blueBox: null,
      z: null,
      showTool: false,
    };
  },

  mounted() {
    // let viewer = new Cesium.CesiumWidget('cesiumContainer')

    // eslint-disable-next-line no-undef
    this.viewer = new Cesium.Viewer("cesiumContainer", {
      infoBox: false, // If set to false, the InfoBox widget will not be created.
      shouldAnimate: true,
    });
    let viewer = this.viewer;
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
    console.log(viewer);
    // 根据元素的clampToGround属性贴地
    let options = {
      camera: viewer.scene.camera,

      canvas: viewer.scene.canvas,

      clampToGround: true, //开启贴地
    };

    // viewer.camera.flyHome(0);

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
  },
  methods: {
    hightlight() {
      // //高亮元素
      let viewer = this.viewer;
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
            Cesium.Color.clone(
              highlighted.originalColor,
              selected.originalColor
            );
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
    },
    load3DTile() {
      let viewer = this.viewer;
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
    },
    loadGeoJson() {
      let viewer = this.viewer;
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
    },
    linehHghtlight(nameId) {
      let exists = that.temp.indexOf(nameId);
      if (exists <= -1) {
        temp.push(nameId);
      } else {
        temp.splice(exists, 1); //删除对应的nameID
      }
    },
    hightlightGeoJson() {
      // //高亮元素
      let viewer = this.viewer;
      let that = this;
      viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(
        movement
      ) {
        let pickedFeature = viewer.scene.pick(movement.position);

        //判断之前是否有高亮面存在
        if (that.highlightFace !== null) {
          that.highlightFace.material = that.highlightFace.material0;
        }
        pickedFeature.id.polygon.material0 = pickedFeature.id.polygon.material;
        pickedFeature.id.polygon.material = Cesium.Color.GREEN;
        that.highlightFace = pickedFeature.id.polygon;
        that.showDivPositionOld = pickedFeature.id.properties;
        // 设置要素信息框描述
        let featureName = that.showDivPositionOld.name._value;
        pickedFeature.id._description =
          '<table class="cesium-infoBox-defaultTable"><tbody>' +
          "<tr><th>name</th><td>" +
          featureName;
        if (typeof pickedFeature != "undefined")
          //鼠标是否点到面上
          that.linehHghtlight(pickedFeature.id);
      },
      Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    go() {
      this.showTool = true;
      let viewer = this.viewer;
      const canvas = viewer.canvas;
      canvas.setAttribute("tabindex", "0"); // needed to put focus on the canvas
      canvas.addEventListener("click", function () {
        canvas.focus();
      });
      canvas.focus();

      const scene = viewer.scene;

      const pathPosition = new Cesium.SampledPositionProperty();
      const entityPath = viewer.entities.add({
        position: pathPosition,
        name: "path",
        path: {
          show: true,
          leadTime: 0,
          trailTime: 60,
          width: 10,
          resolution: 1,
          material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.3,
            taperPower: 0.3,
            color: Cesium.Color.PALEGOLDENROD,
          }),
        },
      });

      const camera = viewer.camera;
      const controller = scene.screenSpaceCameraController;
      let r = 0;
      const center = new Cesium.Cartesian3();

      const hpRoll = new Cesium.HeadingPitchRoll(); //表示为航向，俯仰和横滚
      const hpRange = new Cesium.HeadingPitchRange(); //定义航向角，俯仰角和范围
      let speed = 10;
      const deltaRadians = Cesium.Math.toRadians(3.0); //将度转换为弧度。

      let position = Cesium.Cartesian3.fromDegrees(
        -123.0744619,
        44.0503706,
        5000.0
      );
      let speedVector = new Cesium.Cartesian3();
      const fixedFrameTransform =
        Cesium.Transforms.localFrameToFixedFrameGenerator("north", "west"); //生成一个函数，该函数根据参考帧计算4x4转换矩阵以提供的原点为中心，以提供的椭球的固定参考系为中心

      const planePrimitive = scene.primitives.add(
        Cesium.Model.fromGltf({
          url: "/ModelBuildingFiles/Cesium_Air.glb",
          modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(
            position,
            hpRoll,
            Cesium.Ellipsoid.WGS84,
            fixedFrameTransform
          ),
          minimumPixelSize: 128,
        })
      );

      planePrimitive.readyPromise.then(function (model) {
        // 以半速播放和循环所有动画
        model.activeAnimations.addAll({
          multiplier: 0.5,
          loop: Cesium.ModelAnimationLoop.REPEAT,
        });

        // Zoom to model
        r = 2.0 * Math.max(model.boundingSphere.radius, camera.frustum.near);
        controller.minimumZoomDistance = r * 0.5;
        Cesium.Matrix4.multiplyByPoint(
          model.modelMatrix,
          model.boundingSphere.center,
          center
        );
        const heading = Cesium.Math.toRadians(230.0);
        const pitch = Cesium.Math.toRadians(-20.0);
        hpRange.heading = heading;
        hpRange.pitch = pitch;
        hpRange.range = r * 50.0;
        camera.lookAt(center, hpRange);
      });

      document.addEventListener("keydown", function (e) {
        switch (e.keyCode) {
          case 40:
            if (e.shiftKey) {
              // speed down
              speed = Math.max(--speed, 1);
            } else {
              // pitch down
              hpRoll.pitch -= deltaRadians;
              if (hpRoll.pitch < -Cesium.Math.TWO_PI) {
                hpRoll.pitch += Cesium.Math.TWO_PI;
              }
            }
            break;
          case 38:
            if (e.shiftKey) {
              // speed up
              speed = Math.min(++speed, 1000);
            } else {
              // pitch up
              hpRoll.pitch += deltaRadians;
              if (hpRoll.pitch > Cesium.Math.TWO_PI) {
                hpRoll.pitch -= Cesium.Math.TWO_PI;
              }
            }
            break;
          case 39:
            if (e.shiftKey) {
              // roll right
              hpRoll.roll += deltaRadians;
              if (hpRoll.roll > Cesium.Math.TWO_PI) {
                hpRoll.roll -= Cesium.Math.TWO_PI;
              }
            } else {
              // turn right
              hpRoll.heading += deltaRadians;
              if (hpRoll.heading > Cesium.Math.TWO_PI) {
                hpRoll.heading -= Cesium.Math.TWO_PI;
              }
            }
            break;
          case 37:
            if (e.shiftKey) {
              // roll left until
              hpRoll.roll -= deltaRadians;
              if (hpRoll.roll < 0.0) {
                hpRoll.roll += Cesium.Math.TWO_PI;
              }
            } else {
              // turn left
              hpRoll.heading -= deltaRadians;
              if (hpRoll.heading < 0.0) {
                hpRoll.heading += Cesium.Math.TWO_PI;
              }
            }
            break;
          default:
        }
      });
      const headingSpan = document.getElementById("heading");
      const pitchSpan = document.getElementById("pitch");
      const rollSpan = document.getElementById("roll");
      const speedSpan = document.getElementById("speed");
      const fromBehind = document.getElementById("fromBehind");

      viewer.scene.preUpdate.addEventListener(function (scene, time) {
        speedVector = Cesium.Cartesian3.multiplyByScalar(
          Cesium.Cartesian3.UNIT_X, //初始化为（1.0，0.0，0.0）。
          speed / 10,
          speedVector
        );
        position = Cesium.Matrix4.multiplyByPoint(
          planePrimitive.modelMatrix,
          speedVector,
          position
        );
        pathPosition.addSample(Cesium.JulianDate.now(), position);
        Cesium.Transforms.headingPitchRollToFixedFrame(
          position,
          hpRoll,
          Cesium.Ellipsoid.WGS84,
          fixedFrameTransform,
          planePrimitive.modelMatrix
        );

       
      });

      viewer.scene.preRender.addEventListener(function (scene, time) {
        headingSpan.innerHTML = Cesium.Math.toDegrees(hpRoll.heading).toFixed(
          1
        );
        pitchSpan.innerHTML = Cesium.Math.toDegrees(hpRoll.pitch).toFixed(1);
        rollSpan.innerHTML = Cesium.Math.toDegrees(hpRoll.roll).toFixed(1);
        speedSpan.innerHTML = speed.toFixed(1);
      });
    },
    totank() {
      let viewer = this.viewer;
      const start = Cesium.JulianDate.fromDate(new Date(2018, 11, 12, 15));
      const totalSeconds = 15;
      const stop = Cesium.JulianDate.addSeconds(
        start,
        totalSeconds,
        new Cesium.JulianDate()
      );
      viewer.clock.startTime = start.clone(); //开始时间
      viewer.clock.stopTime = stop.clone(); //结束时间
      viewer.clock.currentTime = start.clone(); //当前时间
      viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //确定 Clock＃startTime 或 Clock时时钟的行为#stopTime 到达。
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
        velocityVectorProperty.getValue(time, velocityVector);
        const metersPerSecond = Cesium.Cartesian3.magnitude(velocityVector); //计算笛卡尔的大小（长度）。
        const wheelRadius = 0.52; //in meters.
        const circumference = Math.PI * wheelRadius * 2;
        const rotationsPerSecond = metersPerSecond / circumference;

        wheelAngle +=
          ((Math.PI * 2 * totalSeconds) / numberOfSamples) * rotationsPerSecond;
        // console.log(wheelAngle);
        wheelAngleProperty.addSample(time, wheelAngle);
        // console.log(wheelAngleProperty.getvalue(time));
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
    },
    text() {
      let viewer = this.viewer;
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
    },
    change() {
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
    },
  },
};
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
