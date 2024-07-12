'use strict';

import * as THREE from 'three';
import Kamon from '../kamon.js';

export default class MaruNiFutatsuKarigane extends Kamon {

  constructor() {

    super();

    // infoのテキスト
    this.jpNameText = '丸に二つ雁金';
    this.jpDescText = '雁金紋は雁金という渡り鳥を図案化した家紋です。中国の古事に登場するエピソードから、主君への忠誠を表す紋様だったと言われています。また、紋様の羽の形状が雁股という武器の鏃を模しているとも言われており、尚武的な意味合いも持っていたと考えられています。';
    this.enNameText = 'Maru-ni-futatsu-karigane';
    this.enDescText = 'The Karigane crest is a family crest that depicts a migratory bird called Karigane. It is said that this pattern represents loyalty to the lord, based on an episode that appears in ancient Chinese history. It is also said that the shape of the feathers in the pattern imitates the arrowheads of a weapon called Karimata, and it is thought that it also had a military meaning.';

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
      inEnd   : 0.625,
      outStart: 0.65,
      outEnd  : 0.7,
    }

    // 図形の表示アニメーションパラメータ
    this.shapeParams = {
      inStart : 0.625,
      inEnd   : 0.7,
      outStart: 0.95,
      outEnd  : 1.0,
    }

    // 図形の回転アニメーションパラメータ
    this.shapeRotParams = {
      start : 0.7,
      end   : 0.85,
    }

    

    // 外周円
    this.outerCircle1 = {a: 0, b: 0, r: 1600};
    this.outerCircle2 = {a: 0, b: 0, r: 1310};

    // 翼
    this.wingArc1 = {a:  474, b:   140, r:  765};
    this.wingArc2 = {a: 1012, b: - 458, r: 1120};

    this.wingApex1 = new THREE.Vector3(1035, 660, 0);
    this.wingApex2 = new THREE.Vector3(   0, 740, 0);
    this.wingApex3 = new THREE.Vector3(   0,  20, 0);

    this.wingAngle1 = 179.98 - THREE.MathUtils.radToDeg(Math.atan((this.wingApex2.y - this.wingArc1.b) / this.wingArc1.a));
    this.wingAngle2 = THREE.MathUtils.radToDeg(Math.atan((this.wingApex1.y - this.wingArc1.b) / (this.wingApex1.x - this.wingArc1.a)));
    this.wingAngle3 = 179.92 - THREE.MathUtils.radToDeg(Math.atan((this.wingApex3.y - this.wingArc2.b) / this.wingArc2.a));
    this.wingAngle4 = THREE.MathUtils.radToDeg(Math.atan((this.wingApex1.y - this.wingArc2.b) / (this.wingApex1.x - this.wingArc2.a)));

    // 頭
    this.headArc1 = {a: 0, b: 794, r: 426};
    this.headArc2 = {a:   this.wingArc1.a, b: this.wingArc1.b, r: this.wingArc1.r + 40};
    this.headArc3 = {a: - this.wingArc1.a, b: this.wingArc1.b, r: this.wingArc1.r + 40};

    this.headApex1 = new THREE.Vector3(  402,  940, 0);
    this.headApex2 = new THREE.Vector3(- 270, 1120, 0);
    this.headApex3 = new THREE.Vector3(- 192, 1008, 0);
    this.headApex4 = new THREE.Vector3(- 288,  922, 0);
    this.headApex5 = new THREE.Vector3(    0,  796, 0);

    this.headLine1 = this.from2Points(this.headApex2.x, this.headApex2.y, this.headApex3.x, this.headApex3.y);
    this.headLine2 = this.from2Points(this.headApex4.x, this.headApex4.y, this.headApex3.x, this.headApex3.y);

    this.headAngle1 = THREE.MathUtils.radToDeg(Math.atan((this.headApex1.y - this.headArc1.b) / this.headApex1.x));
    this.headAngle2 = 180 - THREE.MathUtils.radToDeg(Math.atan((this.headApex2.y - this.headArc1.b) / - this.headApex2.x));
    this.headAngle3 = 180 - THREE.MathUtils.radToDeg(Math.atan((this.headApex5.y - this.wingArc1.b) / this.wingArc1.a));
    this.headAngle4 = 180 - THREE.MathUtils.radToDeg(Math.atan((this.headApex1.y - this.wingArc1.b) / (this.wingArc1.a - this.headApex1.x)));
    this.headAngle5 = THREE.MathUtils.radToDeg(Math.atan((this.headApex5.y - this.wingArc1.b) / this.wingArc1.a));
    this.headAngle6 = THREE.MathUtils.radToDeg(Math.atan((this.headApex4.y - this.wingArc1.b) / (this.headApex4.x + this.wingArc1.a)));

    // 目
    this.eyeCircle1 = {a: - 100, b: 1084, r:  84};
    this.eyeCircle2 = {a: - 100, b: 1084, r:  58};
    this.eyeCircle3 = {a: - 100, b: 1084, r:  28};

    // しわ
    this.creaseArc1 = {a: - 60, b: 1060, r: 120};
    this.creaseArc2 = {a: - 60, b: 1060, r: 148};
    this.creaseArc3 = {a:   14, b: 1173, r:  14};
    this.creaseArc4 = {a: - 56, b:  926, r:  14};

    this.creaseApex1 = new THREE.Vector3(    6, 1160, 0);
    this.creaseApex2 = new THREE.Vector3( - 56,  940, 0);
    this.creaseApex3 = new THREE.Vector3( - 56,  912, 0);
    this.creaseApex4 = new THREE.Vector3(   24, 1184, 0);

    this.creaseAngle1 = THREE.MathUtils.radToDeg(Math.atan((this.creaseApex1.y - this.creaseArc1.b) / (this.creaseApex1.x - this.creaseArc1.a)));
    this.creaseAngle2 = - 180 + THREE.MathUtils.radToDeg(Math.atan((this.creaseArc1.b - this.creaseApex2.y) / (this.creaseApex2.x - this.creaseArc1.a)));
    this.creaseAngle3 = - 180 + THREE.MathUtils.radToDeg(Math.atan((this.creaseArc2.b - this.creaseApex3.y) / (this.creaseApex3.x - this.creaseArc2.a)));
    this.creaseAngle4 = THREE.MathUtils.radToDeg(Math.atan((this.creaseApex4.y - this.creaseArc2.b) / (this.creaseApex4.x - this.creaseArc2.a)));

    // くちばし
    this.beakApex1 = new THREE.Vector3(- 292, 1110, 0);
    this.beakApex2 = new THREE.Vector3(- 410, 1044, 0);
    this.beakApex3 = new THREE.Vector3(- 224, 1020, 0);

    this.beakApex4 = new THREE.Vector3(- 312,  934, 0);
    this.beakApex5 = new THREE.Vector3(- 412, 1020, 0);
    this.beakApex6 = new THREE.Vector3(- 234,  998, 0);

    this.beakLine1 = this.from2Points(this.beakApex1.x, this.beakApex1.y, this.beakApex2.x, this.beakApex2.y);
    this.beakLine2 = this.from2Points(this.beakApex2.x, this.beakApex2.y, this.beakApex3.x, this.beakApex3.y);
    this.beakLine3 = this.from2Points(this.beakApex3.x, this.beakApex3.y, this.beakApex1.x, this.beakApex1.y);

    this.beakLine4 = this.from2Points(this.beakApex4.x, this.beakApex4.y, this.beakApex5.x, this.beakApex5.y);
    this.beakLine5 = this.from2Points(this.beakApex5.x, this.beakApex5.y, this.beakApex6.x, this.beakApex6.y);
    this.beakLine6 = this.from2Points(this.beakApex6.x, this.beakApex6.y, this.beakApex4.x, this.beakApex4.y);
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

    const surplus = 5;

    // 外周円
    this.outerCircles = new THREE.Group();
    const outers = [this.outerCircle1, this.outerCircle2];
    outers.forEach((outer) => {
      const points = this.circlePointGen(outer.a, outer.b, outer.r, 90, 450, this.divCount);
      const circle = this.guidelineGen(points);
      this.outerCircles.add(circle);
    });
    this.guidelines.add(this.outerCircles);

    // 鳥
    this.bird = new THREE.Group();

    // 翼
    this.wing = new THREE.Group();

    const wingAngle1 = this.wingAngle1 + surplus;
    const wingAngle2 = this.wingAngle2 - surplus;
    const wingAngle3 = this.wingAngle3 + surplus;
    const wingAngle4 = this.wingAngle4 - surplus;

    const wingPoints1 = this.circlePointGen(  this.wingArc1.a, this.wingArc1.b, this.wingArc1.r,       wingAngle1,       wingAngle2, this.divCount);
    const wingPoints2 = this.circlePointGen(  this.wingArc2.a, this.wingArc2.b, this.wingArc2.r,       wingAngle3,       wingAngle4, this.divCount);
    const wingPoints3 = this.circlePointGen(- this.wingArc1.a, this.wingArc1.b, this.wingArc1.r, 180 - wingAngle1, 180 - wingAngle2, this.divCount);
    const wingPoints4 = this.circlePointGen(- this.wingArc2.a, this.wingArc2.b, this.wingArc2.r, 180 - wingAngle3, 180 - wingAngle4, this.divCount);

    const wingArc1 = this.guidelineGen(wingPoints1);
    const wingArc2 = this.guidelineGen(wingPoints2);
    const wingArc3 = this.guidelineGen(wingPoints3);
    const wingArc4 = this.guidelineGen(wingPoints4);

    this.wing.add(wingArc1, wingArc2, wingArc3, wingArc4);

    // 頭（輪郭）
    this.head = new THREE.Group();

    const headAngle1 = this.headAngle1 - surplus;
    const headAngle2 = this.headAngle2 + surplus;
    const headAngle3 = this.headAngle3 + surplus;
    const headAngle4 = this.headAngle4 - surplus;
    const headAngle5 = this.headAngle5 - surplus;
    const headAngle6 = this.headAngle6 + surplus;

    const headPoints1 = this.circlePointGen(this.headArc1.a, this.headArc1.b, this.headArc1.r, headAngle1, headAngle2, this.divCount);
    const headPoints2 = this.circlePointGen(this.headArc2.a, this.headArc2.b, this.headArc2.r, headAngle3, headAngle4, this.divCount);
    const headPoints3 = this.circlePointGen(this.headArc3.a, this.headArc3.b, this.headArc3.r, headAngle5, headAngle6, this.divCount);
    const headPoints4 = this.linePointGen(this.headLine1.a, 1, this.headLine1.b, this.headApex2.x - 20, this.headApex3.x + 20, this.divCount);
    const headPoints5 = this.linePointGen(this.headLine2.a, 1, this.headLine2.b, this.headApex4.x - 20, this.headApex3.x + 20, this.divCount);

    const headArc1  = this.guidelineGen(headPoints1);
    const headArc2  = this.guidelineGen(headPoints2);
    const headArc3  = this.guidelineGen(headPoints3);
    const headLine1 = this.guidelineGen(headPoints4);
    const headLine2 = this.guidelineGen(headPoints5);

    this.head.add(headArc1, headArc2, headArc3, headLine1, headLine2);

    // 目
    this.eye = new THREE.Group();

    const eyePoints1 = this.circlePointGen(this.eyeCircle1.a, this.eyeCircle1.b, this.eyeCircle1.r, 90, 450, this.divCount);
    const eyePoints2 = this.circlePointGen(this.eyeCircle2.a, this.eyeCircle2.b, this.eyeCircle2.r, 90, 450, this.divCount);
    const eyePoints3 = this.circlePointGen(this.eyeCircle3.a, this.eyeCircle3.b, this.eyeCircle3.r, 90, 450, this.divCount);

    const eyeCircle1  = this.guidelineGen(eyePoints1);
    const eyeCircle2  = this.guidelineGen(eyePoints2);
    const eyeCircle3  = this.guidelineGen(eyePoints3);

    this.eye.add(eyeCircle1, eyeCircle2, eyeCircle3);

    // しわ
    this.crease = new THREE.Group();

    const creaseAngle1 = this.creaseAngle1 + surplus;
    const creaseAngle2 = this.creaseAngle2 - surplus;
    const creaseAngle3 = this.creaseAngle3 - surplus;
    const creaseAngle4 = this.creaseAngle4 + surplus;

    const creasePoints1 = this.circlePointGen(this.creaseArc1.a, this.creaseArc1.b, this.creaseArc1.r, creaseAngle1, creaseAngle2, this.divCount);
    const creasePoints2 = this.circlePointGen(this.creaseArc2.a, this.creaseArc2.b, this.creaseArc2.r, creaseAngle3, creaseAngle4, this.divCount);
    const creasePoints3 = this.circlePointGen(this.creaseArc3.a, this.creaseArc3.b, this.creaseArc3.r, 90, 450, this.divCount);
    const creasePoints4 = this.circlePointGen(this.creaseArc4.a, this.creaseArc4.b, this.creaseArc4.r, 90, 450, this.divCount);

    const creaseArc1  = this.guidelineGen(creasePoints1);
    const creaseArc2  = this.guidelineGen(creasePoints2);
    const creaseArc3  = this.guidelineGen(creasePoints3);
    const creaseArc4  = this.guidelineGen(creasePoints4);

    this.crease.add(creaseArc1, creaseArc2, creaseArc3, creaseArc4);

    // くちばし
    this.beak = new THREE.Group();

    const beakPoints1 = this.linePointGen(this.beakLine1.a, 1, this.beakLine1.b, this.beakApex1.x + 20, this.beakApex2.x - 20, this.divCount);
    const beakPoints2 = this.linePointGen(this.beakLine2.a, 1, this.beakLine2.b, this.beakApex2.x - 20, this.beakApex3.x + 20, this.divCount);
    const beakPoints3 = this.linePointGen(this.beakLine3.a, 1, this.beakLine3.b, this.beakApex3.x + 20, this.beakApex1.x - 20, this.divCount);

    const beakPoints4 = this.linePointGen(this.beakLine4.a, 1, this.beakLine4.b, this.beakApex4.x + 20, this.beakApex5.x - 20, this.divCount);
    const beakPoints5 = this.linePointGen(this.beakLine5.a, 1, this.beakLine5.b, this.beakApex5.x - 20, this.beakApex6.x + 20, this.divCount);
    const beakPoints6 = this.linePointGen(this.beakLine6.a, 1, this.beakLine6.b, this.beakApex6.x + 20, this.beakApex4.x - 20, this.divCount);

    const beakLine1  = this.guidelineGen(beakPoints1);
    const beakLine2  = this.guidelineGen(beakPoints2);
    const beakLine3  = this.guidelineGen(beakPoints3);

    const beakLine4  = this.guidelineGen(beakPoints4);
    const beakLine5  = this.guidelineGen(beakPoints5);
    const beakLine6  = this.guidelineGen(beakPoints6);

    this.beak.add(beakLine1, beakLine2, beakLine3, beakLine4, beakLine5, beakLine6);

    this.bird1 = new THREE.Group();
    this.bird1.add(this.wing, this.head, this.eye, this.crease, this.beak);
    this.bird2 = this.bird1.clone();
    this.bird.add(this.bird1, this.bird2)

    this.guidelines.add(this.bird);
    this.group.add(this.guidelines);
  }

  // アウトラインを作成
  generateOutline = () => {

    // 外周円
    const outers = [this.outerCircle1, this.outerCircle2];
    outers.forEach((outer) => {
      const shape = this.curvePointGen(outer.a, outer.b, outer.r + 6, 0, 360, false);
      const path  = this.curvePointGen(outer.a, outer.b, outer.r - 6, 0, 360, false);
      const geo = this.shapeGeoGen(shape, path);
      const mesh = new THREE.Mesh(geo, this.outlineMat);
      this.outlines.add(mesh);
    })

    // 翼
    const wingArcs = [this.wingArc1, this.wingArc2];
    const wingAngles = [
      [this.wingAngle1, this.wingAngle2],
      [this.wingAngle3, this.wingAngle4],
    ];
    for (var i = 0;i <= wingArcs.length - 1;i ++) {
      const arc = wingArcs[i];
      const angle = wingAngles[i]
      const point1 = this.curvePointGen(arc.a, arc.b, arc.r + 6, angle[0], angle[1], true);
      const point2 = this.curvePointGen(arc.a, arc.b, arc.r - 6, angle[1], angle[0], false);
      const points = point1.concat(point2);
      const geo = this.shapeGeoGen(points);
      for (var j = 0;j <= 3;j ++) {
        const mesh = new THREE.Mesh(geo, this.outlineMat);
        mesh.rotation.y = THREE.MathUtils.degToRad(180 * Math.trunc(j / 2));
        mesh.position.y = - 1250 * Math.abs(j % 2);
        this.outlines.add(mesh);
      }
    }

    // 頭
    const headArcs = [
      this.headArc1, this.headArc2, this.headArc3,
      this.eyeCircle1, this.eyeCircle2, this.eyeCircle3,
      this.creaseArc1, this.creaseArc2, this.creaseArc3, this.creaseArc4,
    ];
    const headAngles = [
      [this.headAngle2, this.headAngle1],
      [this.headAngle3, this.headAngle4],
      [this.headAngle6, this.headAngle5],
      [0, 360], [0, 360], [0, 360],
      [this.creaseAngle1, this.creaseAngle2],
      [this.creaseAngle4, this.creaseAngle3],
      [240, 40], [270, 90],
    ];
    for (var i = 0;i <= headArcs.length - 1;i ++) {
      const arc = headArcs[i];
      const angle = headAngles[i]
      const point1 = this.curvePointGen(arc.a, arc.b, arc.r + 6, angle[0], angle[1], true);
      const point2 = this.curvePointGen(arc.a, arc.b, arc.r - 6, angle[1], angle[0], false);
      const points = point1.concat(point2);
      const geo = this.shapeGeoGen(points);
      for (var j = 0;j <= 1;j ++) {
        const mesh = new THREE.Mesh(geo, this.outlineMat);
        mesh.position.y = - 1250 * j;
        this.outlines.add(mesh);
      }
    }

    // くちばし
    const beakLines = [
      this.headLine1, this.headLine2,
      this.beakLine1, this.beakLine2, this.beakLine3,
      this.beakLine4, this.beakLine5, this.beakLine6,
    ];
    const beakApexes = [
      [this.headApex2, this.headApex3],
      [this.headApex4, this.headApex3],
      [this.beakApex1, this.beakApex2],
      [this.beakApex2, this.beakApex3],
      [this.beakApex3, this.beakApex1],
      [this.beakApex4, this.beakApex5],
      [this.beakApex5, this.beakApex6],
      [this.beakApex6, this.beakApex4],
    ];
    for (var i = 0;i <= beakLines.length - 1;i ++) {
      const line = beakLines[i];
      const apex = beakApexes[i];
      const theta = Math.atan(- 1 / line.a);
      const p = 6 * Math.cos(theta);
      const q = 6 * Math.sin(theta);
      const linePoint1 = new THREE.Vector3(apex[0].x + p, apex[0].y + q, 0);
      const linePoint2 = new THREE.Vector3(apex[0].x - p, apex[0].y - q, 0);
      const linePoint3 = new THREE.Vector3(apex[1].x - p, apex[1].y - q, 0);
      const linePoint4 = new THREE.Vector3(apex[1].x + p, apex[1].y + q, 0);
      const points = [linePoint1, linePoint2, linePoint3, linePoint4];
      const geo = this.shapeGeoGen(points);
      for (var j = 0;j <= 1;j ++) {
        const mesh = new THREE.Mesh(geo, this.outlineMat);
        mesh.position.y = - 1250 * j;
        this.outlines.add(mesh);
      }
    }

    // エッジ処理
    const wingApex4 = new THREE.Vector3(- this.wingApex1.x, this.wingApex1.y, 0);
    const edgeApexes = [
      this.wingApex1, this.wingApex2, this.wingApex3, wingApex4,
      this.headApex1, this.headApex2, this.headApex3, this.headApex4, this.headApex5,
      this.beakApex1, this.beakApex2, this.beakApex3, this.beakApex4, this.beakApex5, this.beakApex6,
    ]
    for (var i = 0;i <= edgeApexes.length - 1;i ++) {
      const apex = edgeApexes[i];
      const points = this.curvePointGen(apex.x, apex.y, 6, 0, 360, false);
      const geo = this.shapeGeoGen(points);
      for (var j = 0;j <= 1;j ++) {
        const mesh = new THREE.Mesh(geo, this.edgeMat);
        mesh.position.y = - 1250 * j;
        this.outlineEdges.add(mesh);
      }
    }

    this.group.add(this.outlines, this.outlineEdges);
  }

  // 塗りつぶし図形を生成
  generateShape = () => {

    // 外周円
    const outerCircleShape = this.curvePointGen(this.outerCircle1.a, this.outerCircle1.b, this.outerCircle1.r, 0, 360, false);
    const outerCirclePath  = this.curvePointGen(this.outerCircle2.a, this.outerCircle2.b, this.outerCircle2.r, 0, 360, false);
    const outerCircleGeo   = this.shapeGeoGen(outerCircleShape, outerCirclePath);
    const outerCircleMesh  = new THREE.Mesh(outerCircleGeo, this.shapeMat);
    this.shapes.add(outerCircleMesh);

    // 翼
    const wingShape1 = this.curvePointGen(  this.wingArc1.a, this.wingArc1.b, this.wingArc1.r,       this.wingAngle1, this.wingAngle2 + 0.2, true);
    const wingShape2 = this.curvePointGen(  this.wingArc2.a, this.wingArc2.b, this.wingArc2.r,       this.wingAngle4,       this.wingAngle3, false);
    const wingShape3 = this.curvePointGen(- this.wingArc2.a, this.wingArc2.b, this.wingArc2.r, 180 - this.wingAngle3, 180 - this.wingAngle4, false);
    const wingShape4 = this.curvePointGen(- this.wingArc1.a, this.wingArc1.b, this.wingArc1.r, 180 - this.wingAngle2, 180 - this.wingAngle1, true);
    const wingShapes = wingShape1.concat(wingShape2, wingShape3, wingShape4);
    const wingGeo = this.shapeGeoGen(wingShapes);

    // 頭
    const headShape1 = this.curvePointGen(this.headArc1.a, this.headArc1.b, this.headArc1.r, this.headAngle1 + 0.3, this.headAngle2, false);
    const headShape2 = this.curvePointGen(this.headArc3.a, this.headArc3.b, this.headArc3.r,       this.headAngle6, this.headAngle5, true);
    const headShape3 = this.curvePointGen(this.headArc2.a, this.headArc2.b, this.headArc2.r,       this.headAngle3, this.headAngle4, true);

    const eyeShape1 = this.curvePointGen(this.eyeCircle1.a, this.eyeCircle1.b, this.eyeCircle1.r, 0, 360, false);
    const eyeShape2 = this.curvePointGen(this.eyeCircle2.a, this.eyeCircle2.b, this.eyeCircle2.r, 0, 360, false);
    const eyeShape3 = this.curvePointGen(this.eyeCircle3.a, this.eyeCircle3.b, this.eyeCircle3.r, 0, 360, false);

    const creaseShape1 = this.curvePointGen(this.creaseArc1.a, this.creaseArc1.b, this.creaseArc1.r, this.creaseAngle1, this.creaseAngle2, true);
    const creaseShape2 = this.curvePointGen(this.creaseArc2.a, this.creaseArc2.b, this.creaseArc2.r, this.creaseAngle3, this.creaseAngle4, false);
    const creaseShape3 = this.curvePointGen(this.creaseArc3.a, this.creaseArc3.b, this.creaseArc3.r,                70,               240, false);
    const creaseShape4 = this.curvePointGen(this.creaseArc4.a, this.creaseArc4.b, this.creaseArc4.r,                90,               270, false);

    const headShapes =   headShape1.concat(this.headApex3, headShape2, headShape3);
    const creases    = creaseShape1.concat(creaseShape4, creaseShape2, creaseShape3);

    const headShape = new THREE.Shape(headShapes);
    const headPath1 = new THREE.Path(eyeShape1);
    const headPath2 = new THREE.Path(creases);
    headShape.holes.push(headPath1, headPath2);

    const headGeo = new THREE.ShapeGeometry(headShape);
    const eyeGeo = this.shapeGeoGen(eyeShape2, eyeShape3);
    const upperBeakGeo = this.shapeGeoGen([this.beakApex1, this.beakApex2, this.beakApex3]);
    const lowerBeakGeo = this.shapeGeoGen([this.beakApex4, this.beakApex5, this.beakApex6]);

    for (var i = 0;i <= 1;i ++) {
      const bird = new THREE.Group();
      const headMesh  = new THREE.Mesh(headGeo, this.shapeMat);
      const eyeMesh  = new THREE.Mesh(eyeGeo, this.shapeMat);
      const upperBeakMesh  = new THREE.Mesh(upperBeakGeo, this.shapeMat);
      const lowerBeakMesh  = new THREE.Mesh(lowerBeakGeo, this.shapeMat);
      const wingMesh  = new THREE.Mesh(wingGeo, this.shapeMat);
      bird.add(headMesh, eyeMesh, upperBeakMesh, lowerBeakMesh, wingMesh);
      bird.position.y = - 1250 * i;
      this.shapes.add(bird);
    }

    this.group.add(this.shapes);

  }

  // ガイドラインの表示制御
  guidelineDisplayControl = (progRatio) => {
    const p = this.guidelineParams;
    const inRatio  = THREE.MathUtils.smoothstep(progRatio, p.inStart, p.inEnd);
    const outRatio = THREE.MathUtils.smoothstep(progRatio, p.outStart, p.outEnd);

    const outerCirclesInRatio = THREE.MathUtils.smoothstep(inRatio, 0.0, 0.3);
    const birdDrawRatio = THREE.MathUtils.smoothstep(inRatio, 0.3, 0.65);
    const birdMoveRatio = THREE.MathUtils.smoothstep(inRatio, 0.65, 1.0);

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

    // 鳥
    for (var i = 0;i <= this.bird.children.length - 1;i ++) {
      const group1 = this.bird.children[i];
      group1.position.y = - 1250 * i * birdMoveRatio;

      for (var j = 0; j <= group1.children.length - 1;j ++) {
        const group2 = group1.children[j];

        for (var k = 0;k <= group2.children.length - 1;k ++) {
          const maxDelay = 0.06 * group2.children.length;
          const delay = 0.06 * k;
          const birdDrawRatioD = THREE.MathUtils.inverseLerp(delay, 1.0 + delay - maxDelay, birdDrawRatio);
          const mesh = group2.children[k];
          mesh.geometry.setDrawRange(0, this.divCount * birdDrawRatioD);
          mesh.material.opacity = 1.0 - outRatio;
          if (outRatio >= 1.0) {
            mesh.visible = false;
          } else {
            mesh.visible = true;
          }
        }
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
    const num = 1;
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

    this.shapes.scale.set(ratioSx, ratioSy, 1);
    this.shapes.rotation.z = 720 * ratio * (Math.PI / 180);
  }

}
