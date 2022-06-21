<template>
  <div class="main">
    <div id="cesiumContainer" class="fullSize"></div>
    <div id="loadingOverlay">
      <h1>Loading...</h1>
    </div>
    <div id="toolbar">
      <table class="infoPanel">
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
  </div>
</template>

<script>
import * as Cesium from "cesium";

export default {
  name: "LazyLoad",
  data() {
    return {};
  },
  // directives: {
  //   lazy: {
  //     inserted(el, binding) {
  //       // let imgs = document.querySelectorAll(".lazy");
  //       //定义一个观察器，entries为状态改变元素的数组
  //       let observer = new IntersectionObserver((entries) => {
  //         // 遍历
  //         for (let i of entries) {
  //           // 如果改元素处于可视区
  //           if (i.isIntersecting > 0) {
  //             // 获取该元素
  //             let img = i.target;
  //             // 重新设置src值
  //             img.src = binding.value;
  //             //取消对该元素的观察
  //             observer.unobserve(img);
  //           }
  //         }
  //       //   entries.forEach((item) => {
  //       //     if (item.isIntersecting) {
  //       //       let img = item.target;
  //       //     //   img.src = binding.value;
  //       //       observer.unobserve(img);
  //       //     }
  //       //   });
  //       });
  //       // 为 img 标签添加一个观察
  //       observer.observe(el);
  //     },
  //   },
  // },
  mounted() {
    const viewer = new Cesium.Viewer("cesiumContainer", {
      shouldAnimate: true,
    });

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

      if (fromBehind.checked) {
        // Zoom to model
        Cesium.Matrix4.multiplyByPoint(
          planePrimitive.modelMatrix,
          planePrimitive.boundingSphere.center,
          center
        );
        hpRange.heading = hpRoll.heading;
        hpRange.pitch = hpRoll.pitch;
        camera.lookAt(center, hpRange);
      }
    });

    viewer.scene.preRender.addEventListener(function (scene, time) {
      headingSpan.innerHTML = Cesium.Math.toDegrees(hpRoll.heading).toFixed(1);
      pitchSpan.innerHTML = Cesium.Math.toDegrees(hpRoll.pitch).toFixed(1);
      rollSpan.innerHTML = Cesium.Math.toDegrees(hpRoll.roll).toFixed(1);
      speedSpan.innerHTML = speed.toFixed(1);
    });
  },
  methods: {
    // Observer() {
    //   let imgs = document.querySelectorAll(".lazy");
    //   let observer = new IntersectionObserver((entries) => {
    //     // // 遍历
    //     // for (let i of entries) {
    //     //   // 如果改元素处于可视区
    //     //   if (i.isIntersecting > 0) {
    //     //     // 获取该元素
    //     //     let img = i.target;
    //     //     // 重新设置src值
    //     //     img.src = binding.value;
    //     //     //取消对该元素的观察
    //     //     observer.unobserve(img);
    //     //   }
    //     // }
    //     entries.forEach((item) => {
    //       if (item.isIntersecting) {
    //         let img = item.target;
    //         observer.unobserve(img);
    //       }
    //     });
    //   });
    //   // 为 img 标签添加一个观察
    //   imgs.forEach((item) => {
    //     observer.observe(item);
    //   });
    // },
  },
};
</script>

<style scoped>
#toolbar,
#loadingOverlay {
  position: absolute;
  top: 0;
  background: #eee;
}
#cesiumContainer,
.main {
  height: 100%;
}
</style>
