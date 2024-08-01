'use strict';

import * as THREE from 'three';
import Kamon from '../kamon2.js';

export default class JuurokuyouYaegiku extends Kamon {

  constructor() {

    super();

    // infoのテキスト
    this.jpNameText = '十六葉八重表菊';
    this.jpDescText = '茗荷紋は、香味野菜として知られるミョウガをモチーフにした家紋で、日本十代家紋の一つに数えられます。茗荷紋は摩多羅神のシンボルと言われており、摩多羅神が日光東照宮に祀られたことがきっかけで広まったとされています。また、仏教用語である冥加（神仏からの目に見えない加護）と発音が同じであることも縁起が良いとされ、普及した要因の一つと言われています。';
    this.enNameText = 'Juurokuyou-yaegiku';
    this.enDescText = 'Myougamon is a family crest with a motif of Japanese ginger, which is known as a flavorful vegetable, and is considered one of the ten Japanese family crests. The Myouga crest is said to be a symbol of the god Matara, and it is said that it became popular when Matara was enshrined at Nikko Toshogu Shrine. It is also said to have the same pronunciation as the Buddhist term Myouga (invisible protection from the gods and Buddha), which is said to be auspicious, and is said to be one of the reasons for its popularity.';

    // ガイドラインの表示アニメーションパラメータ
    this.guidelineParams = {
      drawIn   : [0.10, 0.40],
      drawOut  : [0.55, 0.80],
      fadeIn1  : [0.00, 0.00],
      fadeOut1 : [0.35, 0.40],
      fadeIn2  : [0.625, 0.675],
      fadeOut2 : [0.80, 0.85],
      scaleIn  : [0.00, 0.00],
      scaleOut : [0.70, 0.90],
    }

    // アウトラインの表示アニメーションパラメータ
    this.outlineParams = {
      fadeIn1  : [0.30, 0.35],
      fadeOut1 : [0.35 ,0.40],
      fadeIn2  : [0.60, 0.65],
      fadeOut2 : [0.65, 0.70],
      scaleIn  : [0.00, 0.00],
      scaleOut : [1.00, 1.00],
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

    // 中心円
    this.center1 = {a: 0, b: 0, r: 1600};
    this.center2 = {a: 0, b: 0, r: 200};

    this.theta = 360 / 16;

    // 外周円
    const thetaR = THREE.MathUtils.degToRad(this.theta / 2);
    const r = (1600 * Math.sin(thetaR)) / (1 + Math.sin(thetaR));
    this.outer1 = {a: 0, b: 1600 - r, r: r}
    this.outerAngle1 = [
      - this.theta / 2,
      180 + this.theta / 2
    ];

    // 放射線
    this.raditation1 = [
      this.circumPoint(this.center1, 90 - this.theta / 2),
      new THREE.Vector3(0, 0, 0),
    ];

    const c = r / Math.tan(thetaR);
    this.raditation2 = [
      new THREE.Vector3(c * Math.sin(thetaR), c * Math.cos(thetaR), 0),
      this.circumPoint(this.center2, 90 - this.theta / 2),
    ];

    const point1 = this.circumPoint(this.center1, 90 - (this.theta / 4));
    const point2 = new THREE.Vector3(0, 0, 0);
    // const inter = this.interLineCircle(this.outer1, [point1, point2]);
    const form = this.from2Points(point1, point2);
    const inter = this.interLineCircle0(this.outer1.r, this.outer1.a, this.outer1.b, form.a, form.c);
    // console.log(this.theta / 4, point1, point2, inter)
    const angle = this.circumAngle(this.outer1, inter[0]);
    // console.log(this.theta / 4, point1, point2, inter, angle)
    this.outerAngle2 = [
      angle,
      180 - angle
    ];



    // 外周円

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

  // 円弧のアウトライン座標を生成（circle: {a: 円の中心X,b: 円の中心Y,r: 円の半径}, angle: 弧の角度[0: 始点, 1:終点], clockwise: 時計回りか否かtrue/false）
  curveOutlinePointGen = (circle, angle, clockwise) => {
    const w = 4;
    const arc1 = {a: circle.a, b: circle.b, r: circle.r + w};
    const arc2 = {a: circle.a, b: circle.b, r: circle.r - w};
    const point1 = this.curvePointGen(arc1, [angle[0], angle[1]], clockwise);
    const point2 = this.curvePointGen(arc2, [angle[1], angle[0]], !clockwise);
    const points = point2.concat(point1);
    return points;
  }

  // ガイドラインを作成
  generateGuideline = () => {

    // 中心円１
    [this.center1].forEach((circle) => {
      const points = this.circleLocusGen(circle, [90, 450], this.divCount);
      const mesh = this.sublineGen(points);
      this.guidelines.add(mesh);
    })

    const pointArr = [];

    // 放射線
    // const theta0 = 360 / 16;
    // const point1 = this.circumPoint(this.center1, 90 - theta0 / 2);
    // const point2 = new THREE.Vector3(0, 0, 0);
    const rad = this.raditation1;
    // const radGeo = this.lineLocusGen(rad[0], rad[1], 0, this.divCount);
    pointArr.push(this.lineLocusGen(rad[0], rad[1], 0, this.divCount));
    // pointArr.push(this.lineLocusGen(this.circumPoint(this.center1, 90 - (this.theta / 4)), rad[1], 0, this.divCount));

    // 外周円
    // const thetaR0 = THREE.MathUtils.degToRad(theta0 / 2);
    // const r = (1600 * Math.sin(thetaR0)) / (1 + Math.sin(thetaR0));
    // const circle1 = {a: 0, b: 1600 - r, r: r}
    for (var i = 0;i <= 1;i ++) {
      pointArr.push(this.circleLocusGen(this.outer1, [90, 450], this.divCount));
    }

    // メッシュの生成を16回繰り返す
    for (var i = 0;i <= pointArr.length - 1;i ++) {
    // for (var i = 0;i <= 0;i ++) {
      const group = new THREE.Group();
      const points = pointArr[i];
      for (var j = 0;j <= 15;j ++) {
        const mesh = i == 2 ? this.sublineGen(points) : this.guidelineGen(points);
        const angle = i == 2 ? this.theta * (j - 0.5) : this.theta * j
        mesh.rotation.z = THREE.MathUtils.degToRad(angle);
        group.add(mesh);
      }
      this.guidelines.add(group);
    }

    // 中心円２
    [this.center2].forEach((circle) => {
      const points = this.circleLocusGen(circle, [90, 450], this.divCount);
      const mesh = this.guidelineGen(points);
      this.guidelines.add(mesh);
    })

    this.group.add(this.guidelines);
  }

  // アウトラインを作成
  generateOutline = () => {

    // 中心円
    const geo = this.curveOutlineGeoGen(this.center2, [0, 360], false);
    const mesh = new THREE.Mesh(geo, this.outlineMat);
    this.outlines.add(mesh);


    const geoArr = [];

    // 放射線
    geoArr.push(this.outlineGeoGen(this.raditation2[0], this.raditation2[1]));

    // 外周円の弧
    // const geo = this.curveOutlineGeoGen(this.center2, [0, 360], false);
    geoArr.push(this.curveOutlineGeoGen(
      this.outer1, [this.outerAngle1[0], this.outerAngle1[1]], false))
    geoArr.push(this.curveOutlineGeoGen(
      this.outer1, [this.outerAngle2[0], this.outerAngle2[1]], false))

    // メッシュの生成を16回繰り返す
    for (var i = 0;i <= geoArr.length - 1;i ++) {
      // const group = new THREE.Group();
      const geo = geoArr[i];
      for (var j = 0;j <= 15;j ++) {
        const mesh = new THREE.Mesh(geo, this.outlineMat);
        const angle = i == 2 ? this.theta * (j - 0.5) : this.theta * j
        mesh.rotation.z = THREE.MathUtils.degToRad(angle);
        this.outlines.add(mesh);
        // group.add(mesh);
      }
    }


    this.group.add(this.outlines);
  }

  // 塗りつぶし図形を生成
  generateShape = () => {

    const w = 4;

    // 中心円
    // const centers = [this.circle4];
    [this.center2].forEach((circle) => {
      const param = {a: circle.a, b: circle.b, r: circle.r - w};
      const shape = this.curvePointGen(param, [0, 360], true);
      const geo = this.shapeGeoGen(shape);
      const mesh = new THREE.Mesh(geo, this.shapeMat);
      this.shapes.add(mesh);
    });

    // const w = 4;
    // const geos = [];

    // for (var i = 0;i <= this.frames.length - 1;i ++) {
    //   // 輪郭の座標からシェイプを生成
    //   var shapes = [];
    //   const frameGroup = this.frames[i];
    //   frameGroup.forEach((param) => {
    //     const circle = param.r;
    //     const side = param.s - 1;
    //     const circleParam = {a: circle.a, b: circle.b, r: circle.r + w * side};
    //     const points = this.curvePointGen(circleParam, [param.f, param.t], param.c);
    //     shapes = shapes.concat(points);
    //   })
    //   const shape = new THREE.Shape(shapes);

    //   // ひだの座標から生成したパスを輪郭のシェイプから除外してジオメトリを生成
    //   const foldsGroup = this.folds[i];
    //   foldsGroup.forEach((param) => {
    //     const points = this.curveOutlinePointGen(param, [param.f, param.t], param.c);
    //     const path = new THREE.Path(points);
    //     shape.holes.push(path);
    //   })
    //   const geo = new THREE.ShapeGeometry(shape);
    //   geos.push(geo);
    // }

    // // ジオメトリからメッシュを生成（反転分も生成）
    // for (var i = 0;i <= 1;i ++) {
    //   geos.forEach((geo) => {
    //     const mesh = new THREE.Mesh(geo, this.shapeMat);
    //     mesh.rotation.y = THREE.MathUtils.degToRad(180 * i);
    //     this.shapes.add(mesh);
    //   })
    // }

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
    const drawDelayFactor = 0.05;
    const maxDrawDelay = drawDelayFactor * this.guidelines.children.length;
    const drawRatio = drawInRatio - drawOutRatio;

    // スケールアニメーションの進捗
    const scaleDelayFactor = 0.04;
    const maxScaleDelay = scaleDelayFactor * this.guidelines.children.length;
    const scaleRatio = scaleInRatio - scaleOutRatio;

    // フェードアニメーションの進捗
    const fadeRatio = (fadeInRatio1 - fadeOutRatio1) + (fadeInRatio2 - fadeOutRatio2);

    for (var i = 0;i <= this.guidelines.children.length - 1;i ++) {
      const drawDelay = drawDelayFactor * i;
      const drawRatioD = THREE.MathUtils.inverseLerp(drawDelay, 1.0 + drawDelay - maxDrawDelay, drawRatio);

      const scaleDelay = scaleDelayFactor * (this.guidelines.children.length - i);
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
