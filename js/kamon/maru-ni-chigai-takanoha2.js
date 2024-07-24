'use strict';

import * as THREE from 'three';
import Kamon2 from '../kamon2.js';

export default class MaruNiChigaiTakanoha2 extends Kamon2 {

  constructor() {

    super();

    // ブラックボード用のグループとマテリアル
    this.blackBoard = new THREE.Group();
    this.blackBoardMat = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      transparent: true,
    });

    // infoのテキスト
    this.jpNameText = '丸に違い鷹の羽';
    this.jpDescText = '鷹の羽紋は、鷹の羽根を図案化した家紋です。鷹は獲物を狩る際の勇猛さや高い知性がイメージされることや、鷹の羽根が矢羽根の材料に用いられたことから武士に好まれ、武家の家紋として多く採用されてきました。普及する中で派生した図案も60種類以上と多く、広く使用されている五大紋の一つに数えられています。';
    this.enNameText = 'Maruni-Chigai-Takanoha';
    this.enDescText = 'The hawk feather crest is a family crest that is a stylized version of a hawk&#39;s feathers. Hawks were popular among samurai warriors because they were associated with bravery and high intelligence when hunting prey, and hawk feathers were used to make arrow feathers, and were often used as family emblems of samurai families. Over 60 different designs have been derived from it as it has become popular, and it is counted as one of the five widely used crests.';

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

    // 中心円
    this.circle1 = {a: 0, b: 0, r: 1600};
    this.circle2 = {a: 0, b: 0, r: 1300};

    // 羽の輪郭円
    this.wingR = 530;
    this.circle3 = {a:   this.wingR      , b:   this.wingR      , r: this.wingR};
    this.circle4 = {a: - this.wingR      , b: - this.wingR      , r: this.wingR};
    this.circle5 = {a: - this.wingR +  50, b: - this.wingR +  50, r: this.wingR};
    this.circle6 = {a: - this.wingR + 100, b: - this.wingR + 100, r: this.wingR};

    // 対角線１
    const apex1 = this.circleShort(this.circle1,  45);
    const apex2 = this.circleShort(this.circle1, 225);
    this.radiation1 = [apex1, apex2];

    // 対角線２
    const theta1 = THREE.MathUtils.radToDeg(Math.asin(40 / this.wingR));
    const apex3 = this.circleShort(this.circle3,  45 - theta1);
    const apex4 = this.circleShort(this.circle4, 225 + theta1);
    const apex5 = this.circleShort(this.circle3,  45 + theta1);
    const apex6 = this.circleShort(this.circle4, 225 - theta1);
    this.radiation2 = [apex3, apex4];
    this.radiation3 = [apex5, apex6];

    // 羽の輪郭線
    const apex7  = this.circleShort(this.circle3, - 45);
    const apex8  = this.circleShort(this.circle4, - 45);
    const apex9  = this.circleShort(this.circle3,  135);
    const apex10 = this.circleShort(this.circle4,  135);
    this.contour1 = [apex7, apex8];
    this.contour2 = [apex9, apex10];

    // 羽の模様
    // const radForm2 = this.from2Points2(apex3, apex4);
    this.decorations = [];
    // const radForms = [
    //   this.from2Points3(apex3, apex4),
    //   this.from2Points3(apex5, apex6),
    // ];
    // const decoFormsArr = [
    //   [{a: 0, b: 1, c: 110}, {a: 0, b: 1, c: 210}, {a: 0, b: 1, c: 310}],
    //   [{a: 1, b: 0, c: 110}, {a: 1, b: 0, c: 210}, {a: 1, b: 0, c: 310}],
    // ];
    // for (var i = 0;i <= radForms.length - 1;i ++) {
    //   const radForm = radForms[i];
    //   const decoForms = decoFormsArr[i];
    //   for (var j = 0;j <= decoForms.length - 1; j ++) {
    //     const decoForm = decoForms[j];
    //     console.log(radForm, decoForm)
    //     const apexF = this.getIntersect2(radForm, decoForm);
    //     console.log(apexF)
    //     const apexTd = this.interLineCircle2(this.circle3, decoForm);
    //     console.log(apexTd)
    //     const apexT = apexTd[0].x > apexTd[1].x ? apexTd[0] : apexTd[1];
    //     console.log(apexF, apexT)
    //     this.decorations.push([apexF, apexT]);

    //   }
    // }
    // const radiations = [this.radiation2, this.radiation3];
    // const lineSet = [
    //   [
    //     [new THREE.Vector3(0, 110, 0), new THREE.Vector3(1600, 110, 0)],
    //     [new THREE.Vector3(0, 210, 0), new THREE.Vector3(1600, 210, 0)],
    //     [new THREE.Vector3(0, 310, 0), new THREE.Vector3(1600, 310, 0)],
    //   ],
    //   [
    //     [new THREE.Vector3(110, 0, 0), new THREE.Vector3(110, 1600, 0)],
    //     [new THREE.Vector3(210, 0, 0), new THREE.Vector3(210, 1600, 0)],
    //     [new THREE.Vector3(310, 0, 0), new THREE.Vector3(310, 1600, 0)],
    //   ],
    // ];
    const lines1 = [
      [new THREE.Vector3(0, 110, 0), new THREE.Vector3(1600, 110, 0)],
      [new THREE.Vector3(0, 210, 0), new THREE.Vector3(1600, 210, 0)],
      [new THREE.Vector3(0, 310, 0), new THREE.Vector3(1600, 310, 0)],
    ];
    for (var i = 0;i <= lines1.length - 1;i ++) {
      const apexF = this.getIntersect3(this.radiation2, lines1[i]);
      const apexTd = this.interLineCircle3(this.circle3, lines1[i]);
      // console.log(apexF, apexTd)
      const apexT = apexTd[0].x > apexTd[1].x ? apexTd[0] : apexTd[1];
      // console.log(apexF, apexTd, apexT)
      this.decorations.push([apexF, apexT]);
    }

    const lines2 = [
      [new THREE.Vector3(110, 0, 0), new THREE.Vector3(110, 1600, 0)],
      [new THREE.Vector3(210, 0, 0), new THREE.Vector3(210, 1600, 0)],
      [new THREE.Vector3(310, 0, 0), new THREE.Vector3(310, 1600, 0)],
    ];
    for (var i = 0;i <= lines2.length - 1;i ++) {
      const apexF = this.getIntersect3(this.radiation3, lines2[i]);
      const apexTd = this.interLineCircle3(this.circle3, lines2[i]);
      // console.log(apexF, apexTd)
      const apexT = apexTd[0].y > apexTd[1].y ? apexTd[0] : apexTd[1];
      // console.log(apexF, apexTd, apexT)
      this.decorations.push([apexF, apexT]);
    }
// console.log(this.decorations)

    // for (var i = 0;i <= lineSet.length - 1;i ++) {
    //   const lines = lineSet[i];
    //   for (var j = 0;j <= lines.length - 1;j ++) {
    //     const apexF = this.getIntersect3(radiations[i], lines[j]);
    //     const apexTd = this.interLineCircle3(this.circle3, lines[j]);
    //     // console.log(apexF, apexTd)
    //     const apexT = apexTd[0].x > apexTd[1].x ? apexTd[0] : apexTd[1];
    //     console.log(apexF, apexTd, apexT)
    //     this.decorations.push([apexF, apexT]);
    //   }
    // }


    // const decoForm1 = {a: 0, b: 110};
    // const decoApex1 = this.getIntersect2(radForm2, decoForm1);
    // const decoApex2d = this.interLineCircle2(this.circle3, decoForm1);
    // const decoApex2 = decoApex2d[0].x > decoApex2d[1].x ? decoApex2d[0] : decoApex2d[1];
    // this.decoration1 = [decoApex1, decoApex2];

    // const decoForm2 = {a: 0, b: 210};
    // const decoForm3 = {a: 0, b: 310};
    // // console.log(decoApex2d, this.decoration1)
    // const decoApex3 = this.getIntersect2(radForm2, decoForm2);
    // const decoApex5 = this.getIntersect2(radForm2, decoForm3);




    const radForm3 = this.from2Points2(apex5, apex6);


  }

  // オブジェクトを生成
  init = () => {

    // ガイドラインの作成
    this.generateGuideline();

    // アウトラインの作成
    // this.generateOutline();

    // 塗りつぶし図形の描画
    this.generateShape();

  }

  // // テーマカラー変更
  // changeTheme(frontColor, backColor, guideColor) {
  //   super.changeTheme(frontColor, backColor, guideColor);
  //   this.blackBoardMat.color = new THREE.Color(backColor);
  // }

  // ガイドラインを作成
  generateGuideline = () => {

    // 中心円
    const circles1 = [this.circle1, this.circle2];
    for (var i = 0;i <= circles1.length - 1;i ++) {
      const circle = circles1[i];
      const points = this.circlePointGen2(circle,[90, 450], this.divCount);
      const mesh = this.guidelineGen(points);
      this.guidelines.add(mesh);
    }

    // // 補助円１
    // const rad = this.wingR /  Math.cos(THREE.MathUtils.degToRad(45));
    // // console.log(rad)
    // const auxCircle = {a: 0, b: 0, r: rad};
    // const auxPoints = this.circlePointGen2(auxCircle,[90, 450], this.divCount);
    // const auxMesh = this.sublineGen(auxPoints);
    // this.guidelines.add(auxMesh);


    // 羽の輪郭円
    const circles2 = [this.circle3, this.circle4, this.circle5, this.circle6];
    for (var i = 0;i <= circles2.length - 1;i ++) {
      const circle = circles2[i];
      const points = this.circlePointGen2(circle,[90, 450], this.divCount);
      const mesh = this.guidelineGen(points);
      this.guidelines.add(mesh);
    }

    // 羽の輪郭線
    const contours = [this.contour1, this.contour2];
    for (var i = 0;i <= contours.length - 1;i ++) {
      const contour = contours[i];
      const points = this.linePointGen2(contour[0], contour[1], 0, this.divCount);
      const mesh = this.guidelineGen(points);
      this.guidelines.add(mesh);
    }

    // 対角線１
    const radPoints = this.linePointGen2(this.radiation1[0], this.radiation1[1], 0, this.divCount);
    const radMesh = this.sublineGen(radPoints);
    this.guidelines.add(radMesh);

    // 対角線２
    const radiations = [this.radiation2, this.radiation3];
    for (var i = 0;i <= radiations.length - 1;i ++) {
      const rad = radiations[i];
      const points = this.linePointGen2(rad[0], rad[1], 0, this.divCount);
      const mesh = this.guidelineGen(points);
      this.guidelines.add(mesh);
    }

    // 羽の模様
    //  const decorations = [this.decoration1];
    for (var i = 0;i <= this.decorations.length - 1;i ++) {
      const deco = this.decorations[i];
      // console.log(deco)
      const points = this.linePointGen3(deco[0], deco[1], 0, this.divCount);
      const mesh = this.guidelineGen(points);
      // console.log(i, points)
      this.guidelines.add(mesh);
    }
 
    // // 外円
    // const outCircles = new THREE.Group();
    // const rs = [1600, 1300];
    // rs.forEach((r) => {
    //   const points = this.circlePointGen(0, 0, r, 90, 450, this.divCount);
    //   const circle = this.guidelineGen(points);
    //   outCircles.add(circle);
    // });
    // this.guidelines.add(outCircles);

    // // 羽
    // for (var i = 0;i <= 1;i ++) {

    //   // 羽の輪郭円
    //   const group1 = new THREE.Group();
    //   const params1 = [
    //     {a:   516, b:   516, r: 516},
    //     {a: - 416, b: - 416, r: 516},
    //     {a: - 466, b: - 466, r: 516},
    //     {a: - 516, b: - 516, r: 516},
    //     {a: - 416, b: - 416, r: 550},
    //     {a: - 466, b: - 466, r: 550},
    //   ];
    //   params1.forEach((param) => {
    //     const points = this.circlePointGen(param.a, param.b, param.r, 90, 450, this.divCount);
    //     const circle = this.guidelineGen(points);
    //     circle.rotation.z = THREE.MathUtils.degToRad(90 * i);
    //     group1.add(circle);
    //   });

    //   // 羽の輪郭線
    //   const group2 = new THREE.Group();
    //   const theta = THREE.MathUtils.degToRad(45);
    //   const params2 = [
    //     {p:   516 * Math.cos(theta), q:   516 * Math.cos(theta), f: 700, t: - 700},
    //     {p:   552 * Math.cos(theta), q:   552 * Math.cos(theta), f: 700, t: - 700},
    //     {p:    35 * Math.cos(theta), q:    35 * Math.cos(theta), f: 950, t: - 950},
    //     {p:    71 * Math.cos(theta), q:    71 * Math.cos(theta), f: 950, t: - 950},
    //   ];
    //   params2.forEach((param) => {
    //     for (var j = 0;j <= 1;j ++) {
    //       const points = this.linePointGen(1, 1, - (param.p + param.q), param.f + param.p, param.t + param.p, this.divCount);
    //       const line = this.guidelineGen(points);
    //       line.rotation.z = THREE.MathUtils.degToRad(90 * i + 180 * j);
    //       group2.add(line);
    //     }
    //   });

    //   // 羽の模様（タテ）
    //   const group3 = new THREE.Group();
    //   const params3 = [94, 130, 194, 230, 294, 330, - 646, - 610, - 546, - 510, - 446, - 410];
    //   params3.forEach((param) => {
    //     const points = this.linePointGen(1, 0, - param, 1100, - 1100, this.divCount);
    //     const line = this.guidelineGen(points);
    //     line.rotation.z = THREE.MathUtils.degToRad(90 * i);
    //     group3.add(line);
    //   });

    //   // 羽の模様（ヨコ）
    //   const group4 = new THREE.Group();
    //   const params4 = [- 94, - 130, - 194, - 230, - 294, - 330, 646, 610, 546, 510, 446, 410];
    //   params4.forEach((param) => {
    //     const points = this.linePointGen(0, 1, - param, 1100, - 1100, this.divCount);
    //     const line = this.guidelineGen(points);
    //     line.rotation.z = THREE.MathUtils.degToRad(90 * i);
    //     group4.add(line);
    //   });

    //   this.guidelines.add(group1, group2, group3, group4);
    // }

    this.group.add(this.guidelines);
  }

  // アウトラインを作成
  generateOutline = () => {

    // 外円
    const rs = [1600, 1300];
    rs.forEach((r) => {
      const circleGeo = this.outlineCircleGeoGen(0, 0, r, 90, 450, this.divCount);
      const w = 6;
      for (var g = - w;g <= w;g ++) {
        const circle = this.outlineCircleMeshGen(circleGeo, 0, 0, r, g, 0, 0, 0);
        this.outlines.add(circle);
      }
    });

    // 羽

    // 円のパラメータ
    const ens = [
      {a:   516, b:   516, r: 516},
      {a: - 416, b: - 416, r: 516},
      {a: - 466, b: - 466, r: 516},
      {a: - 516, b: - 516, r: 516},
      {a: - 416, b: - 416, r: 550},
      {a: - 466, b: - 466, r: 550},
    ];

    // 輪郭＆中心の線のパラメータ
    const theta = THREE.MathUtils.degToRad(45);
    const sens1 = [
      {p: - 516 * Math.cos(theta), q: - 516 * Math.cos(theta)},
      {p: -  71 * Math.cos(theta), q: -  71 * Math.cos(theta)},
      {p: -  35 * Math.cos(theta), q: -  35 * Math.cos(theta)},
    ];

    // 羽の模様線のパラメータ
    const stripes1 = [94, 130, 194, 230, 294, 330, - 646, - 610, - 546, - 510, - 446, - 410];

    // 輪郭＆中心線の描画
    const sen0Params1 = [
      {f:    94, t: - 410},
      {f: - 446, t: - 510},
      {f: - 546, t: - 610},
      {f: - 646, t: - 416 - 516 * Math.cos(theta)},
    ];
    sen0Params1.forEach((param) => {
      const lineGeo = this.outlineLineGeoGen(1, 1, - (sens1[0].p + sens1[0].q), param.f , param.t , this.divCount);
      const edgeGeoArr = this.outlineEdgeGeoGen(1, 1, - (sens1[0].p + sens1[0].q), param.f, param.t);
      for (var i = 0;i <= 1;i ++) {
        const w = 6;
        for (var g = - w;g <= w;g ++) {
          const line = this.outlineLineMeshGen(lineGeo, 1, 1, g, 0, THREE.MathUtils.degToRad(180 * i), THREE.MathUtils.degToRad(90 * i));
          this.outlines.add(line);
        }
        const edge0 = this.outlineEdgeMeshGen(edgeGeoArr[0], 0, THREE.MathUtils.degToRad(180 * i), THREE.MathUtils.degToRad(90 * i));
        const edge1 = this.outlineEdgeMeshGen(edgeGeoArr[1], 0, THREE.MathUtils.degToRad(180 * i), THREE.MathUtils.degToRad(90 * i));
        this.outlineEdges.add(edge0, edge1);
      }
    });

    const sen1Params1 = [
      {f: this.circle(ens[0].a, ens[0].b, ens[0].r, 45 + THREE.MathUtils.radToDeg(Math.asin(71 / ens[0].r))).x, t: 330},
      {f:   294, t:   230},
      {f:   194, t:   130},
      {f:    94, t: - 410},
      {f: - 446, t: - 510},
      {f: - 546, t: - 610},
      {f: - 646, t: this.circle(ens[1].a, ens[1].b, ens[1].r, 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[1].r))).x},
      {f: this.circle(ens[4].a, ens[4].b, ens[4].r, 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[4].r))).x, t: this.circle(ens[2].a, ens[2].b, ens[2].r, 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[2].r))).x},
      {f: this.circle(ens[5].a, ens[5].b, ens[5].r, 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[5].r))).x, t: this.circle(ens[3].a, ens[3].b, ens[3].r, 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[3].r))).x},
    ];
    sen1Params1.forEach((param) => {
      const lineGeo = this.outlineLineGeoGen(1, 1, - (sens1[1].p + sens1[1].q), param.f , param.t , this.divCount);
      const edgeGeoArr = this.outlineEdgeGeoGen(1, 1, - (sens1[1].p + sens1[1].q), param.f, param.t);
      for (var i = 0;i <= 1;i ++) {
        const w = 6;
        for (var g = - w;g <= w;g ++) {
          const line = this.outlineLineMeshGen(lineGeo, 1, 1, g, 0, THREE.MathUtils.degToRad(180 * i), THREE.MathUtils.degToRad(90 * i));
          this.outlines.add(line);
        }
        const edge0 = this.outlineEdgeMeshGen(edgeGeoArr[0], 0, THREE.MathUtils.degToRad(180 * i), THREE.MathUtils.degToRad(90 * i));
        const edge1 = this.outlineEdgeMeshGen(edgeGeoArr[1], 0, THREE.MathUtils.degToRad(180 * i), THREE.MathUtils.degToRad(90 * i));
        this.outlineEdges.add(edge0, edge1);
      }
    });

    const sen2Params1 = [
      {f: this.circle(ens[0].a, ens[0].b, ens[0].r, 45 + THREE.MathUtils.radToDeg(Math.asin(35 / ens[0].r))).x, t: this.circle(ens[3].a, ens[3].b, ens[3].r, 225 - THREE.MathUtils.radToDeg(Math.asin(35 / ens[3].r))).x},
    ];
    sen2Params1.forEach((param) => {
      const lineGeo = this.outlineLineGeoGen(1, 1, - (sens1[2].p + sens1[2].q), param.f , param.t , this.divCount);
      const edgeGeoArr = this.outlineEdgeGeoGen(1, 1, - (sens1[2].p + sens1[2].q), param.f, param.t);
      for (var i = 0;i <= 1;i ++) {
        const w = 6;
        for (var g = - w;g <= w;g ++) {
          const line = this.outlineLineMeshGen(lineGeo, 1, 1, g, 0, THREE.MathUtils.degToRad(180 * i), THREE.MathUtils.degToRad(90 * i));
          this.outlines.add(line);
        }
        const edge0 = this.outlineEdgeMeshGen(edgeGeoArr[0], 0, THREE.MathUtils.degToRad(180 * i), THREE.MathUtils.degToRad(90 * i));
        const edge1 = this.outlineEdgeMeshGen(edgeGeoArr[1], 0, THREE.MathUtils.degToRad(180 * i), THREE.MathUtils.degToRad(90 * i));
        this.outlineEdges.add(edge0, edge1);
      }
    });

    // 輪郭円の描画
    const en0Params1 = [
      {f: 45, t: 45 + THREE.MathUtils.radToDeg(Math.asin(35 / ens[0].r))},
      {f: 45 + THREE.MathUtils.radToDeg(Math.asin(71 / ens[0].r)), t: 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - stripes1[5]) / ens[0].r))},
      {f: 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - stripes1[4]) / ens[0].r)), t: 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - stripes1[3]) / ens[0].r))},
      {f: 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - stripes1[2]) / ens[0].r)), t: 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - stripes1[1]) / ens[0].r))},
    ];
    en0Params1.forEach((param) => {
      const circleGeo = this.outlineCircleGeoGen(ens[0].a, ens[0].b, ens[0].r, param.f, param.t, this.divCount);
      for (var i = 0;i <= 1;i ++) {
        const w = 6;
        for (var g = - w;g <= w;g ++) {
          const circle = this.outlineCircleMeshGen(circleGeo, ens[0].a, ens[0].b, ens[0].r, g, 0, THREE.MathUtils.degToRad(180 * i), THREE.MathUtils.degToRad(90 * i));
          this.outlines.add(circle);
        }
      }
    });

    const en1Params1 = [
      {f: 135, t: 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[1].r))},
    ];
    en1Params1.forEach((param) => {
      const circleGeo = this.outlineCircleGeoGen(ens[1].a, ens[1].b, ens[1].r, param.f, param.t, this.divCount);
      for (var i = 0;i <= 1;i ++) {
        const w = 6;
        for (var g = - w;g <= w;g ++) {
          const circle = this.outlineCircleMeshGen(circleGeo, ens[1].a, ens[1].b, ens[1].r, g, 0, THREE.MathUtils.degToRad(180 * i), THREE.MathUtils.degToRad(90 * i));
          this.outlines.add(circle);
        }
      }
    });

    const en2Params1 = [
      {f: 150, t: 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[2].r))},
    ];
    en2Params1.forEach((param) => {
      const circleGeo = this.outlineCircleGeoGen(ens[2].a, ens[2].b, ens[2].r, param.f, param.t, this.divCount);
      for (var i = 0;i <= 1;i ++) {
        const w = 6;
        for (var g = - w;g <= w;g ++) {
          const circle = this.outlineCircleMeshGen(circleGeo, ens[2].a, ens[2].b, ens[2].r, g, 0, THREE.MathUtils.degToRad(180 * i), THREE.MathUtils.degToRad(90 * i));
          this.outlines.add(circle);
        }
      }
    });

    const en3Params1 = [
      {f: 225 - THREE.MathUtils.radToDeg(Math.asin(35 / ens[3].r)), t: 225},
      {f: 150, t: 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[3].r))},
    ];
    en3Params1.forEach((param) => {
      const circleGeo = this.outlineCircleGeoGen(ens[3].a, ens[3].b, ens[3].r, param.f, param.t, this.divCount);
      for (var i = 0;i <= 1;i ++) {
        const w = 6;
        for (var g = - w;g <= w;g ++) {
          const circle = this.outlineCircleMeshGen(circleGeo, ens[3].a, ens[3].b, ens[3].r, g, 0, THREE.MathUtils.degToRad(180 * i), THREE.MathUtils.degToRad(90 * i));
          this.outlines.add(circle);
        }
      }
    });

    const en4Params1 = [
      {f: 166, t: 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[4].r))},
    ];
    en4Params1.forEach((param) => {
      const circleGeo = this.outlineCircleGeoGen(ens[4].a, ens[4].b, ens[4].r, param.f, param.t, this.divCount);
      for (var i = 0;i <= 1;i ++) {
        const w = 6;
        for (var g = - w;g <= w;g ++) {
          const circle = this.outlineCircleMeshGen(circleGeo, ens[4].a, ens[4].b, ens[4].r, g, 0, THREE.MathUtils.degToRad(180 * i), THREE.MathUtils.degToRad(90 * i));
          this.outlines.add(circle);
        }
      }
    });

    const en5Params1 = [
      {f: 166, t: 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[5].r))},
    ];
    en5Params1.forEach((param) => {
      const circleGeo = this.outlineCircleGeoGen(ens[5].a, ens[5].b, ens[5].r, param.f, param.t, this.divCount);
      for (var i = 0;i <= 1;i ++) {
        const w = 6;
        for (var g = - w;g <= w;g ++) {
          const circle = this.outlineCircleMeshGen(circleGeo, ens[5].a, ens[5].b, ens[5].r, g, 0, THREE.MathUtils.degToRad(180 * i), THREE.MathUtils.degToRad(90 * i));
          this.outlines.add(circle);
        }
      }
    });

    // 羽の模様線の描画
    var index = 0;
    stripes1.forEach((sen) => {
      const f = this.straight(1, 1, - (sens1[1].p + sens1[1].q), sen, undefined).y;
      var t;
      if (index > 1 && index <= 5) {
        t = this.circle(ens[0].a, ens[0].b, ens[0].r, 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - sen) / ens[0].r))).y;
      } else {
        t = this.straight(1, 1, - (sens1[0].p + sens1[0].q), sen, undefined).y;
      }

      const lineGeo = this.outlineLineGeoGen(1, 0, - sen, f, t, this.divCount);
      const edgeGeoArr = this.outlineEdgeGeoGen(1, 0, - sen, f, t);
      for (var i = 0;i <= 1;i ++) {
        const w = 6;
        for (var g = - w;g <= w;g ++) {
          const line = this.outlineLineMeshGen(lineGeo, 1, 0, g, 0, THREE.MathUtils.degToRad(180 * i), THREE.MathUtils.degToRad(90 * i));
          this.outlines.add(line);
        }
        const edge0 = this.outlineEdgeMeshGen(edgeGeoArr[0], 0, THREE.MathUtils.degToRad(180 * i), THREE.MathUtils.degToRad(90 * i));
        const edge1 = this.outlineEdgeMeshGen(edgeGeoArr[1], 0, THREE.MathUtils.degToRad(180 * i), THREE.MathUtils.degToRad(90 * i));
        this.outlineEdges.add(edge0, edge1);
      }
      index ++;
    });

    // 反転した羽

    // 輪郭＆中心の線のパラメータ
    const sens2 = [
      {p: - 516 * Math.cos(theta), q: - 516 * Math.cos(theta)},
      {p: -  71 * Math.cos(theta), q: -  71 * Math.cos(theta)},
      {p: -  35 * Math.cos(theta), q: -  35 * Math.cos(theta)},
      {p: - 552 * Math.cos(theta), q: - 552 * Math.cos(theta)},
      {p:   552 * Math.cos(theta), q:   552 * Math.cos(theta)},
    ];

    // 羽の模様線のパラメータ
    const stripes2 = [94, 130, 194, 230, 294, 330, - 646, - 610, - 546, - 510, - 446];

    // 輪郭＆中心線の描画
    const crossX0 = this.getIntersect(1, sens2[0].p + sens2[0].q, - 1,   (sens2[3].p + sens2[3].q)).x;
    const crossX1 = this.getIntersect(1, sens2[0].p + sens2[0].q, - 1, - (sens2[3].p + sens2[3].q)).x;
    const sen0Params2 = [
      {f:    94, t: - crossX0},
      {f: - crossX1, t: - 416 - 516 * Math.cos(theta)},
    ];
    sen0Params2.forEach((param) => {
      const lineGeo = this.outlineLineGeoGen(1, 1, - (sens2[0].p + sens2[0].q), param.f , param.t , this.divCount);
      const edgeGeoArr = this.outlineEdgeGeoGen(1, 1, - (sens2[0].p + sens2[0].q), param.f, param.t);
      for (var i = 0;i <= 1;i ++) {
        const w = 6;
        for (var g = - w;g <= w;g ++) {
          const line = this.outlineLineMeshGen(lineGeo, 1, 1, g, 0, THREE.MathUtils.degToRad(180 * (i + 1)), THREE.MathUtils.degToRad(90 * i));
          this.outlines.add(line);
        }
        const edge0 = this.outlineEdgeMeshGen(edgeGeoArr[0], 0, THREE.MathUtils.degToRad(180 * (i + 1)), THREE.MathUtils.degToRad(90 * i));
        const edge1 = this.outlineEdgeMeshGen(edgeGeoArr[1], 0, THREE.MathUtils.degToRad(180 * (i + 1)), THREE.MathUtils.degToRad(90 * i));
        this.outlineEdges.add(edge0, edge1);
      }
    });

    const crossX2 = this.getIntersect(1, sens2[1].p + sens2[1].q, - 1,   (sens2[3].p + sens2[3].q)).x;
    const crossX3 = this.getIntersect(1, sens2[1].p + sens2[1].q, - 1, - (sens2[3].p + sens2[3].q)).x;
    const sen1Params2 = [
      {f: this.circle(ens[0].a, ens[0].b, ens[0].r, 45 + THREE.MathUtils.radToDeg(Math.asin(71 / ens[0].r))).x, t: - crossX2},
      {f: - crossX3, t: - 510},
      {f: - 546, t: - 610},
      {f: - 646, t: this.circle(ens[1].a, ens[1].b, ens[1].r, 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[1].r))).x},
      {f: this.circle(ens[4].a, ens[4].b, ens[4].r, 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[4].r))).x, t: this.circle(ens[2].a, ens[2].b, ens[2].r, 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[2].r))).x},
      {f: this.circle(ens[5].a, ens[5].b, ens[5].r, 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[5].r))).x, t: this.circle(ens[3].a, ens[3].b, ens[3].r, 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[3].r))).x},
    ];
    sen1Params2.forEach((param) => {
      const lineGeo = this.outlineLineGeoGen(1, 1, - (sens2[1].p + sens2[1].q), param.f , param.t , this.divCount);
      const edgeGeoArr = this.outlineEdgeGeoGen(1, 1, - (sens2[1].p + sens2[1].q), param.f, param.t);
      for (var i = 0;i <= 1;i ++) {
        const w = 6;
        for (var g = - w;g <= w;g ++) {
          const line = this.outlineLineMeshGen(lineGeo, 1, 1, g, 0, THREE.MathUtils.degToRad(180 * (i + 1)), THREE.MathUtils.degToRad(90 * i));
          this.outlines.add(line);
        }
        const edge0 = this.outlineEdgeMeshGen(edgeGeoArr[0], 0, THREE.MathUtils.degToRad(180 * (i + 1)), THREE.MathUtils.degToRad(90 * i));
        const edge1 = this.outlineEdgeMeshGen(edgeGeoArr[1], 0, THREE.MathUtils.degToRad(180 * (i + 1)), THREE.MathUtils.degToRad(90 * i));
        this.outlineEdges.add(edge0, edge1);
      }
    });

    const crossX4 = this.getIntersect(1, sens2[2].p + sens2[2].q, - 1,   (sens2[3].p + sens2[3].q)).x;
    const crossX5 = this.getIntersect(1, sens2[2].p + sens2[2].q, - 1, - (sens2[3].p + sens2[3].q)).x;
    const sen2Params2 = [
      {f: this.circle(ens[0].a, ens[0].b, ens[0].r, 45 + THREE.MathUtils.radToDeg(Math.asin(35 / ens[0].r))).x, t: - crossX4},
      {f: - crossX5, t: this.circle(ens[3].a, ens[3].b, ens[3].r, 225 - THREE.MathUtils.radToDeg(Math.asin(35 / ens[3].r))).x},
    ];
    sen2Params2.forEach((param) => {
      const lineGeo = this.outlineLineGeoGen(1, 1, - (sens2[2].p + sens2[2].q), param.f , param.t , this.divCount);
      const edgeGeoArr = this.outlineEdgeGeoGen(1, 1, - (sens2[2].p + sens2[2].q), param.f, param.t);
      for (var i = 0;i <= 1;i ++) {
        const w = 6;
        for (var g = - w;g <= w;g ++) {
          const line = this.outlineLineMeshGen(lineGeo, 1, 1, g, 0, THREE.MathUtils.degToRad(180 * (i + 1)), THREE.MathUtils.degToRad(90 * i));
          this.outlines.add(line);
        }
        const edge0 = this.outlineEdgeMeshGen(edgeGeoArr[0], 0, THREE.MathUtils.degToRad(180 * (i + 1)), THREE.MathUtils.degToRad(90 * i));
        const edge1 = this.outlineEdgeMeshGen(edgeGeoArr[1], 0, THREE.MathUtils.degToRad(180 * (i + 1)), THREE.MathUtils.degToRad(90 * i));
        this.outlineEdges.add(edge0, edge1);
      }
    });

    const crossX6 = this.getIntersect(1, sens2[1].p + sens2[1].q, - 1, (sens2[3].p + sens2[3].q)).x;
    const crossX7 = this.getIntersect(1, sens2[2].p + sens2[2].q, - 1, (sens2[3].p + sens2[3].q)).x;
    const sen3Params2 = [
      {f: - crossX0, t: 94},
      {f: 130, t: 194},
      {f: 230, t: 294},
      {f: 330, t: - crossX6},
      {f: - crossX7, t: - sens2[3].p},
    ];
    sen3Params2.forEach((param) => {
      const lineGeo = this.outlineLineGeoGen(- 1, 1, - (sens2[3].p + sens2[3].q), param.f , param.t , this.divCount);
      const edgeGeoArr = this.outlineEdgeGeoGen(- 1, 1, - (sens2[3].p + sens2[3].q), param.f, param.t);
      for (var i = 0;i <= 1;i ++) {
        const w = 6;
        for (var g = - w;g <= w;g ++) {
          const line = this.outlineLineMeshGen(lineGeo, - 1, 1, g, 0, THREE.MathUtils.degToRad(180 * (i + 1)), THREE.MathUtils.degToRad(90 * i));
          this.outlines.add(line);
        }
        const edge0 = this.outlineEdgeMeshGen(edgeGeoArr[0], 0, THREE.MathUtils.degToRad(180 * (i + 1)), THREE.MathUtils.degToRad(90 * i));
        const edge1 = this.outlineEdgeMeshGen(edgeGeoArr[1], 0, THREE.MathUtils.degToRad(180 * (i + 1)), THREE.MathUtils.degToRad(90 * i));
        this.outlineEdges.add(edge0, edge1);
      }
    });

    const sen4Params2 = [
      {f: - crossX1, t: - 646},
      {f: - 610, t: - 546},
      {f: - 510, t: - 446},
      {f: - 410, t: sens2[3].p},
    ];
    sen4Params2.forEach((param) => {
      const lineGeo = this.outlineLineGeoGen(- 1, 1, - (sens2[4].p + sens2[4].q), param.f , param.t , this.divCount);
      const edgeGeoArr = this.outlineEdgeGeoGen(- 1, 1, - (sens2[4].p + sens2[4].q), param.f, param.t);
      for (var i = 0;i <= 1;i ++) {
        const w = 6;
        for (var g = - w;g <= w;g ++) {
          const line = this.outlineLineMeshGen(lineGeo, - 1, 1, g, 0, THREE.MathUtils.degToRad(180 * (i + 1)), THREE.MathUtils.degToRad(90 * i));
          this.outlines.add(line);
        }
        const edge0 = this.outlineEdgeMeshGen(edgeGeoArr[0], 0, THREE.MathUtils.degToRad(180 * (i + 1)), THREE.MathUtils.degToRad(90 * i));
        const edge1 = this.outlineEdgeMeshGen(edgeGeoArr[1], 0, THREE.MathUtils.degToRad(180 * (i + 1)), THREE.MathUtils.degToRad(90 * i));
        this.outlineEdges.add(edge0, edge1);
      }
    });

    // 輪郭円の描画
    const en0Params2 = [
      {f: 45, t: 45 + THREE.MathUtils.radToDeg(Math.asin(35 / ens[0].r))},
      {f: 45 + THREE.MathUtils.radToDeg(Math.asin(71 / ens[0].r)), t: 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - 330) / ens[0].r))},
      {f: 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - 294) / ens[0].r)), t: 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - 230) / ens[0].r))},
      {f: 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - 194) / ens[0].r)), t: 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - 130) / ens[0].r))},
    ];
    en0Params2.forEach((param) => {
      const circleGeo = this.outlineCircleGeoGen(ens[0].a, ens[0].b, ens[0].r, param.f, param.t, this.divCount);
      for (var i = 0;i <= 1;i ++) {
        const w = 6;
        for (var g = - w;g <= w;g ++) {
          const circle = this.outlineCircleMeshGen(circleGeo, ens[0].a, ens[0].b, ens[0].r, g, 0, THREE.MathUtils.degToRad(180 * (i + 1)), THREE.MathUtils.degToRad(90 * i));
          this.outlines.add(circle);
        }
      }
    });

    const en1Params2 = [
      {f: 135, t: 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[1].r))},
    ];
    en1Params2.forEach((param) => {
      const circleGeo = this.outlineCircleGeoGen(ens[1].a, ens[1].b, ens[1].r, param.f, param.t, this.divCount);
      for (var i = 0;i <= 1;i ++) {
        const w = 6;
        for (var g = - w;g <= w;g ++) {
          const circle = this.outlineCircleMeshGen(circleGeo, ens[1].a, ens[1].b, ens[1].r, g, 0, THREE.MathUtils.degToRad(180 * (i + 1)), THREE.MathUtils.degToRad(90 * i));
          this.outlines.add(circle);
        }
      }
    });

    const en2Params2 = [
      {f: 150, t: 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[2].r))},
    ];
    en2Params2.forEach((param) => {
      const circleGeo = this.outlineCircleGeoGen(ens[2].a, ens[2].b, ens[2].r, param.f, param.t, this.divCount);
      for (var i = 0;i <= 1;i ++) {
        const w = 6;
        for (var g = - w;g <= w;g ++) {
          const circle = this.outlineCircleMeshGen(circleGeo, ens[2].a, ens[2].b, ens[2].r, g, 0, THREE.MathUtils.degToRad(180 * (i + 1)), THREE.MathUtils.degToRad(90 * i));
          this.outlines.add(circle);
        }
      }
    });

    const en3Params2 = [
      {f: 225 - THREE.MathUtils.radToDeg(Math.asin(35 / ens[3].r)), t: 225},
      {f: 150, t: 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[3].r))},
    ];
    en3Params2.forEach((param) => {
      const circleGeo = this.outlineCircleGeoGen(ens[3].a, ens[3].b, ens[3].r, param.f, param.t, this.divCount);
      for (var i = 0;i <= 1;i ++) {
        const w = 6;
        for (var g = - w;g <= w;g ++) {
          const circle = this.outlineCircleMeshGen(circleGeo, ens[3].a, ens[3].b, ens[3].r, g, 0, THREE.MathUtils.degToRad(180 * (i + 1)), THREE.MathUtils.degToRad(90 * i));
          this.outlines.add(circle);
        }
      }
    });

    const en4Params2 = [
      {f: 166, t: 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[4].r))},
    ];
    en4Params2.forEach((param) => {
      const circleGeo = this.outlineCircleGeoGen(ens[4].a, ens[4].b, ens[4].r, param.f, param.t, this.divCount);
      for (var i = 0;i <= 1;i ++) {
        const w = 6;
        for (var g = - w;g <= w;g ++) {
          const circle = this.outlineCircleMeshGen(circleGeo, ens[4].a, ens[4].b, ens[4].r, g, 0, THREE.MathUtils.degToRad(180 * (i + 1)), THREE.MathUtils.degToRad(90 * i));
          this.outlines.add(circle);
        }
      }
    });

    const en5Params2 = [
      {f: 166, t: 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[5].r))},
    ];
    en5Params2.forEach((param) => {
      const circleGeo = this.outlineCircleGeoGen(ens[5].a, ens[5].b, ens[5].r, param.f, param.t, this.divCount);
      for (var i = 0;i <= 1;i ++) {
        const w = 6;
        for (var g = - w;g <= w;g ++) {
          const circle = this.outlineCircleMeshGen(circleGeo, ens[5].a, ens[5].b, ens[5].r, g, 0, THREE.MathUtils.degToRad(180 * (i + 1)), THREE.MathUtils.degToRad(90 * i));
          this.outlines.add(circle);
        }
      }
    });

    // 羽の模様線の描画
    var index = 0;
    stripes2.forEach((sen) => {
      var f;
      if (index <= 5) {
        f = this.straight(- 1, 1, - (sens2[3].p + sens2[3].q), sen, undefined).y;
      } else {
        f = this.straight(1, 1, - (sens2[1].p + sens2[1].q), sen, undefined).y;
      }
      var t;
      if (index <= 1) {
        t = this.straight( 1, 1, - (sens2[0].p + sens2[0].q), sen, undefined).y;
      } else if (index > 1 && index <= 5) {
        t = this.circle(ens[0].a, ens[0].b, ens[0].r, 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - sen) / ens[0].r))).y;
      } else {
        t = this.straight(- 1, 1,   (sens2[3].p + sens2[3].q), sen, undefined).y;
      }

      const lineGeo = this.outlineLineGeoGen(1, 0, - sen, f, t, this.divCount);
      const edgeGeoArr = this.outlineEdgeGeoGen(1, 0, - sen, f, t,);
      for (var i = 0;i <= 1;i ++) {
        const w = 6;
        for (var g = - w;g <= w;g ++) {
          const line = this.outlineLineMeshGen(lineGeo, 1, 0, g, 0, THREE.MathUtils.degToRad(180 * (i + 1)), THREE.MathUtils.degToRad(90 * i));
          this.outlines.add(line);
        }
        const edge0 = this.outlineEdgeMeshGen(edgeGeoArr[0], 0, THREE.MathUtils.degToRad(180 * (i + 1)), THREE.MathUtils.degToRad(90 * i));
        const edge1 = this.outlineEdgeMeshGen(edgeGeoArr[1], 0, THREE.MathUtils.degToRad(180 * (i + 1)), THREE.MathUtils.degToRad(90 * i));
        this.outlineEdges.add(edge0, edge1);
      }
      index ++;
    });

    this.group.add(this.outlines, this.outlineEdges);
  }

  // 塗りつぶし図形を生成
  generateShape = () => {

    // 外円
    const shapes = this.curvePointGen(0, 0, 1600, 0, 360, false);
    const pathes = this.curvePointGen(0, 0, 1300, 0, 360, false);
    const circleGeo = this.shapeGeoGen(shapes, pathes);
    const circleMesh = new THREE.Mesh(circleGeo, this.shapeMat);
    this.shapes.add(circleMesh);

    // 円のパラメータ
    const ens = [
      {a:   516, b:   516, r: 516},
      {a: - 416, b: - 416, r: 516},
      {a: - 466, b: - 466, r: 516},
      {a: - 516, b: - 516, r: 516},
      {a: - 416, b: - 416, r: 550},
      {a: - 466, b: - 466, r: 550},
    ];

    // 輪郭＆中心の線のパラメータ
    const theta = THREE.MathUtils.degToRad(45);
    const sens = [
      {p: - 516 * Math.cos(theta), q: - 516 * Math.sin(theta)},
      {p: -  71 * Math.cos(theta), q: -  71 * Math.sin(theta)},
      {p: -  35 * Math.cos(theta), q: -  35 * Math.sin(theta)},
      {p: - 552 * Math.cos(theta), q: - 552 * Math.sin(theta)},
    ];

    // 羽の模様線のパラメータ
    const stripes = [94, 130, 194, 230, 294, 330, - 646, - 610, - 546, - 510, - 446, - 410];

    // 黒い板
    const params = [
      [- (sens[3].p + sens[3].q),    500],
      [- (sens[3].p + sens[3].q), - 1300],
      [  (sens[3].p + sens[3].q), -  500],
      [  (sens[3].p + sens[3].q),   1300]
    ];
    var points = [];
    params.forEach((param) => {
      const point = this.straight(1, 1, param[0], param[1], undefined);
      points.push(point);
    })
    const bbGeo = this.shapeGeoGen(points);
    const bbMesh = new THREE.Mesh(bbGeo, this.blackBoardMat);
    this.blackBoard.add(bbMesh);
    this.blackBoard.position.z = - 1;
    // this.group.add(this.blackBoard);

    // 羽

    // 中心の棒
    const arc0 = this.curvePointGen(ens[0].a, ens[0].b, ens[0].r, 45, 45 + THREE.MathUtils.radToDeg(Math.asin(35 / ens[0].r)), false);
    const arc1 = this.curvePointGen(ens[3].a, ens[3].b, ens[3].r, 225 - THREE.MathUtils.radToDeg(Math.asin(35 / ens[3].r)), 225, false);
    const points0 = arc0.concat(arc1);
    const geo0 = this.shapeGeoGen(points0);
    for (var i = 0;i <= 3;i ++) {
      const mesh = new THREE.Mesh(geo0, this.shapeMat);
      mesh.rotation.set(0, THREE.MathUtils.degToRad(180 * Math.ceil(i / 2)), THREE.MathUtils.degToRad(90 * Math.trunc(i % 2)));
      mesh.position.z = i <= 1 ? 0 : - 2;
      this.shapes.add(mesh);
    }

    // 羽の部品0
    const arc2 = this.curvePointGen(ens[0].a, ens[0].b, ens[0].r, 45 + THREE.MathUtils.radToDeg(Math.asin(71 / ens[0].r)), 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - 330) / ens[0].r)), false);
    const point1 = this.straight(1, 1, - (sens[1].p + sens[1].q), stripes[5], undefined);
    const points1 = arc2.concat(point1);
    const geo1 = this.shapeGeoGen(points1);
    for (var i = 0;i <= 3;i ++) {
      const mesh = new THREE.Mesh(geo1, this.shapeMat);
      mesh.rotation.set(0, THREE.MathUtils.degToRad(180 * Math.ceil(i / 2)), THREE.MathUtils.degToRad(90 * Math.trunc(i % 2)));
      mesh.position.z = i <= 1 ? 0 : - 2;
      this.shapes.add(mesh);
    }

    // 羽の部品1
    const arc3 = this.curvePointGen(ens[0].a, ens[0].b, ens[0].r, 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - stripes[4]) / ens[0].r)), 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - stripes[3]) / ens[0].r)), false);
    const point2 = this.straight(1, 1, - (sens[1].p + sens[1].q), stripes[3], undefined);
    const point3 = this.straight(1, 1, - (sens[1].p + sens[1].q), stripes[4], undefined);
    const points2 = arc3.concat(point2, point3);
    const geo2 = this.shapeGeoGen(points2);
    for (var i = 0;i <= 3;i ++) {
      const mesh = new THREE.Mesh(geo2, this.shapeMat);
      mesh.rotation.set(0, THREE.MathUtils.degToRad(180 * Math.ceil(i / 2)), THREE.MathUtils.degToRad(90 * Math.trunc(i % 2)));
      mesh.position.z = i <= 1 ? 0 : - 2;
      this.shapes.add(mesh);
    }

    // 羽の部品2
    const arc4 = this.curvePointGen(ens[0].a, ens[0].b, ens[0].r, 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - stripes[2]) / ens[0].r)), 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - stripes[1]) / ens[0].r)), false);
    const point4 = this.straight(1, 1, - (sens[1].p + sens[1].q), stripes[1], undefined);
    const point5 = this.straight(1, 1, - (sens[1].p + sens[1].q), stripes[2], undefined);
    const points3 = arc4.concat(point4, point5);
    const geo3 = this.shapeGeoGen(points3);
    for (var i = 0;i <= 3;i ++) {
      const mesh = new THREE.Mesh(geo3, this.shapeMat);
      mesh.rotation.set(0, THREE.MathUtils.degToRad(180 * Math.ceil(i / 2)), THREE.MathUtils.degToRad(90 * Math.trunc(i % 2)));
      mesh.position.z = i <= 1 ? 0 : - 2;
      this.shapes.add(mesh);
    }

    // 羽の部品3
    const point6 = this.straight(1, 1, - (sens[0].p + sens[0].q), stripes[0], undefined);
    const point7 = this.straight(1, 1, - (sens[0].p + sens[0].q), stripes[11], undefined);
    const point8 = this.straight(1, 1, - (sens[1].p + sens[1].q), stripes[11], undefined);
    const point9 = this.straight(1, 1, - (sens[1].p + sens[1].q), stripes[0], undefined);
    const points4 = [point6, point7, point8, point9];
    const geo4 = this.shapeGeoGen(points4);
    for (var i = 0;i <= 3;i ++) {
      const mesh = new THREE.Mesh(geo4, this.shapeMat);
      mesh.rotation.set(0, THREE.MathUtils.degToRad(180 * Math.ceil(i / 2)), THREE.MathUtils.degToRad(90 * Math.trunc(i % 2)));
      mesh.position.z = i <= 1 ? 0 : - 2;
      this.shapes.add(mesh);
    }

    // 羽の部品4
    const point10 = this.straight(1, 1, - (sens[0].p + sens[0].q), stripes[10], undefined);
    const point11 = this.straight(1, 1, - (sens[0].p + sens[0].q), stripes[9], undefined);
    const point12 = this.straight(1, 1, - (sens[1].p + sens[1].q), stripes[9], undefined);
    const point13 = this.straight(1, 1, - (sens[1].p + sens[1].q), stripes[10], undefined);
    const points5 = [point10, point11, point12, point13];
    const geo5 = this.shapeGeoGen(points5);
    for (var i = 0;i <= 3;i ++) {
      const mesh = new THREE.Mesh(geo5, this.shapeMat);
      mesh.rotation.set(0, THREE.MathUtils.degToRad(180 * Math.ceil(i / 2)), THREE.MathUtils.degToRad(90 * Math.trunc(i % 2)));
      mesh.position.z = i <= 1 ? 0 : - 2;
      this.shapes.add(mesh);
    }

    // 羽の部品5
    const point14 = this.straight(1, 1, - (sens[0].p + sens[0].q), stripes[8], undefined);
    const point15 = this.straight(1, 1, - (sens[0].p + sens[0].q), stripes[7], undefined);
    const point16 = this.straight(1, 1, - (sens[1].p + sens[1].q), stripes[7], undefined);
    const point17 = this.straight(1, 1, - (sens[1].p + sens[1].q), stripes[8], undefined);
    const points6 = [point14, point15, point16, point17];
    const geo6 = this.shapeGeoGen(points6);
    for (var i = 0;i <= 3;i ++) {
      const mesh = new THREE.Mesh(geo6, this.shapeMat);
      mesh.rotation.set(0, THREE.MathUtils.degToRad(180 * Math.ceil(i / 2)), THREE.MathUtils.degToRad(90 * Math.trunc(i % 2)));
      mesh.position.z = i <= 1 ? 0 : - 2;
      this.shapes.add(mesh);
    }

    // 羽の部品6
    const arc5 = this.curvePointGen(ens[1].a, ens[1].b, ens[1].r, 135, 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[1].r)), false);
    const point18 = this.straight(1, 1, - (sens[1].p + sens[1].q), stripes[6], undefined);
    const point19 = this.straight(1, 1, - (sens[0].p + sens[0].q), stripes[6], undefined);
    const points7 = arc5.concat(point18, point19);
    const geo7 = this.shapeGeoGen(points7);
    for (var i = 0;i <= 3;i ++) {
      const mesh = new THREE.Mesh(geo7, this.shapeMat);
      mesh.rotation.set(0, THREE.MathUtils.degToRad(180 * Math.ceil(i / 2)), THREE.MathUtils.degToRad(90 * Math.trunc(i % 2)));
      mesh.position.z = i <= 1 ? 0 : - 2;
      this.shapes.add(mesh);
    }

    // 羽の部品7
    const arc6 = this.curvePointGen(ens[2].a, ens[2].b, ens[2].r, 155, 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[2].r)), false);
    const arc7 = this.curvePointGen(ens[4].a, ens[4].b, ens[4].r, 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[4].r)), 166, true);
    const points8 = arc6.concat(arc7);
    const geo8 = this.shapeGeoGen(points8);
    for (var i = 0;i <= 3;i ++) {
      const mesh = new THREE.Mesh(geo8, this.shapeMat);
      mesh.rotation.set(0, THREE.MathUtils.degToRad(180 * Math.ceil(i / 2)), THREE.MathUtils.degToRad(90 * Math.trunc(i % 2)));
      mesh.position.z = i <= 1 ? 0 : - 2;
      this.shapes.add(mesh);
    }

    // 羽の部品8
    const arc8 = this.curvePointGen(ens[3].a, ens[3].b, ens[3].r, 155, 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[3].r)), false);
    const arc9 = this.curvePointGen(ens[5].a, ens[5].b, ens[5].r, 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[5].r)), 166, true);
    const points9 = arc8.concat(arc9);
    const geo9 = this.shapeGeoGen(points9);
    for (var i = 0;i <= 3;i ++) {
      const mesh = new THREE.Mesh(geo9, this.shapeMat);
      mesh.rotation.set(0, THREE.MathUtils.degToRad(180 * Math.ceil(i / 2)), THREE.MathUtils.degToRad(90 * Math.trunc(i % 2)));
      mesh.position.z = i <= 1 ? 0 : - 2;
      this.shapes.add(mesh);
    }

    this.group.add(this.shapes);
  }


}
