'use strict';

import * as THREE from 'three';
import Kamon from '../kamon.js';

export default class MaruNiUmebachi2 extends Kamon {

  constructor() {

    super();

    // this.verNum = 5;

    // infoのテキスト
    this.jpNameText = '丸に梅鉢';
    this.jpDescText = '梅鉢紋とは梅の花を図案化した家紋の一種で、中心から放射状に伸びた花弁の図案が太鼓のバチに似ていることに由来すると言われています。学問の神として知られ、梅をこよなく愛した菅原道真を祀る天満宮が神紋として梅鉢紋を用いたことから、天神信仰と共に日本各地に広がったとされています。';
    this.enNameText = 'Maru-ni-umebachi';
    this.enDescText = 'The Umebachi crest is a type of family crest that depicts a plum blossom, and is said to derive from the fact that the pattern of petals radiating from the center resembles the drumsticks of a drum. Tenmangu Shrine, which is dedicated to Michizane Sugawara, who was known as the god of learning and loved plums, used the plum bowl crest as a divine crest, and it is said that it spread throughout Japan along with Tenjin worship.';

    // ガイドラインの表示アニメーションパラメータ
    this.guidelineParams = {
      inStart : 0.1,
      inEnd   : 0.5,
      outStart: 0.55,
      outEnd  : 0.6,
      // gDelay  : 0.03,
      // lDelay  : 0.06,
    }

    // アウトラインの表示アニメーションパラメータ
    this.outlineParams = {
      inStart : 0.5,
      inEnd   : 0.6,
      outStart: 0.65,
      outEnd  : 0.7,
    }

    // 図形の表示アニメーションパラメータ
    this.shapeParams = {
      inStart : 0.65,
      inEnd   : 0.75,
      outStart: 0.95,
      outEnd  : 0.9,
    }

    // 図形の回転アニメーションパラメータ
    this.shapeRotParams = {
      start : 0.75,
      end   : 0.85,
    }

    // 円
    this.circle1 = {a:    0, b:    0, r: 1600};
    this.circle2 = {a:    0, b:    0, r: 1310};
    this.circle3 = {a:    0, b:    0, r:  815};
    this.circle4 = {a:    0, b:    0, r:  405};
    this.circle5 = {a:    0, b:    0, r:  200};
    this.circle6 = {a:    0, b:  815, r:  445};

    // 五角形の頂点
    this.pentaApices = [];
    for (var i = 0;i <= 4;i ++) {
      const circle = this.circle4;
      const angle = 54 + (72 * i);
      const apex = this.circle(circle.a, circle.b, circle.r, angle);
      this.pentaApices.push(apex);
    }

    // 五角形の辺の式
    this.pentaForms = [];
    for (var i = 0;i <= 4;i ++) {
      const apex1 = this.pentaApices[i];
      const apex2 = this.pentaApices[i == 4 ? 0 : i + 1];
      const form = this.from2Points(apex1.x, apex1.y, apex2.x, apex2.y);
      this.pentaForms.push(form);
    }

    // 五角形とX軸の交点
    const form1 = this.pentaForms[1];
    const inter1 = this.straight(form1.a, 1, form1.b, undefined, 0);
    const form2 = this.pentaForms[4];
    const inter2 = this.straight(form2.a, 1, form2.b, undefined, 0);
    this.pentaInters = [inter1, inter2];

  }

  // オブジェクトを生成
  init = () => {

    // ガイドラインの作成
    this.generateGuideline();

    // アウトラインの作成
    this.generateOutline();

    // 塗りつぶし図形の描画
    this.generateShape();

  }

  // ガイドラインを作成
  generateGuideline = () => {

    // 中心円１
    this.circles1 = new THREE.Group();
    const circles1 = [this.circle1, this.circle2, this.circle3];
    circles1.forEach((circle) => {
      const points = this.circlePointGen(circle.a, circle.b, circle.r, 90, 450, this.divCount);
      const circleMesh = this.guidelineGen(points);
      this.circles1.add(circleMesh);
    });
    this.guidelines.add(this.circles1);

    // 放射線１
    this.radiations1 = new THREE.Group();
    const linePoints1 = this.linePointGen(1, 0, 0, 815, - 815, this.divCount);
    for (var v = 0;v <= 4;v ++) {
      const line = this.guidelineGen(linePoints1);
      line.rotation.z = THREE.MathUtils.degToRad(72 * v);
      this.radiations1.add(line);
    }
    this.guidelines.add(this.radiations1);

    // 周回円
    this.fiveCircles = new THREE.Group();
    const c = this.circle6;
    for (var v = 0;v <= 4;v ++) {
      const circlePoints = this.circlePointGen(c.a, c.b, c.r, 90, 450, this.divCount);
      const circle = this.guidelineGen(circlePoints);
      circle.rotation.z = THREE.MathUtils.degToRad(72 * v);
      this.fiveCircles.add(circle);
    }
    this.guidelines.add(this.fiveCircles);

    // 中心円２
    this.circles2 = new THREE.Group();
    const circles2 = [this.circle4, this.circle5];
    circles2.forEach((circle) => {
      const points = this.circlePointGen(circle.a, circle.b, circle.r, 90, 450, this.divCount);
      const circleMesh = this.guidelineGen(points);
      this.circles2.add(circleMesh);
    });
    this.guidelines.add(this.circles2);

    // 五角形
    this.pentagon = new THREE.Group();
    for (var i = 0;i <= 4;i ++) {
      const apex1 = this.pentaApices[i];
      const apex2 = this.pentaApices[i == 4 ? 0 : i + 1];
      const form = this.pentaForms[i];
      const points = this.linePointGen(form.a, 1, form.b, apex1.x, apex2.x, this.divCount);
      const line = this.guidelineGen(points);
      this.pentagon.add(line);
    }
    this.guidelines.add(this.pentagon);

    // 放射線２
    this.radiations2 = new THREE.Group();
    const inter1 = this.pentaInters[0];
    const inter2 = this.pentaInters[1];
    const linePoints2 = this.linePointGen(0, 1, 0, inter1.x, inter2.x, this.divCount);
    for (var v = 0;v <= 4;v ++) {
      const line = this.guidelineGen(linePoints2);
      line.rotation.z = THREE.MathUtils.degToRad(72 * v);
      this.radiations2.add(line);
    }
    this.guidelines.add(this.radiations2);

    this.group.add(this.guidelines);
  }

  // アウトラインを作成
  generateOutline = () => {

    // アウトラインの幅
    const w = 4;
    // const w = 6;

    // 中心円
    const circles3 = [this.circle1, this.circle2, this.circle5];
    circles3.forEach((circle) => {
      const point0 = this.curvePointGen(circle.a, circle.b, circle.r + w, 0, 360, false);
      const point1 = this.curvePointGen(circle.a, circle.b, circle.r - w, 0, 360, false);
      const geo = this.shapeGeoGen(point0, point1);
      const mesh = new THREE.Mesh(geo, this.outlineMat);
      this.outlines.add(mesh);
    })

    // ５つの周回円
    const circles4 = [this.circle6];
    circles4.forEach((circle) => {
      const point0 = this.curvePointGen(circle.a, circle.b, circle.r + w, 0, 360, false);
      const point1 = this.curvePointGen(circle.a, circle.b, circle.r - w, 0, 360, false);
      const geo = this.shapeGeoGen(point0, point1);
      for (var v = 0;v <= 4;v ++) {
        const mesh = new THREE.Mesh(geo, this.outlineMat);
        mesh.rotation.z = THREE.MathUtils.degToRad(72 * v);
        this.outlines.add(mesh);
      }
    })

    // 五角形
    const pentaShapes = [], pentaPathes = [];
    const xw = w + 1;
    for (var i = 0;i <= 4;i ++) {
      const circle = this.circle4;
      const angle = 54 + (72 * i);
      const apex1 = this.circle(circle.a, circle.b, circle.r + xw, angle);
      const apex2 = this.circle(circle.a, circle.b, circle.r - xw, angle);
      pentaShapes.push(apex1);
      pentaPathes.push(apex2);
    }
    const pentaGeo = this.shapeGeoGen(pentaShapes, pentaPathes);
    const pentaMesh = new THREE.Mesh(pentaGeo, this.outlineMat);
    this.outlines.add(pentaMesh);

    // 放射線
    const form = {a: 1, b: 0, c: 0};
    const apex1 = this.pentaInters[0];
    const apex2 = new THREE.Vector3(- 200 , 0, 0);
    // const theta = Math.atan(- 1 / form.a);
    // console.log(THREE.MathUtils.radToDeg(theta))
    const theta = THREE.MathUtils.degToRad(90);
    const p = w * Math.cos(theta);
    const q = w * Math.sin(theta);
    const apexD1 = new THREE.Vector3(apex1.x + p, apex1.y + q, 0);
    const apexD2 = new THREE.Vector3(apex1.x - p, apex1.y - q, 0);
    const apexD3 = new THREE.Vector3(apex2.x - p, apex2.y - q, 0);
    const apexD4 = new THREE.Vector3(apex2.x + p, apex2.y + q, 0);
    const points = [apexD1, apexD2, apexD3, apexD4];
    const geo = this.shapeGeoGen(points);
    for (var v = 0;v <= 9;v ++) {
      const mesh = new THREE.Mesh(geo, this.outlineMat);
      mesh.rotation.z = THREE.MathUtils.degToRad(36 * v);
      this.outlines.add(mesh);
    }

    this.group.add(this.outlines, this.outlineEdges);
  }

  // 塗りつぶし図形を生成
  generateShape = () => {

    // 外周円
    const c1 = this.circle1;
    const c2 = this.circle2;
    const outerCircleShape = this.curvePointGen(c1.a, c1.b, c1.r, 0, 360, false);
    const outerCirclePath  = this.curvePointGen(c2.a, c2.b, c2.r, 0, 360, false);
    const outerCircleGeo   = this.shapeGeoGen(outerCircleShape, outerCirclePath);
    const outerCircleMesh  = new THREE.Mesh(outerCircleGeo, this.shapeMat);
    this.shapes.add(outerCircleMesh);

    // 中心円
    const c5 = this.circle5;
    const innerCircleshape = this.curvePointGen(c5.a, c5.b, c5.r, 0, 360, false);
    const innerCircleGeo = this.shapeGeoGen(innerCircleshape);
    const innerCircleMesh = new THREE.Mesh(innerCircleGeo, this.shapeMat);
    this.shapes.add(innerCircleMesh);

    // ５つの周回円
    const c6 = this.circle6;
    const fiveCircleShape = this.curvePointGen(c6.a, c6.b, c6.r, 0, 360, false);
    const fiveCircleGeo = this.shapeGeoGen(fiveCircleShape);
    for (var i = 0;i <= 4;i ++) {
      const fiveCircleMesh = new THREE.Mesh(fiveCircleGeo, this.shapeMat);
      fiveCircleMesh.rotation.z = THREE.MathUtils.degToRad(- 72) * i;
      this.shapes.add(fiveCircleMesh);
    }

    // 五角形
    // const pentaShape = new THREE.Shape(this.pentaApices);
    // const circlePath = this.curvePointGen(c5.a, c5.b, c5.r + 6, 0, 360, false);
    // const pentaPath = new THREE.Path(circlePath);
    // // pentaShape.holes.push(pentaPath);

    // const form = {a: 1, b: 0, c: 0};
    // const apex1 = this.pentaInters[0];
    // // const apex2 = this.pentaInters[1];
    // const apex2 = new THREE.Vector3(- 200 , 0, 0);
    // // const theta = Math.atan(- 1 / form.a);
    // const theta = THREE.MathUtils.degToRad(90);
    // const p = 6 * Math.cos(theta);
    // const q = 6 * Math.sin(theta);
    // const apexD1 = new THREE.Vector3(apex1.x + p, apex1.y + q, 0);
    // const apexD2 = new THREE.Vector3(apex1.x - p, apex1.y - q, 0);
    // const apexD3 = new THREE.Vector3(apex2.x - p, apex2.y - q, 0);
    // const apexD4 = new THREE.Vector3(apex2.x + p, apex2.y + q, 0);
    // // const apexD1 = new THREE.Vector3(-50, 300, 0);
    // // const apexD2 = new THREE.Vector3( 50, 300, 0);
    // // const apexD3 = new THREE.Vector3( 50, 250, 0);
    // // const apexD4 = new THREE.Vector3(-50, 250, 0);
    // const points = [apexD1, apexD4, apexD3, apexD2];
    // console.log(points)
    // // circlePath.concat(points);
    // const path = new THREE.Path(points);
    // // const geo = this.shapeGeoGen(points);
    // // for (var v = 0;v <= 9;v ++) {
    //   // path.rotation.z = THREE.MathUtils.degToRad(36 * v);
    // // const circlePath2 = this.curvePointGen(0, 250, 50, 0, 360, false);
    // // const pentaPath2 = new THREE.Path(circlePath2);
    // pentaShape.holes.push(path);
    // pentaShape.holes.push(pentaPath);
    //   // const mesh = new THREE.Mesh(geo, this.outlineMat);
    //   // mesh.rotation.z = THREE.MathUtils.degToRad(36 * v);
    //   // this.outlines.add(mesh);
    // // }


    // const pentaGeo = new THREE.ShapeGeometry(pentaShape);
    // const pentaMesh = new THREE.Mesh(pentaGeo, this.shapeMat);
    // this.shapes.add(pentaMesh);

    // const theta0 = THREE.MathUtils.radToDeg(Math.asin(20 / 230));
    // const arcPoint1 = this.curvePointGen(0, 0, 230,  - 72 - theta0, - 108 + theta0, true);
    // const points1 = [this.apex5, this.apex3, this.apex2].concat(arcPoint1);
    // const arcPoint2 = this.curvePointGen(0, 0, 230,    72 + theta0,   108 - theta0, false);
    // const points2 = [this.apex9, this.apex7].concat(arcPoint2);

    // const lineGeo1 = this.shapeGeoGen(points1);
    // const lineGeo2 = this.shapeGeoGen(points2);
    // for (var i = 0;i <= 4;i ++) {
    //   const line1  = new THREE.Mesh(lineGeo1, this.shapeMat);
    //   const line2  = new THREE.Mesh(lineGeo2, this.shapeMat);
    //   line1.rotation.z = THREE.MathUtils.degToRad(- 72 * i);
    //   line2.rotation.z = THREE.MathUtils.degToRad(- 72 * i);
    //   this.shapes.add(line1, line2);
    // }

    this.group.add(this.shapes);
  }

  // ガイドラインの表示制御
  guidelineDisplayControl = (progRatio) => {
    const p = this.guidelineParams;
    const inRatio  = THREE.MathUtils.smoothstep(progRatio, p.inStart, p.inEnd);
    const outRatio = THREE.MathUtils.smoothstep(progRatio, p.outStart, p.outEnd);

    const circlesInRatio1 = THREE.MathUtils.smoothstep(inRatio, 0.0, 0.3);
    const radiationsDrawRatio1 = THREE.MathUtils.smoothstep(inRatio, 0.2, 0.4);
    const fiveCirclesDrawRatio = THREE.MathUtils.smoothstep(inRatio, 0.3, 0.55);
    const circlesInRatio2 = THREE.MathUtils.smoothstep(inRatio, 0.4, 0.7);
    const pentagonInRatio = THREE.MathUtils.smoothstep(inRatio, 0.65, 0.85);
    const radiationsDrawRatio2 = THREE.MathUtils.smoothstep(inRatio, 0.8, 1.0);

    // 中心円１
    for (var i = 0;i <= this.circles1.children.length - 1;i ++) {
      const maxDelay = 0.1 * this.circles1.children.length;
      const delay = 0.1 * i;
      const circlesInRatio1D = THREE.MathUtils.inverseLerp(delay, 1.0 + delay - maxDelay, circlesInRatio1);
      const mesh = this.circles1.children[i];
      mesh.geometry.setDrawRange(0, this.divCount * circlesInRatio1D);
      mesh.material.opacity = 1.0 - outRatio;
      if (outRatio >= 1.0) {
        mesh.visible = false;
      } else {
        mesh.visible = true;
      }
    }
    // 放射線１
    for (var i = 0;i <= this.radiations1.children.length - 1;i ++) {
      const maxDelay = 0.1 * this.circles1.children.length;
      const delay = 0.1 * i;
      const ratioD = THREE.MathUtils.inverseLerp(delay, 1.0 + delay - maxDelay, radiationsDrawRatio1);
      const mesh = this.radiations1.children[i];
      mesh.geometry.setDrawRange(0, this.divCount * ratioD);
      mesh.material.opacity = 1.0 - outRatio;
      if (outRatio >= 1.0) {
        mesh.visible = false;
      } else {
        mesh.visible = true;
      }
    }

    // 周回円
    for (var i = 0;i <= this.fiveCircles.children.length - 1;i ++) {
      const maxDelay = 0.1 * this.circles1.children.length;
      const delay = 0.1 * i;
      const ratioD = THREE.MathUtils.inverseLerp(delay, 1.0 + delay - maxDelay, fiveCirclesDrawRatio);
      const mesh = this.fiveCircles.children[i];
      mesh.geometry.setDrawRange(0, this.divCount * ratioD);
      mesh.material.opacity = 1.0 - outRatio;
      if (outRatio >= 1.0) {
        mesh.visible = false;
      } else {
        mesh.visible = true;
      }
    }

    // 中心円２
    for (var i = 0;i <= this.circles2.children.length - 1;i ++) {
      const maxDelay = 0.06 * this.circles2.children.length;
      const delay = 0.06 * i;
      const ratioD = THREE.MathUtils.inverseLerp(delay, 1.0 + delay - maxDelay, circlesInRatio2);
      const mesh = this.circles2.children[i];
      mesh.geometry.setDrawRange(0, this.divCount * ratioD);
      mesh.material.opacity = 1.0 - outRatio;
      if (outRatio >= 1.0) {
        mesh.visible = false;
      } else {
        mesh.visible = true;
      }
    }

    // 五角形
    for (var i = 0;i <= this.pentagon.children.length - 1;i ++) {
      const maxDelay = 0.1 * this.pentagon.children.length;
      const delay = 0.1 * i;
      const ratioD = THREE.MathUtils.inverseLerp(delay, 1.0 + delay - maxDelay, pentagonInRatio);
      const mesh = this.pentagon.children[i];
      mesh.geometry.setDrawRange(0, this.divCount * ratioD);
      mesh.material.opacity = 1.0 - outRatio;
      if (outRatio >= 1.0) {
        mesh.visible = false;
      } else {
        mesh.visible = true;
      }
    }

    // 放射線２
    for (var i = 0;i <= this.radiations2.children.length - 1;i ++) {
      const maxDelay = 0.1 * this.circles1.children.length;
      const delay = 0.1 * i;
      const ratioD = THREE.MathUtils.inverseLerp(delay, 1.0 + delay - maxDelay, radiationsDrawRatio2);
      const mesh = this.radiations2.children[i];
      mesh.geometry.setDrawRange(0, this.divCount * ratioD);
      mesh.material.opacity = 1.0 - outRatio;
      if (outRatio >= 1.0) {
        mesh.visible = false;
      } else {
        mesh.visible = true;
      }
    }

  }

  // アウトラインの表示制御
  outlineDisplayControl = (progRatio) => {
    const p = this.outlineParams;
    const inRatio  = THREE.MathUtils.smoothstep(progRatio, p.inStart, p.inEnd);
    const outRatio = THREE.MathUtils.smoothstep(progRatio, p.outStart, p.outEnd);
    const control = (mesh) => {
      mesh.material.opacity = inRatio - outRatio;
      if (outRatio >= 1.0) {
        mesh.visible = false;
      } else {
        mesh.visible = true;
      }
    }
    this.outlines.children.forEach((child) => {
      if (child.isGroup) {
        child.children.forEach((mesh) => control(mesh));
      } else {
        control(child);
      }
    });
    this.outlineEdges.children.forEach((mesh) => {
      mesh.material.opacity = inRatio - outRatio * 1.8;
    });
  }

  // 図形のアニメーション制御
  shapeRotationControl(progRatio) {
    const p = this.shapeRotParams;
    var ratio = THREE.MathUtils.smootherstep(progRatio, p.start, p.end);
    for (var i = 0;i <= this.shapes.children.length - 1;i ++) {
      const shape = this.shapes.children[i];
      const j = i - 1;
      const num = Math.trunc(j / 2);
      const adjust1 = 80;
      const adjust2 = 20;
      var ratioSx, ratioSy;
      if (ratio < 0.1 + num / adjust1) {
        ratioSx = THREE.MathUtils.mapLinear(ratio, 0.0, 0.1 + num / adjust1, 1.0, 0.3);
        ratioSy = THREE.MathUtils.mapLinear(ratio, 0.0, 0.1 + num / adjust1, 1.0, 0.3);
      } else if (ratio < 0.4 + num / adjust2) {
        ratioSx = 0.3;
        ratioSy = 0.3;
      } else {
        ratioSx = THREE.MathUtils.mapLinear(ratio, 0.4 + num / adjust2, 1.0, 0.3, 1.0);
        ratioSy = THREE.MathUtils.mapLinear(ratio, 0.4 + num / adjust2, 1.0, 0.3, 1.0);
      }
      shape.scale.set(ratioSx, ratioSy)
      this.shapes.rotation.z = 720 * ratio * (Math.PI / 180);
    }
  }

}
