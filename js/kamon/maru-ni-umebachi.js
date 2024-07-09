'use strict';

import * as THREE from 'three';
import Kamon from '../kamon.js';

export default class MaruNiUmebachi extends Kamon {

  constructor() {

    super();

    this.pathW = 27;
    this.verNum = 5;
    this.vertices = [];
    this.sides = [];

    // infoのテキスト
    this.jpNameText = '丸に梅鉢';
    this.jpDescText = '梅鉢紋とは梅の花を図案化した家紋の一種で、中心から放射状に伸びた花弁の図案が太鼓のバチに似ていることに由来すると言われています。学問の神として知られ、梅をこよなく愛した菅原道真を祀る天満宮が神紋として梅鉢紋を用いたことから、天神信仰と共に日本各地に広がったとされています。';
    this.enNameText = 'Maru-ni-umebachi';
    this.enDescText = 'The Umebachi crest is a type of family crest that depicts a plum blossom, and is said to derive from the fact that the pattern of petals radiating from the center resembles the drumsticks of a drum. Tenmangu Shrine, which is dedicated to Michizane Sugawara, who was known as the god of learning and loved plums, used the plum bowl crest as a divine crest, and it is said that it spread throughout Japan along with Tenjin worship.';

    // ガイドラインの表示アニメーションパラメータ
    this.guidelineParams = {
      inStart : 0.05,
      inEnd   : 0.5,
      outStart: 0.55,
      outEnd  : 0.6,
      gDelay  : 0.03,
      lDelay  : 0.06,
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
      outEnd  : 1.0,
    }

    // 図形の回転アニメーションパラメータ
    this.shapeRotParams = {
      start : 0.7,
      end   : 0.85,
    }

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

    // 外周円
    this.outerCircles = new THREE.Group();
    const outerRs = [1600, 1310];
    outerRs.forEach((r) => {
      const points = this.circlePointGen(0, 0, r, 90, 450, this.divCount);
      const circle = this.guidelineGen(points);
      this.outerCircles.add(circle);
    });
    this.guidelines.add(this.outerCircles);

    // ５つの周回円
    this.fiveCircles = new THREE.Group();
    for (var v = 0;v <= this.verNum - 1;v ++) {
      const circlePoints = this.circlePointGen(0, 815, 445, 90, 450, this.divCount);
      const circle = this.guidelineGen(circlePoints);
      this.fiveCircles.add(circle);
    }
    this.guidelines.add(this.fiveCircles);

    // 五角形
    this.pentagon = new THREE.Group();
    this.vertices = [];
    this.coefs = [];
    for (var i = 0;i <= this.verNum - 1;i ++) {
      const r1 = 270 + ((360 / this.verNum) * i);
      const r2 = 270 + ((360 / this.verNum) * (i + 1));
      const v1 = this.circle(0, 0, 405, r1);
      const v2 = this.circle(0, 0, 405, r2);
      this.vertices.push(v1);
      const coef = this.from2Points(v1.x, v1.y, v2.x, v2.y);
      this.coefs.push(coef);
      const points = this.linePointGen(coef.a, 1, coef.b, v1.x, v2.x, this.divCount);
      const line = this.guidelineGen(points);
      this.pentagon.add(line);
    }
    this.guidelines.add(this.pentagon);

    // 内周円
    this.innerCircles = new THREE.Group();
    const innerRs = [405, 230, 200];
    innerRs.forEach((r) => {
      const points = this.circlePointGen(0, 0, r, 90, 450, this.divCount);
      const circle = this.guidelineGen(points);
      this.innerCircles.add(circle);
    });
    this.guidelines.add(this.innerCircles);

    // １０本の放射線
    this.radiations = new THREE.Group();
    for (var v = 0;v <= this.verNum - 1;v ++) {
      const linePoints1 = this.linePointGen(1, 0,   20, 425, - 425, this.divCount);
      const linePoints2 = this.linePointGen(1, 0, - 20, 425, - 425, this.divCount);
      const line1 = this.guidelineGen(linePoints1);
      const line2 = this.guidelineGen(linePoints2);
      this.radiations.add(line1, line2);
    }
    this.guidelines.add(this.radiations);

    this.group.add(this.guidelines);
  }

  // アウトラインを作成
  generateOutline = () => {

    // 外周円１
    const outerCirclePoint0 = this.curvePointGen(0, 0, 1606, 0, 360, false);
    const outerCirclePoint1 = this.curvePointGen(0, 0, 1594, 0, 360, false);
    const outerCircleGeo0 = this.shapeGeoGen(outerCirclePoint0, outerCirclePoint1);
    const outerCircleMesh0 = new THREE.Mesh(outerCircleGeo0, this.outlineMat);
    this.outlines.add(outerCircleMesh0);

    // 外周円２
    const outerCirclePoint2 = this.curvePointGen(0, 0, 1316, 0, 360, false);
    const outerCirclePoint3 = this.curvePointGen(0, 0, 1304, 0, 360, false);
    const outerCircleGeo1 = this.shapeGeoGen(outerCirclePoint2, outerCirclePoint3);
    const outerCircleMesh1 = new THREE.Mesh(outerCircleGeo1, this.outlineMat);
    this.outlines.add(outerCircleMesh1);

    // ５つの周回円
    const fiveCirclePoint0 = this.curvePointGen(0, 815, 451, 0, 360, false);
    const fiveCirclePoint1 = this.curvePointGen(0, 815, 439, 0, 360, false);
    const fiveCircleGeo = this.shapeGeoGen(fiveCirclePoint0, fiveCirclePoint1);
    for (var i = 0;i <= 4;i ++) {
      const fiveCircleMesh = new THREE.Mesh(fiveCircleGeo, this.outlineMat);
      fiveCircleMesh.rotation.z = THREE.MathUtils.degToRad(- 72) * i;
      this.outlines.add(fiveCircleMesh);
    }

    // 中心円
    const innerCirclePoint0 = this.curvePointGen(0, 0, 206, 0, 360, false);
    const innerCirclePoint1 = this.curvePointGen(0, 0, 194, 0, 360, false);
    const innerCircleGeo = this.shapeGeoGen(innerCirclePoint0, innerCirclePoint1);
    const innerCircleMesh = new THREE.Mesh(innerCircleGeo, this.outlineMat);
    this.outlines.add(innerCircleMesh);

    // 五角形
    const theta0 = THREE.MathUtils.radToDeg(Math.asin(20 / 230));

    const arcPoint1 = this.curvePointGen(0, 0, 224,  - 72 - theta0, - 108 + theta0, true);
    const arcPoint2 = this.curvePointGen(0, 0, 236, - 108 + theta0,  - 72 - theta0, false);
    const arcPoints = arcPoint1.concat(arcPoint2);
    const arcGeo = this.shapeGeoGen(arcPoints);

    const rad1 = THREE.MathUtils.degToRad(18 - theta0);
    const x = 230 * Math.sin(rad1);
    const y = - 230 * Math.cos(rad1);

    const coef = this.from2Points(- 20, 0, x, y);
    this.apex1 = new THREE.Vector3(x, y, 0);
    this.apex2 = this.getIntersect(coef.a, coef.b, this.coefs[0].a, this.coefs[0].b);
    this.apex3 = this.vertices[0];
    this.apex4 = new THREE.Vector3(- this.apex1.x, this.apex1.y, 0);
    this.apex5 = new THREE.Vector3(- this.apex2.x, this.apex2.y, 0);

    const p0 = Math.abs(6 * Math.cos(rad1));
    const q0 = Math.abs(6 * Math.sin(rad1));

    const startD1 = new THREE.Vector3(this.apex1.x + p0, this.apex1.y + q0, 0);
    const endD1   = new THREE.Vector3(this.apex2.x + p0, this.apex2.y + q0, 0);
    const startD2 = new THREE.Vector3(this.apex1.x - p0, this.apex1.y - q0, 0);
    const endD2   = new THREE.Vector3(this.apex2.x - p0, this.apex2.y - q0, 0);

    const lineGeo0 = this.shapeGeoGen([startD1, endD1, endD2, startD2]);

    const theta1 = THREE.MathUtils.degToRad(90) - Math.atan(this.coefs[0].a);
    const p1 = Math.abs(6 * Math.cos(theta1));
    const q1 = Math.abs(6 * Math.sin(theta1));

    const startD3 = new THREE.Vector3(this.apex2.x + p1, this.apex2.y - q1, 0);
    const endD3   = new THREE.Vector3(this.apex3.x + p1, this.apex3.y - q1, 0);
    const startD4 = new THREE.Vector3(this.apex2.x - p1, this.apex2.y + q1, 0);
    const endD4   = new THREE.Vector3(this.apex3.x - p1, this.apex3.y + q1, 0);

    const lineGeo1 = this.shapeGeoGen([startD3, endD3, endD4, startD4]);

    const coef2 = this.from2Points(- 20, 0, this.apex1.x, - this.apex1.y);
    this.apex6 = new THREE.Vector3(  this.apex1.x, - this.apex1.y, 0);
    this.apex7 = this.getIntersect(coef2.a, coef2.b, this.coefs[2].a, this.coefs[2].b);
    this.apex8 = new THREE.Vector3(- this.apex6.x,   this.apex6.y, 0);
    this.apex9 = new THREE.Vector3(- this.apex7.x,   this.apex7.y, 0);

    const startD5 = new THREE.Vector3(this.apex6.x + p0, this.apex6.y - q0, 0);
    const endD5   = new THREE.Vector3(this.apex7.x + p0, this.apex7.y - q0, 0);
    const startD6 = new THREE.Vector3(this.apex6.x - p0, this.apex6.y + q0, 0);
    const endD6   = new THREE.Vector3(this.apex7.x - p0, this.apex7.y + q0, 0);

    const lineGeo2 = this.shapeGeoGen([startD5, endD5, endD6, startD6]);

    const startD7 = new THREE.Vector3(this.apex7.x, this.apex7.y + 6, 0);
    const endD7   = new THREE.Vector3(this.apex9.x, this.apex9.y + 6, 0);
    const startD8 = new THREE.Vector3(this.apex7.x, this.apex7.y - 6, 0);
    const endD8   = new THREE.Vector3(this.apex9.x, this.apex9.y - 6, 0);

    const lineGeo3 = this.shapeGeoGen([startD7, endD7, endD8, startD8]);

    const edgePoint0 = this.curvePointGen(this.apex1.x, this.apex1.y, 6, 0, 360, false);
    const edgePoint1 = this.curvePointGen(this.apex2.x, this.apex2.y, 6, 0, 360, false);
    const edgePoint2 = this.curvePointGen(this.apex3.x, this.apex3.y, 6, 0, 360, false);
    const edgePoint3 = this.curvePointGen(this.apex6.x, this.apex6.y, 6, 0, 360, false);
    const edgePoint4 = this.curvePointGen(this.apex7.x, this.apex7.y, 6, 0, 360, false);

    const edgeShape0 = new THREE.Shape(edgePoint0);
    const edgeShape1 = new THREE.Shape(edgePoint1);
    const edgeShape2 = new THREE.Shape(edgePoint2);
    const edgeShape3 = new THREE.Shape(edgePoint3);
    const edgeShape4 = new THREE.Shape(edgePoint4);

    const edgeGeo0 = new THREE.ShapeGeometry(edgeShape0);
    const edgeGeo1 = new THREE.ShapeGeometry(edgeShape1);
    const edgeGeo2 = new THREE.ShapeGeometry(edgeShape2);
    const edgeGeo3 = new THREE.ShapeGeometry(edgeShape3);
    const edgeGeo4 = new THREE.ShapeGeometry(edgeShape4);

    for (var i = 0;i <= 4;i ++) {
      const arc1  = new THREE.Mesh(arcGeo,   this.outlineMat);
      const arc2  = new THREE.Mesh(arcGeo,   this.outlineMat);
      const line1 = new THREE.Mesh(lineGeo0, this.outlineMat);
      const line2 = new THREE.Mesh(lineGeo0, this.outlineMat);
      const line3 = new THREE.Mesh(lineGeo1, this.outlineMat);
      const line4 = new THREE.Mesh(lineGeo1, this.outlineMat);
      const line5 = new THREE.Mesh(lineGeo2, this.outlineMat);
      const line6 = new THREE.Mesh(lineGeo2, this.outlineMat);
      const line7 = new THREE.Mesh(lineGeo3, this.outlineMat);
      const edge0 = new THREE.Mesh(edgeGeo0, this.edgeMat);
      const edge1 = new THREE.Mesh(edgeGeo1, this.edgeMat);
      const edge2 = new THREE.Mesh(edgeGeo2, this.edgeMat);
      const edge3 = new THREE.Mesh(edgeGeo0, this.edgeMat);
      const edge4 = new THREE.Mesh(edgeGeo1, this.edgeMat);
      const edge5 = new THREE.Mesh(edgeGeo3, this.edgeMat);
      const edge6 = new THREE.Mesh(edgeGeo4, this.edgeMat);
      const edge7 = new THREE.Mesh(edgeGeo3, this.edgeMat);
      const edge8 = new THREE.Mesh(edgeGeo4, this.edgeMat);

      const rad2 = THREE.MathUtils.degToRad(- 72 * i);
      const rad3 = THREE.MathUtils.degToRad(180);

      arc1.rotation.set(    0,    0, rad2);
      arc2.rotation.set( rad3,    0, rad2);

      line1.rotation.set(   0,    0, rad2);
      line2.rotation.set(   0, rad3, rad2);
      line3.rotation.set(   0,    0, rad2);
      line4.rotation.set(   0, rad3, rad2);
      line5.rotation.set(   0,    0, rad2);
      line6.rotation.set(   0, rad3, rad2);
      line7.rotation.set(   0,    0, rad2);

      edge0.rotation.set(   0,    0, rad2);
      edge1.rotation.set(   0,    0, rad2);
      edge2.rotation.set(   0,    0, rad2);
      edge3.rotation.set(   0, rad3, rad2);
      edge4.rotation.set(   0, rad3, rad2);
      edge5.rotation.set(   0,    0, rad2);
      edge6.rotation.set(   0,    0, rad2);
      edge7.rotation.set(   0, rad3, rad2);
      edge8.rotation.set(   0, rad3, rad2);

      this.outlines.add(arc1, arc2, line1, line2, line3, line4, line5, line6, line7);
      this.outlineEdges.add(edge0, edge1, edge2, edge3, edge4, edge5, edge6, edge7, edge8);
    }

    this.group.add(this.outlines, this.outlineEdges);
  }

  // 塗りつぶし図形を生成
  generateShape = () => {

    // 外周円
    const outerCircleShape = this.curvePointGen(0, 0, 1600, 0, 360, false);
    const outerCirclePath  = this.curvePointGen(0, 0, 1310, 0, 360, false);
    const outerCircleGeo   = this.shapeGeoGen(outerCircleShape, outerCirclePath);
    const outerCircleMesh  = new THREE.Mesh(outerCircleGeo, this.shapeMat);
    this.shapes.add(outerCircleMesh);

    // 中心円
    const innerCircleshape = this.curvePointGen(0, 0, 200, 0, 360, false);
    const innerCircleGeo = this.shapeGeoGen(innerCircleshape);
    const innerCircleMesh = new THREE.Mesh(innerCircleGeo, this.shapeMat);
    this.shapes.add(innerCircleMesh);

    // ５つの周回円
    const fiveCircleShape = this.curvePointGen(0, 815, 451, 0, 360, false);
    const fiveCircleGeo = this.shapeGeoGen(fiveCircleShape);
    for (var i = 0;i <= 4;i ++) {
      const fiveCircleMesh = new THREE.Mesh(fiveCircleGeo, this.shapeMat);
      fiveCircleMesh.rotation.z = THREE.MathUtils.degToRad(- 72) * i;
      this.shapes.add(fiveCircleMesh);
    }

    // 五角形
    const theta0 = THREE.MathUtils.radToDeg(Math.asin(20 / 230));
    const arcPoint1 = this.curvePointGen(0, 0, 230,  - 72 - theta0, - 108 + theta0, true);
    const points1 = [this.apex5, this.apex3, this.apex2].concat(arcPoint1);
    const arcPoint2 = this.curvePointGen(0, 0, 230,    72 + theta0,   108 - theta0, false);
    const points2 = [this.apex9, this.apex7].concat(arcPoint2);

    const lineGeo1 = this.shapeGeoGen(points1);
    const lineGeo2 = this.shapeGeoGen(points2);
    for (var i = 0;i <= 4;i ++) {
      const line1  = new THREE.Mesh(lineGeo1, this.shapeMat);
      const line2  = new THREE.Mesh(lineGeo2, this.shapeMat);
      line1.rotation.z = THREE.MathUtils.degToRad(- 72 * i);
      line2.rotation.z = THREE.MathUtils.degToRad(- 72 * i);
      this.shapes.add(line1, line2);
    }

    this.group.add(this.shapes);
  }

  // ガイドラインの表示制御
  guidelineDisplayControl = (progRatio) => {
    const p = this.guidelineParams;
    const inRatio  = THREE.MathUtils.smoothstep(progRatio, p.inStart, p.inEnd);
    const outRatio = THREE.MathUtils.smoothstep(progRatio, p.outStart, p.outEnd);

    const outerCirclesInRatio = THREE.MathUtils.smoothstep(inRatio, 0.0, 0.35);
    const innerCirclesInRatio = THREE.MathUtils.smoothstep(inRatio, 0.1, 0.4);
    const pentagonInRatio = THREE.MathUtils.smoothstep(inRatio, 0.25, 0.75);
    const fiveCirclesDrawRatio = THREE.MathUtils.smoothstep(inRatio, 0.6, 0.8);
    const fiveCirclesRotateRatio = THREE.MathUtils.smoothstep(inRatio, 0.8, 1.0);
    const radiationsDrawRatio1 = THREE.MathUtils.smoothstep(inRatio, 0.65, 0.8);
    const radiationsDrawRatio2 = THREE.MathUtils.smoothstep(inRatio, 0.7, 0.85);
    const radiationsRotateRatio = THREE.MathUtils.smoothstep(inRatio, 0.85, 1.0);

    // 外周円
    for (var i = 0;i <= this.outerCircles.children.length - 1;i ++) {
      const maxDelay = 0.06 * this.outerCircles.children.length;
      const delay = 0.06 * i;
      const outerCirclesInRatioD = THREE.MathUtils.inverseLerp(delay, 1.0 + delay - maxDelay, outerCirclesInRatio);
      const mesh = this.outerCircles.children[i];
      mesh.geometry.setDrawRange(0, this.divCount * outerCirclesInRatioD);
      mesh.material.opacity = 1.0 - outRatio;
      if (outRatio >= 1.0) {
        mesh.visible = false;
      } else {
        mesh.visible = true;
      }
    }

    // ５つの周回円
    for (var i = 0;i <= this.fiveCircles.children.length - 1;i ++) {
      const mesh = this.fiveCircles.children[i];
      mesh.geometry.setDrawRange(0, this.divCount * fiveCirclesDrawRatio);
      mesh.rotation.z = THREE.MathUtils.degToRad(72) * i * fiveCirclesRotateRatio;
      mesh.material.opacity = 1.0 - outRatio;
      if (outRatio >= 1.0) {
        mesh.visible = false;
      } else {
        mesh.visible = true;
      }
    }

    // 五角形
    for (var i = 0;i <= this.pentagon.children.length - 1;i ++) {
      const maxDelay = 0.06 * this.pentagon.children.length;
      const delay = 0.06 * i;
      const pentagonInRatioD = THREE.MathUtils.inverseLerp(delay, 1.0 + delay - maxDelay, pentagonInRatio);
      const mesh = this.pentagon.children[i];
      mesh.geometry.setDrawRange(0, this.divCount * pentagonInRatioD);
      mesh.material.opacity = 1.0 - outRatio;
      if (outRatio >= 1.0) {
        mesh.visible = false;
      } else {
        mesh.visible = true;
      }
    }

    // 内周円
    for (var i = 0;i <= this.innerCircles.children.length - 1;i ++) {
      const maxDelay = 0.06 * this.innerCircles.children.length;
      const delay = 0.06 * i;
      const innerCirclesInRatioD = THREE.MathUtils.inverseLerp(delay, 1.0 + delay - maxDelay, innerCirclesInRatio);
      const mesh = this.innerCircles.children[i];
      mesh.geometry.setDrawRange(0, this.divCount * innerCirclesInRatioD);
      mesh.material.opacity = 1.0 - outRatio;
      if (outRatio >= 1.0) {
        mesh.visible = false;
      } else {
        mesh.visible = true;
      }
    }

    // １０本の放射線
    for (var i = 0;i <= this.radiations.children.length - 1;i ++) {
      const mesh = this.radiations.children[i];
      const radiationsDrawRatioD = i % 2 == 0 ? radiationsDrawRatio1 : radiationsDrawRatio2;
      mesh.geometry.setDrawRange(0, this.divCount * radiationsDrawRatioD);
      mesh.rotation.z = (THREE.MathUtils.degToRad(18) + THREE.MathUtils.degToRad(36) * Math.trunc(i / 2 + 1)) * radiationsRotateRatio;
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
