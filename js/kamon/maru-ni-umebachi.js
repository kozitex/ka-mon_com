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
    this.jpDescText = '桔梗の花を図案化した家紋です。桔梗の漢字のつくりから「更に吉（さらによし）」という語呂が縁起が良いとされ、多くの家の家紋として使用されていました。この内、陰桔梗は戦国武将、明智光秀の家紋としても知られていますが、本能寺の変をきっかけに裏切り者の家紋として使用を憚られた時期があったと言われています。';
    this.enNameText = 'Maru-ni-umebachi';
    this.enDescText = 'This is a family crest with a design of a bellflower. Due to the kanji character for bellflower, the word "Moreyoshi" is said to bring good luck, and it was used as the family emblem of many families. Of these, Kagekikyo is also known as the family emblem of Sengoku warlord Akechi Mitsuhide, but it is said that there was a time when its use was discouraged as a traitor&#39;s family emblem in the wake of the Honnoji Incident.';

    // ガイドラインの表示アニメーションパラメータ
    this.guidelineParams = {
      inStart : 0.05,
      inEnd   : 0.3,
      outStart: 0.35,
      outEnd  : 0.45,
      gDelay  : 0.03,
      lDelay  : 0.06,
    }

    // アウトラインの表示アニメーションパラメータ
    this.outlineParams = {
      inStart : 0.3,
      inEnd   : 0.4,
      outStart: 0.45,
      outEnd  : 0.5,
    }

    // 図形の表示アニメーションパラメータ
    this.shapeParams = {
      inStart : 0.45,
      inEnd   : 0.6,
      outStart: 0.95,
      outEnd  : 1.0,
    }

    // 図形の回転アニメーションパラメータ
    this.shapeRotParams = {
      start : 0.6,
      end   : 0.8,
    }

  }

  // オブジェクトを生成
  init = () => {

    // ガイドラインの作成
    this.generateGuideline();

    // アウトラインの作成
    this.generateOutline();

    // 塗りつぶし図形の描画
    // this.generateShape();

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
      // const linePoints1 = this.linePointGen(0, 1,   20, - 425, 425, this.divCount);
      // const linePoints2 = this.linePointGen(0, 1, - 20, - 425, 425, this.divCount);
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

    const outerCirclePoint0 = this.curvePointGen(0, 0, 1606, 0, 360, false);
    const outerCirclePoint1 = this.curvePointGen(0, 0, 1594, 0, 360, false);
    const outerCircleGeo0 = this.shapeGeoGen(outerCirclePoint0, outerCirclePoint1);
    const outerCircleMesh0 = new THREE.Mesh(outerCircleGeo0, this.outlineMat);
    this.outlines.add(outerCircleMesh0);

    const outerCirclePoint2 = this.curvePointGen(0, 0, 1316, 0, 360, false);
    const outerCirclePoint3 = this.curvePointGen(0, 0, 1304, 0, 360, false);
    const outerCircleGeo1 = this.shapeGeoGen(outerCirclePoint2, outerCirclePoint3);
    const outerCircleMesh1 = new THREE.Mesh(outerCircleGeo1, this.outlineMat);
    this.outlines.add(outerCircleMesh1);

    for (var i = 0;i <= 4;i ++) {
      const fiveCirclePoint0 = this.curvePointGen(0, 815, 451, 0, 360, false);
      const fiveCirclePoint1 = this.curvePointGen(0, 815, 439, 0, 360, false);
      const fiveCircleGeo = this.shapeGeoGen(fiveCirclePoint0, fiveCirclePoint1);
      const fiveCircleMesh = new THREE.Mesh(fiveCircleGeo, this.outlineMat);
      fiveCircleMesh.rotation.z = THREE.MathUtils.degToRad(- 72) * i;
      this.outlines.add(fiveCircleMesh);
    }

    const innerCirclePoint0 = this.curvePointGen(0, 0, 206, 0, 360, false);
    const innerCirclePoint1 = this.curvePointGen(0, 0, 194, 0, 360, false);
    const innerCircleGeo = this.shapeGeoGen(innerCirclePoint0, innerCirclePoint1);
    const innerCircleMesh = new THREE.Mesh(innerCircleGeo, this.outlineMat);
    this.outlines.add(innerCircleMesh);



    const theta0 = THREE.MathUtils.radToDeg(Math.asin(20 / 230));

    const innerArcPoint0 = this.curvePointGen(0, 0, 224, - 72 - theta0, - 108 + theta0, true);
    const innerArcPoint1 = this.curvePointGen(0, 0, 236, - 108 + theta0, - 72 - theta0, false);
    const innerArcPoint2 = innerArcPoint0.concat(innerArcPoint1);
    const innerArcGeo1 = this.shapeGeoGen(innerArcPoint2);
    // const innerArcMesh1 = new THREE.Mesh(innerArcGeo1, this.outlineMat);
    // const innerArcMesh2 = new THREE.Mesh(innerArcGeo1, this.outlineMat);
    // innerArcMesh2.rotation.z = THREE.MathUtils.degToRad(- 36);
    // this.outlines.add(innerArcMesh1);

    // const a = - Math.tan(THREE.MathUtils.degToRad(18 - theta0));
    const x = 230 * Math.sin(THREE.MathUtils.degToRad(18 - theta0));
    const y = - 230 * Math.cos(THREE.MathUtils.degToRad(18 - theta0));

    const coef = this.from2Points(- 20, 0, x, y);
    const start0 = new THREE.Vector3(x, y, 0);
    const end0 = this.getIntersect(coef.a, coef.b, this.coefs[0].a, this.coefs[0].b);

    const p0 = Math.abs(6 * Math.cos(THREE.MathUtils.degToRad(18 - theta0)));
    const q0 = Math.abs(6 * Math.sin(THREE.MathUtils.degToRad(18 - theta0)));

    const startD1 = new THREE.Vector3(start0.x + p0, start0.y + q0, 0);
    const endD1 = new THREE.Vector3(end0.x + p0, end0.y + q0, 0);
    const startD2 = new THREE.Vector3(start0.x - p0, start0.y - q0, 0);
    const endD2 = new THREE.Vector3(end0.x - p0, end0.y - q0, 0);

    const geometry0 = this.shapeGeoGen([startD1, endD1, endD2, startD2]);
    // const mesh1 = new THREE.Mesh(geometry0, this.outlineMat);
    // const mesh2 = new THREE.Mesh(geometry0, this.outlineMat);
    // mesh2.rotation.y = THREE.MathUtils.degToRad(180);
    // this.outlines.add(mesh1, mesh2);

    const end1 = this.vertices[0];

    const theta1 = THREE.MathUtils.degToRad(90) - Math.atan(this.coefs[0].a);
    const p1 = Math.abs(6 * Math.cos(theta1));
    const q1 = Math.abs(6 * Math.sin(theta1));

    const startD3 = new THREE.Vector3(end0.x + p1, end0.y - q1, 0);
    const endD3 = new THREE.Vector3(end1.x + p1, end1.y - q1, 0);
    const startD4 = new THREE.Vector3(end0.x - p1, end0.y + q1, 0);
    const endD4 = new THREE.Vector3(end1.x - p1, end1.y + q1, 0);

    const geometry1 = this.shapeGeoGen([startD3, endD3, endD4, startD4]);
    // const mesh3 = new THREE.Mesh(geometry1, this.outlineMat);
    // const mesh4 = new THREE.Mesh(geometry1, this.outlineMat);
    // mesh4.rotation.y = THREE.MathUtils.degToRad(180);
    // this.outlines.add(mesh3, mesh4);

    const coef2 = this.from2Points(- 20, 0, start0.x, - start0.y);
    const end2 = this.getIntersect(coef2.a, coef2.b, this.coefs[2].a, this.coefs[2].b);

    const startD5 = new THREE.Vector3(start0.x + p0, - start0.y - q0, 0);
    const endD5 = new THREE.Vector3(end2.x + p0, end2.y - q0, 0);
    const startD6 = new THREE.Vector3(start0.x - p0, - start0.y + q0, 0);
    const endD6 = new THREE.Vector3(end2.x - p0, end2.y + q0, 0);

    const geometry2 = this.shapeGeoGen([startD5, endD5, endD6, startD6]);


    const startD7 = new THREE.Vector3(end2.x, end2.y + 6, 0);
    const endD7 = new THREE.Vector3(- end2.x, end2.y + 6, 0);
    const startD8 = new THREE.Vector3(end2.x, end2.y - 6, 0);
    const endD8 = new THREE.Vector3(- end2.x, end2.y - 6, 0);

    const geometry3 = this.shapeGeoGen([startD7, endD7, endD8, startD8]);


    for (var i = 0;i <= 4;i ++) {
      const innerArcMesh1 = new THREE.Mesh(innerArcGeo1, this.outlineMat);
      const innerArcMesh2 = new THREE.Mesh(innerArcGeo1, this.outlineMat);
      const mesh1 = new THREE.Mesh(geometry0, this.outlineMat);
      const mesh2 = new THREE.Mesh(geometry0, this.outlineMat);
      const mesh3 = new THREE.Mesh(geometry1, this.outlineMat);
      const mesh4 = new THREE.Mesh(geometry1, this.outlineMat);
      const mesh5 = new THREE.Mesh(geometry2, this.outlineMat);
      const mesh6 = new THREE.Mesh(geometry2, this.outlineMat);
      const mesh7 = new THREE.Mesh(geometry3, this.outlineMat);
      innerArcMesh1.rotation.z = THREE.MathUtils.degToRad(- 72 * i);
      innerArcMesh2.rotation.z = THREE.MathUtils.degToRad(- 72 * i);
      mesh1.rotation.z = THREE.MathUtils.degToRad(- 72 * i);
      mesh2.rotation.z = THREE.MathUtils.degToRad(- 72 * i);
      mesh3.rotation.z = THREE.MathUtils.degToRad(- 72 * i);
      mesh4.rotation.z = THREE.MathUtils.degToRad(- 72 * i);
      mesh5.rotation.z = THREE.MathUtils.degToRad(- 72 * i);
      mesh6.rotation.z = THREE.MathUtils.degToRad(- 72 * i);
      mesh7.rotation.z = THREE.MathUtils.degToRad(- 72 * i);
      innerArcMesh2.rotation.x = THREE.MathUtils.degToRad(180);
      mesh2.rotation.y = THREE.MathUtils.degToRad(180);
      mesh4.rotation.y = THREE.MathUtils.degToRad(180);
      mesh6.rotation.y = THREE.MathUtils.degToRad(180);
      this.outlines.add(innerArcMesh1, innerArcMesh2, mesh1, mesh2, mesh3, mesh4, mesh5, mesh6, mesh7);
    }

    // const innerArcPoint3 = this.curvePointGen(0, 0, 224, - 108 - theta, - 144 + theta, true);
    // const innerArcPoint4 = this.curvePointGen(0, 0, 236, - 144 + theta, - 108 - theta, false);
    // const innerArcPoint5 = innerArcPoint3.concat(innerArcPoint4);
    // const innerArcGeo2 = this.shapeGeoGen(innerArcPoint5);
    // const innerArcMesh2 = new THREE.Mesh(innerArcGeo2, this.outlineMat);
    // this.outlines.add(innerArcMesh2);


    // const circleGeo0 = this.outlineCircleGeoGen(0, 0, 191, 90, 450, this.divCount);
    // const w = 6;
    // for (var g = - w;g <= w;g ++) {
    //   const mesh = this.outlineCircleMeshGen(circleGeo0, 0, 0, 191, g, 0, 0, 0);
    //   this.outlines.add(mesh);
    // }

    // // 小さい円の弧
    // const circleGeo1 = this.outlineCircleGeoGen(0, 520 - this.pathW, this.pathW, 90, 180, this.divCount);
    // for (var i = 0;i <= this.verNum - 1;i ++) {
    //   for (var j = 0;j <= 1;j ++) {
    //     const w = 6;
    //     for (var g = - w;g <= w;g ++) {
    //       const rotY = THREE.MathUtils.degToRad(- 180 * j);
    //       const rotZ = THREE.MathUtils.degToRad(- (360 / this.verNum) * i);
    //       const mesh  = this.outlineCircleMeshGen(circleGeo1, 0, 520 - this.pathW, this.pathW, g, 0, rotY, rotZ);
    //       this.outlines.add(mesh);
    //     }
    //   }
    // }

    // // 対角線
    // const theta2 = Math.asin(this.pathW / 245);
    // const lineGeo1 = this.outlineLineGeoGen(1, 0, - this.pathW, 520 - this.pathW, 245 * Math.cos(theta2), this.divCount);
    // const edgeGeoArr1 = this.outlineEdgeGeoGen(1, 0, - this.pathW, 520 - this.pathW, 245 * Math.cos(theta2));
    // for (var i = 0;i <= this.verNum - 1;i ++) {
    //   for (var j = 0;j <= 1;j ++) {
    //     const w = 6;
    //     const rotY = THREE.MathUtils.degToRad(- 180 * j);
    //     const rotZ = THREE.MathUtils.degToRad(- (360 / this.verNum) * i);
    //     for (var g = - w;g <= w;g ++) {
    //       const mesh = this.outlineLineMeshGen(lineGeo1, 1, 0, g, 0, rotY, rotZ);
    //       this.outlines.add(mesh);
    //     }
    //     const edge0 = this.outlineEdgeMeshGen(edgeGeoArr1[0], 0, rotY, rotZ);
    //     const edge1 = this.outlineEdgeMeshGen(edgeGeoArr1[1], 0, rotY, rotZ);
    //     this.outlineEdges.add(edge0, edge1);
    //   }
    // }

    // // 中心円の弧
    // const circleGeo2 = this.outlineCircleGeoGen(0, 0, 245, 90 + THREE.MathUtils.radToDeg(theta2), 90 + 36 - THREE.MathUtils.radToDeg(theta2), this.divCount);
    // for (var i = 0;i <= this.verNum - 1;i ++) {
    //   for (var j = 0;j <= 1;j ++) {
    //     const w = 6;
    //     for (var g = - w;g <= w;g ++) {
    //       const rotY = THREE.MathUtils.degToRad(- 180 * j);
    //       const rotZ = THREE.MathUtils.degToRad(- (360 / this.verNum) * i);
    //       const mesh  = this.outlineCircleMeshGen(circleGeo2, 0, 0, 245, g, 0, rotY, rotZ);
    //       this.outlines.add(mesh);
    //     }
    //   }
    // }

    // // 対角線
    // const r = 361;
    // const line2Start = this.circle(0, 0, 245, 90 + 36 - THREE.MathUtils.radToDeg(theta2));
    // const theta3 = Math.asin(this.pathW / 1600);
    // const point1 = this.circle(0, 0, 1600, 126 - THREE.MathUtils.radToDeg(theta3));
    // const point2 = new THREE.Vector3(this.pathW * Math.cos(THREE.MathUtils.degToRad(45)), this.pathW * Math.sin(THREE.MathUtils.degToRad(45)), 0);
    // const straight1 = this.from2Points(point1.x, point1.y, point2.x, point2.y);
    // const straight = this.from2Points(this.vertices[4].x, this.vertices[4].y, this.vertices[0].x, this.vertices[0].y);
    // const line2Basis = this.getIntersect(straight1.a, straight1.b, straight.a, straight.b);
    // const line2End = new THREE.Vector3(line2Basis.x + r * Math.cos(THREE.MathUtils.degToRad(90 - 36)), line2Basis.y - r * Math.sin(THREE.MathUtils.degToRad(90 - 36)), 0);
    // const straight3 =this.from2Points(line2Start.x, line2Start.y, line2End.x, line2End.y);

    // const lineGeo2 = this.outlineLineGeoGen(straight3.a, 1, straight3.b, line2Start.x, line2End.x, this.divCount);
    // const edgeGeoArr2 = this.outlineEdgeGeoGen(straight3.a, 1, straight3.b, line2Start.x, line2End.x);
    // for (var i = 0;i <= this.verNum - 1;i ++) {
    //   for (var j = 0;j <= 1;j ++) {
    //     const w = 6;
    //     const rotY = THREE.MathUtils.degToRad(- 180 * j);
    //     const rotZ = THREE.MathUtils.degToRad(- (360 / this.verNum) * i);
    //     for (var g = - w;g <= w;g ++) {
    //       const mesh = this.outlineLineMeshGen(lineGeo2, straight3.a, 1, g, 0, rotY, rotZ);
    //       this.outlines.add(mesh);
    //     }
    //     const edge0 = this.outlineEdgeMeshGen(edgeGeoArr2[0], 0, rotY, rotZ);
    //     const edge1 = this.outlineEdgeMeshGen(edgeGeoArr2[1], 0, rotY, rotZ);
    //     this.outlineEdges.add(edge0, edge1);
    //   }
    // }

    // // 大きい円の弧
    // const center = new THREE.Vector3(line2End.x + r * Math.cos(THREE.MathUtils.degToRad(36)), line2End.y + r * Math.sin(THREE.MathUtils.degToRad(36)), 0);
    // const circleGeo3 = this.outlineCircleGeoGen(center.x, center.y, r, -144, -234, this.divCount);
    // for (var i = 0;i <= this.verNum - 1;i ++) {
    //   for (var j = 0;j <= 1;j ++) {
    //     const w = 6;
    //     for (var g = - w;g <= w;g ++) {
    //       const rotY = THREE.MathUtils.degToRad(- 180 * j);
    //       const rotZ = THREE.MathUtils.degToRad(- (360 / this.verNum) * i);
    //       const mesh  = this.outlineCircleMeshGen(circleGeo3, center.x, center.y, r, g, 0, rotY, rotZ);
    //       this.outlines.add(mesh);
    //     }
    //   }
    // }

    // // 頂点までの直線
    // const point3 = new THREE.Vector3(center.x - r * Math.cos(THREE.MathUtils.degToRad(90 - 36)), center.y + r * Math.sin(THREE.MathUtils.degToRad(90 - 36)), 0);
    // const lineGeo3 = this.outlineLineGeoGen(straight.a, 1, straight.b, point3.x, this.vertices[0].x, this.divCount);
    // const edgeGeoArr3 = this.outlineEdgeGeoGen(straight.a, 1, straight.b, point3.x, this.vertices[0].x);
    // for (var i = 0;i <= this.verNum - 1;i ++) {
    //   for (var j = 0;j <= 1;j ++) {
    //     const w = 6;
    //     const rotY = THREE.MathUtils.degToRad(- 180 * j);
    //     const rotZ = THREE.MathUtils.degToRad(- (360 / this.verNum) * i);
    //     for (var g = - w;g <= w;g ++) {
    //       const mesh = this.outlineLineMeshGen(lineGeo3, straight.a, 1, g, 0, rotY, rotZ);
    //       this.outlines.add(mesh);
    //     }
    //     const edge0 = this.outlineEdgeMeshGen(edgeGeoArr3[0], 0, rotY, rotZ);
    //     const edge1 = this.outlineEdgeMeshGen(edgeGeoArr3[1], 0, rotY, rotZ);
    //     this.outlineEdges.add(edge0, edge1);
    //   }
    // }

    this.group.add(this.outlines, this.outlineEdges);
  }

  // 塗りつぶし図形を生成
  generateShape = () => {

    const points0 = this.curvePointGen(0, 0, 191, 0, 360, false);
    const geometry0 = this.shapeGeoGen(points0);
    const mesh0 = new THREE.Mesh(geometry0, this.shapeMat);
    this.shapes.add(mesh0);

    // 小さい円の弧
    const arc1 = this.curvePointGen(0, 520 - this.pathW, this.pathW + 6, 90, 180, false);

    // 対角線
    const theta2 = Math.asin(this.pathW / 245);
    const line1 = [
      new THREE.Vector3(- this.pathW - 6, 520 - this.pathW, 0),
      new THREE.Vector3(- this.pathW - 6, 245 * Math.cos(theta2), 0)
    ];

    // 中心円の弧
    const arc2 = this.curvePointGen(0, 0, 245 + 6, 90 + THREE.MathUtils.radToDeg(theta2), 90 + 34 + THREE.MathUtils.radToDeg(theta2), false);

    // 対角線
    const r = 361;
    const line2Start = this.circle(0, 0, 245, 90 + 36 - THREE.MathUtils.radToDeg(theta2));
    const theta3 = Math.asin(this.pathW / 1600);
    const point1 = this.circle(0, 0, 1600, 126 - THREE.MathUtils.radToDeg(theta3));
    const point2 = new THREE.Vector3(
      this.pathW * Math.cos(THREE.MathUtils.degToRad(45)),
      this.pathW * Math.sin(THREE.MathUtils.degToRad(45)), 0
    );
    const straight1 = this.from2Points(point1.x, point1.y, point2.x, point2.y);
    const straight = this.from2Points(this.vertices[4].x, this.vertices[4].y, this.vertices[0].x, this.vertices[0].y);
    const line2Basis = this.getIntersect(straight1.a, straight1.b, straight.a, straight.b);
    const line2End = new THREE.Vector3(
      line2Basis.x + r * Math.cos(THREE.MathUtils.degToRad(90 - 36)),
      line2Basis.y - r * Math.sin(THREE.MathUtils.degToRad(90 - 36)), 0
    );
    const gX1 = 6 * Math.cos(THREE.MathUtils.degToRad(90 - theta3));
    const gY1 = 6 * Math.sin(THREE.MathUtils.degToRad(90 - theta3));
    const line2 = [
      new THREE.Vector3(line2Start.x + gX1, line2Start.y + gY1, line2Start.z),
      new THREE.Vector3(line2End.x + gX1, line2End.y + gY1, line2End.z)
    ];

    // 大きい円の弧
    const center = new THREE.Vector3(
      line2End.x + r * Math.cos(THREE.MathUtils.degToRad(36)),
      line2End.y + r * Math.sin(THREE.MathUtils.degToRad(36)), 0
    );
    const arc3 = this.curvePointGen(center.x, center.y, r - 4, - 144, - 234, true);

    // 頂点までの直線
    const point3 = new THREE.Vector3(
      center.x - r * Math.cos(THREE.MathUtils.degToRad(90 - 36)),
      center.y + r * Math.sin(THREE.MathUtils.degToRad(90 - 36)), 0
    );
    const theta4 = Math.atan(straight.a);
    const gX2 = 6 * Math.cos(THREE.MathUtils.degToRad(theta4));
    const gY2 = 6 * Math.sin(THREE.MathUtils.degToRad(theta4));
    const line3 = [
      new THREE.Vector3(point3.x + gX2, point3.y - gY2, point3.z),
      new THREE.Vector3(this.vertices[0].x, this.vertices[0].y - gY2, this.vertices[0].z)
    ];

    const points = arc1.concat(line1, arc2, line2, arc3, line3);
    const geometry = this.shapeGeoGen(points);

    for (var i = 0;i <= this.verNum - 1;i ++) {

      const group = new THREE.Group();

      for (var j = 0;j <= 1;j ++) {

        const mesh = new THREE.Mesh(geometry, this.shapeMat);
        mesh.rotation.y = THREE.MathUtils.degToRad(180 * j);
        mesh.visible = false;
        group.add(mesh);

      }

      group.rotation.z = THREE.MathUtils.degToRad(- (360 / this.verNum) * i);
      this.shapes.add(group);
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
    // for (var i = 0;i <= this.radiations.children.length - 1;i ++) {
    //   const mesh = this.radiations.children[i];
    //   mesh.geometry.setDrawRange(0, this.divCount * radiationsDrawRatio);
    //   mesh.rotation.z = THREE.MathUtils.degToRad(18) + THREE.MathUtils.degToRad(36) * Math.trunc(i / 2 + 1) * radiationsRotateRatio;
    //   mesh.material.opacity = 1.0 - outRatio;
    //   if (outRatio >= 1.0) {
    //     mesh.visible = false;
    //   } else {
    //     mesh.visible = true;
    //   }
    // }
  }

  // アウトラインの表示制御
  outlineDisplayControl = (progRatio) => {
    const p = this.outlineParams;
    const inRatio  = THREE.MathUtils.smoothstep(progRatio, p.inStart, p.inEnd);
    const outRatio = THREE.MathUtils.smoothstep(progRatio, p.outStart, p.outEnd);
    this.outlines.children.forEach((mesh) => {
      if (mesh.isGroup) {
        mesh.children.forEach((mesh) => {
          mesh.material.opacity = inRatio - outRatio;
          if (outRatio >= 1.0) {
            mesh.visible = false;
          } else {
            mesh.visible = true;
          }    
        })
      } else {
        mesh.material.opacity = inRatio - outRatio;
        if (outRatio >= 1.0) {
          mesh.visible = false;
        } else {
          mesh.visible = true;
        }  
      }

      // if (inRatio > 0.0 && inRatio <= 1.0 && outRatio == 0.0) {
      //   line.visible = true;
      //   line.geometry.setDrawRange(0, this.divCount * inRatio);
      //   line.material.opacity = 1.0 - outRatio;
      // } else if (inRatio >= 1.0 && outRatio > 0.0 && outRatio < 1.0) {
      //   line.visible = true;
      //   line.geometry.setDrawRange(0, this.divCount * inRatio);
      //   line.material.opacity = 1.0 - outRatio;
      // } else {
      //   line.visible = false;
      // }
    });
    // this.outlineEdges.children.forEach((mesh) => {
    //   mesh.material.opacity = inRatio - outRatio * 1.2;
    // });
  }

  // 図形のアニメーション制御
  shapeRotationControl(progRatio) {
    const p = this.shapeRotParams;
    var ratio = THREE.MathUtils.smootherstep(progRatio, p.start, p.end);
    for (var i = 0;i <= this.shapes.children.length - 1;i ++) {
      const shape = this.shapes.children[i];
      const j = i - 1;
      const num = Math.trunc(j / 2);
      if (i > 0) {
        const adjust1 = 80;
        const adjust2 = 20;
        var ratioSx, ratioSy;
        if (ratio < 0.1 + num / adjust1) {
          ratioSx = THREE.MathUtils.mapLinear(ratio, 0.0, 0.1 + num / adjust1, 1.0, 0.3);
          ratioSy = THREE.MathUtils.mapLinear(ratio, 0.0, 0.1 + num / adjust1, 1.0, 0.2);
        } else if (ratio < 0.4 + num / adjust2) {
          ratioSx = 0.3;
          ratioSy = 0.2;
        } else {
          ratioSx = THREE.MathUtils.mapLinear(ratio, 0.4 + num / adjust2, 1.0, 0.3, 1.0);
          ratioSy = THREE.MathUtils.mapLinear(ratio, 0.4 + num / adjust2, 1.0, 0.2, 1.0);
        }
        shape.scale.set(ratioSx, ratioSy)
        this.shapes.rotation.z = - 720 * ratio * (Math.PI / 180);
      }
    }
  }

}
