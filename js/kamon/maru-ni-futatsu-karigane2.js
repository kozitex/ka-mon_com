'use strict';

import * as THREE from 'three';
import Kamon2 from '../kamon2.js';

export default class MaruNiFutatsuKarigane2 extends Kamon2 {

  constructor() {

    super();

    // infoのテキスト
    this.jpNameText = '丸に二つ雁金';
    this.jpDescText = '雁金紋は雁金という渡り鳥を図案化した家紋です。中国の古事に登場するエピソードから、主君への忠誠を表す紋様だったと言われています。また、紋様の羽の形状が雁股という武器の鏃を模しているとも言われており、尚武的な意味合いも持っていたと考えられています。';
    this.enNameText = 'Maru-ni-futatsu-karigane';
    this.enDescText = 'The Karigane crest is a family crest that depicts a migratory bird called Karigane. It is said that this pattern represents loyalty to the lord, based on an episode that appears in ancient Chinese history. It is also said that the shape of the feathers in the pattern imitates the arrowheads of a weapon called Karimata, and it is thought that it also had a military meaning.';

    // ガイドラインの表示アニメーションパラメータ
    this.guidelineParams = {
      drawIn   : [0.10, 0.40],
      drawOut  : [0.65, 0.80],
      fadeIn1  : [0.00, 0.00],
      fadeOut1 : [0.35, 0.40],
      fadeIn2  : [0.625, 0.675],
      fadeOut2 : [0.80, 0.85],
      scaleIn  : [0.00, 0.00],
      scaleOut : [0.65, 0.90],
    }

    // アウトラインの表示アニメーションパラメータ
    this.outlineParams = {
      fadeIn1  : [0.30, 0.35],
      fadeOut1 : [0.35 ,0.40],
      fadeIn2  : [0.60, 0.65],
      fadeOut2 : [0.65, 0.70],
      scaleIn  : [0.00, 0.00],
      scaleOut : [0.70, 0.90],
    }

    // 図形の表示アニメーションパラメータ
    this.shapeParams = {
      fadeIn   : [0.35, 0.40],
      fadeOut  : [0.60, 0.65],
    }

    // 説明欄の表示アニメーションパラメータ
    this.descParams = {
      fadeIn   : [0.35, 0.40],
      fadeOut  : [0.60, 0.65],
    }

    // 外周円
    this.circle1 = {a: 0, b: 0, r: 1600};
    this.circle2 = {a: 0, b: 0, r: 1310};

    // 円弧
    this.arc1  = {a:   474, b:   140, r:  765};
    this.arc2  = {a:  1012, b: - 458, r: 1120};
    this.arc3  = {a: - this.arc2.a, b: this.arc2.b, r: this.arc2.r};
    this.arc4  = {a: - this.arc1.a, b: this.arc1.b, r: this.arc1.r};

    this.arc5  = {a:     0, b:   762, r:  426};
    this.arc6  = {a: this.arc1.a, b: this.arc1.b, r: this.arc1.r + 8};
    this.arc7  = {a: this.arc4.a, b: this.arc4.b, r: this.arc4.r + 8};

    this.arc8  = {a: -  60, b:  1028, r:  130};
    this.arc9  = {a: this.arc8.a, b: this.arc8.b, r: this.arc8.r + 4};
    this.arc10 = {a: this.arc8.a, b: this.arc8.b, r: this.arc8.r - 4};

    this.arc11 = {a: - 100, b:  1052, r:   66};
    this.arc12 = {a: this.arc11.a, b: this.arc11.b, r: this.arc11.r + 4};
    this.arc13 = {a: this.arc11.a, b: this.arc11.b, r: this.arc11.r - 4};
    this.arc14 = {a: - 100, b:  1052, r:   24};
    this.arc15 = {a: this.arc14.a, b: this.arc14.b, r: this.arc14.r + 4};
    this.arc16 = {a: this.arc14.a, b: this.arc14.b, r: this.arc14.r - 4};

    // 円弧の描画角度
    this.angle1  = [128.5, 43];
    this.angle2  = [ 89, 154.5];
    this.angle3  = [ 25.5,  91];
    this.angle4  = [137,  51.5];

    this.angle5  = [130,  20];
    this.angle6  = [ 95, 128];
    this.angle7  = [ 52,  76];

    this.angle9  = [  62, - 92];
    this.angle10 = [- 92,   62];

    // 単一座標
    this.apex1 = new THREE.Vector3(- 192,  976, 0);
    this.apex2 = this.circlePoint(this.arc5, this.angle5[0]);
    this.apex3 = this.circlePoint(this.arc7, this.angle7[1]);
    this.apex4 = new THREE.Vector3(- 410, 1008, 0);
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
    const outers = [this.circle1, this.circle2];
    outers.forEach((outer) => {
      const points = this.circlePointGen2(outer,[90, 450], this.divCount);
      const mesh = this.guidelineGen(points);
      this.guidelines.add(mesh);
    });

    const heads = [this.arc5, this.arc8, this.arc11, this.arc14];
    for (var i = 0;i <= 3;i ++) {
      const points = this.circlePointGen2(heads[i], [0, 450], this.divCount);
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      for (var j = 0;j <= 1;j ++) {
        const mesh = new THREE.Line(geo, j == 0 ? this.guideMat : this.subMat);
        mesh.position.y = - 1250 * j;
        this.guidelines.add(mesh);
      }
    }

    const wings = [this.arc1, this.arc4, this.arc2, this.arc3];
    for (var i = 0;i <= 3;i ++) {
      const points = this.circlePointGen2(wings[i], [0, 450], this.divCount);
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      for (var j = 0;j <= 1;j ++) {
        const mesh = new THREE.Line(geo, j == 0 ? this.guideMat : this.subMat);
        mesh.position.y = - 1250 * j;
        this.guidelines.add(mesh);
      }
    }

    const beaks = [
      [this.apex1, this.apex2],
      [this.apex2, this.apex4],
      [this.apex4, this.apex1],
      [this.apex4, this.apex3],
      [this.apex3, this.apex1]
    ];
    for (var i = 0;i <= 4;i ++) {
      const beak = beaks[i];
      const points = this.linePointGen2(beak[0], beak[1], 20, this.divCount);
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      for (var j = 0;j <= 1;j ++) {
        const mesh = new THREE.Line(geo, j == 0 ? this.guideMat : this.subMat);
        mesh.position.y = - 1250 * j;
        this.guidelines.add(mesh);
      }
    }

    this.group.add(this.guidelines);
  }

  // アウトラインを作成
  generateOutline = () => {

    const w = 4;

    // 外周円
    const outers = [this.circle1, this.circle2];
    outers.forEach((outer) => {
      const outer1 = {a: outer.a, b: outer.b, r: outer.r + w};
      const outer2 = {a: outer.a, b: outer.b, r: outer.r - w};
      const shape = this.curvePointGen2(outer1, [0, 360]);
      const path  = this.curvePointGen2(outer2, [0, 360]);
      const geo = this.shapeGeoGen(shape, path);
      const mesh = new THREE.Mesh(geo, this.outlineMat);
      this.outlines.add(mesh);
    });

    // 翼
    const arcs1 = [this.arc1, this.arc2, this.arc3, this.arc4, this.arc5];
    const angles1 = [this.angle1, this.angle2, this.angle3, this.angle4, this.angle5];
    for (var i = 0;i <= 4;i ++) {
      const arc1 = {a: arcs1[i].a, b: arcs1[i].b, r: arcs1[i].r + (i == 0 || i == 3 ? w * 2: w)};
      const arc2 = {a: arcs1[i].a, b: arcs1[i].b, r: arcs1[i].r - (i == 0 || i == 3 ? 0: w)};
      const angle = angles1[i]
      const point1 = this.curvePointGen2(arc1, [angle[0], angle[1]]);
      const point2 = this.curvePointGen2(arc2, [angle[1], angle[0]]);
      const points = point1.concat(point2);
      const geo = this.shapeGeoGen(points);
      for (var j = 0;j <= 1;j ++) {
        const mesh = new THREE.Mesh(geo, this.outlineMat);
        mesh.position.y = - 1250 * j;
        this.outlines.add(mesh);
      }
    }

    const eyePoint1 = this.curvePointGen2(this.arc12, [0, 360]);
    const eyePoint2 = this.curvePointGen2(this.arc13, [0, 360]);
    const eyePoint3 = this.curvePointGen2(this.arc15, [0, 360]);
    const eyePoint4 = this.curvePointGen2(this.arc16, [0, 360]);
    const eyeGeo1 = this.shapeGeoGen(eyePoint1, eyePoint2);
    const eyeGeo2 = this.shapeGeoGen(eyePoint3, eyePoint4);
    for (var j = 0;j <= 1;j ++) {
      const mesh1 = new THREE.Mesh(eyeGeo1, this.outlineMat);
      const mesh2 = new THREE.Mesh(eyeGeo2, this.outlineMat);
      mesh1.position.y = - 1250 * j;
      mesh2.position.y = - 1250 * j;
      this.outlines.add(mesh1, mesh2);
    }

    const creasePoint1 = this.curvePointGen2(this.arc9,  this.angle9);
    const creasePoint2 = this.curvePointGen2(this.arc10, this.angle10);
    const creases    = creasePoint1.concat(creasePoint2);
    const creaseShape = new THREE.Shape(creases);
    const creaseGeo = new THREE.ShapeGeometry(creaseShape);
    for (var j = 0;j <= 1;j ++) {
      const mesh = new THREE.Mesh(creaseGeo, this.outlineMat);
      mesh.position.y = - 1250 * j;
      this.outlines.add(mesh);
    }

    const beaks = [
      [this.apex1, this.apex2],
      [this.apex1, this.apex3],
      [this.apex4, this.apex2],
      [this.apex4, this.apex3],
      [this.apex1, this.apex4],
    ];
    for (var i = 0;i <= 4;i ++) {
      const beak = beaks[i];
      const geo = this.outlineGeoGen(beak[0], beak[1]);
      for (var j = 0;j <= 1;j ++) {
        const mesh = new THREE.Mesh(geo, this.outlineMat);
        mesh.position.y = - 1250 * j;
        this.outlines.add(mesh);
      }
    }

    this.group.add(this.outlines, this.outlineEdges);
  }

  // 塗りつぶし図形を生成
  generateShape = () => {

    // 外周円
    const outers = [this.circle1, this.circle2];
    for (var i = 0;i <= 0;i ++) {
      const shape = this.curvePointGen2(outers[0], [0, 360]);
      const path  = this.curvePointGen2(outers[1], [0, 360]);
      const geo   = this.shapeGeoGen(shape, path);
      const mesh  = new THREE.Mesh(geo, this.shapeMat);
      this.shapes.add(mesh);
    }

    // 翼
    const arcs1 = [this.arc1, this.arc2, this.arc3, this.arc4];
    const angles1 = [this.angle1, this.angle2, this.angle3, this.angle4];
    var wingShapes = [];
    for (var i = 0;i <= 3;i ++) {
      const arc = arcs1[i];
      const angle = angles1[i];
      const shape = this.curvePointGen2(arc, angle);
      wingShapes = wingShapes.concat(shape);
    }
    const wingGeo = this.shapeGeoGen(wingShapes);

    // 頭
    const headShape1 = this.curvePointGen2(this.arc5, [this.angle5[0] - 0.5, this.angle5[1]]);
    const headShape2 = this.curvePointGen2(this.arc6, this.angle6);
    const headShape3 = this.curvePointGen2(this.arc7, [this.angle7[0], this.angle7[1] - 0.3]);

    const eyeShape1 = this.curvePointGen2(this.arc12, [0, 360]);
    const eyeShape2 = this.curvePointGen2(this.arc13, [0, 360]);
    const eyeShape3 = this.curvePointGen2(this.arc14, [0, 360]);

    const creaseShape1 = this.curvePointGen2(this.arc9,  this.angle9);
    const creaseShape2 = this.curvePointGen2(this.arc10, this.angle10);

    const apex = new THREE.Vector3(this.apex1.x + 3, this.apex1.y, 0);
    const headShapes =   headShape1.concat(headShape2, headShape3, apex);
    const creases    = creaseShape1.concat(creaseShape2);

    const headShape = new THREE.Shape(headShapes);
    const headPath1 = new THREE.Path(eyeShape1);
    const headPath2 = new THREE.Path(creases);
    headShape.holes.push(headPath1, headPath2);

    const headGeo = new THREE.ShapeGeometry(headShape);
    const eyeGeo = this.shapeGeoGen(eyeShape2, eyeShape3);

    const w = 4;
    const form1 = this.lineShift(this.apex1, this.apex2, - w);
    const form2 = this.lineShift(this.apex2, this.apex4, w);
    const form3 = this.lineShift(this.apex4, this.apex1, w);

    const form4 = this.lineShift(this.apex1, this.apex3, - w);
    const form5 = this.lineShift(this.apex3, this.apex4, w);
    const form6 = this.lineShift(this.apex4, this.apex1, - w);

    const apex1 = this.getIntersect2(form1, form2);
    const apex2 = this.getIntersect2(form2, form3);
    const apex3 = this.getIntersect2(form3, form1);

    const apex4 = this.getIntersect2(form4, form5);
    const apex5 = this.getIntersect2(form5, form6);
    const apex6 = this.getIntersect2(form6, form4);
    const upperBeakGeo = this.shapeGeoGen([apex1, apex2, apex3]);
    const lowerBeakGeo = this.shapeGeoGen([apex4, apex5, apex6]);

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
    const param = this.guidelineParams;
    const drawInRatio   = THREE.MathUtils.smoothstep(progRatio, param.drawIn[0]  , param.drawIn[1]  );
    const drawOutRatio  = THREE.MathUtils.smoothstep(progRatio, param.drawOut[0] , param.drawOut[1] );
    const fadeInRatio1  = THREE.MathUtils.smoothstep(progRatio, param.fadeIn1[0] , param.fadeIn1[1] );
    const fadeOutRatio1 = THREE.MathUtils.smoothstep(progRatio, param.fadeOut1[0], param.fadeOut1[1]);
    const fadeInRatio2  = THREE.MathUtils.smoothstep(progRatio, param.fadeIn2[0] , param.fadeIn2[1] );
    const fadeOutRatio2 = THREE.MathUtils.smoothstep(progRatio, param.fadeOut2[0], param.fadeOut2[1]);
    const scaleInRatio  = THREE.MathUtils.smoothstep(progRatio, param.scaleIn[0] , param.scaleIn[1] );
    const scaleOutRatio = THREE.MathUtils.smoothstep(progRatio, param.scaleOut[0], param.scaleOut[1]);

    // 描画アニメーションの進捗
    const drawDelayFactor = 0.03;
    const maxDrawDelay = drawDelayFactor * this.guidelines.children.length;
    const drawRatio = drawInRatio - drawOutRatio;

    // スケールアニメーションの進捗
    const scaleDelayFactor = 0.03;
    const maxScaleDelay = scaleDelayFactor * this.guidelines.children.length;
    const scaleRatio = scaleInRatio - scaleOutRatio;

    // フェードアニメーションの進捗
    const fadeRatio = (fadeInRatio1 - fadeOutRatio1) + (fadeInRatio2 - fadeOutRatio2);

    for (var i = 0;i <= this.guidelines.children.length - 1;i ++) {
      const drawDelay = drawDelayFactor * i;
      const drawRatioD = THREE.MathUtils.inverseLerp(drawDelay, 1.0 + drawDelay - maxDrawDelay, drawRatio);

      const scaleDelay = scaleDelayFactor * (this.guidelines.children.length - i);
      // const scaleDelay = scaleDelayFactor * i;
      const scaleRatioD = THREE.MathUtils.smootherstep(scaleRatio, scaleDelay, 1.0 + scaleDelay - maxScaleDelay);

      const control = (mesh) => {
        mesh.geometry.setDrawRange(0, this.divCount * drawRatioD);
        mesh.material.opacity = fadeRatio;
        mesh.scale.set(scaleRatioD, scaleRatioD);
      }

      const child = this.guidelines.children[i];
      if (child.isGroup) {
        child.children.forEach((mesh) => control(mesh));
      } else {
        control(child);
      }
    }
  }

}
