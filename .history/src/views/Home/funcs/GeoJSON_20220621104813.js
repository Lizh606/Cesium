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
const highlight = (viewer) => {
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
export { load, highlight };
