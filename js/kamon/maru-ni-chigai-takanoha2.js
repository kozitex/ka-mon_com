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

    const w = 4;

    // 中心円
    this.circle1 = {a: 0, b: 0, r: 1600};
    this.circle2 = {a: 0, b: 0, r: 1300};

    // 羽の輪郭円
    this.wingR = 530;
    this.circle3 = {a:   this.wingR      , b:   this.wingR      , r: this.wingR};
    this.circle4 = {a: - this.wingR      , b: - this.wingR      , r: this.wingR};
    this.circle5 = {a: - this.wingR +  50, b: - this.wingR +  50, r: this.wingR};
    this.circle6 = {a: - this.wingR + 100, b: - this.wingR + 100, r: this.wingR};

    this.inCircle1 = {a: this.circle3.a, b: this.circle3.b, r: this.circle3.r - w};
    this.inCircle2 = {a: this.circle4.a, b: this.circle4.b, r: this.circle4.r - w};
    this.inCircle3 = {a: this.circle5.a, b: this.circle5.b, r: this.circle5.r - w};
    this.inCircle4 = {a: this.circle6.a, b: this.circle6.b, r: this.circle6.r - w};

    this.outCircle1 = {a: this.circle3.a, b: this.circle3.b, r: this.circle3.r + w};
    this.outCircle2 = {a: this.circle4.a, b: this.circle4.b, r: this.circle4.r + w};
    this.outCircle3 = {a: this.circle5.a, b: this.circle5.b, r: this.circle5.r + w};
    this.outCircle4 = {a: this.circle6.a, b: this.circle6.b, r: this.circle6.r + w};

    // 対角線１
    const radApex1 = this.circleShort(this.circle1,  45);
    const radApex2 = this.circleShort(this.circle1, 225);
    this.radiation1 = [radApex1, radApex2];

    // 対角線２
    const radTheta = THREE.MathUtils.radToDeg(Math.asin(40 / this.wingR));
    const radApex3 = this.circleShort(this.circle3,  45 - radTheta);
    const radApex4 = this.circleShort(this.circle4, 225 + radTheta);
    const radApex5 = this.circleShort(this.circle3,  45 + radTheta);
    const radApex6 = this.circleShort(this.circle4, 225 - radTheta);
    this.radiation2 = [radApex3, radApex4];
    this.radiation3 = [radApex5, radApex6];

    // 対角線２（内側）
    const inRadTheta = THREE.MathUtils.radToDeg(Math.asin((40 - w) / (this.wingR - w)));
    const inRadApex3 = this.circleShort(this.inCircle1,  45 - inRadTheta);
    const inRadApex4 = this.circleShort(this.inCircle4, 225 + inRadTheta);
    const inRadApex5 = this.circleShort(this.inCircle1,  45 + inRadTheta);
    const inRadApex6 = this.circleShort(this.inCircle4, 225 - inRadTheta);
    this.inRadiation2 = [inRadApex3, inRadApex4];
    this.inRadiation3 = [inRadApex6, inRadApex5];

    // 対角線２（外側）
    const outRadTheta = THREE.MathUtils.radToDeg(Math.asin((40 + w) / (this.wingR + w)));
    const outRadApex3 = this.circleShort(this.outCircle1,  45 - outRadTheta);
    const outRadApex4 = this.circleShort(this.outCircle4, 225 + outRadTheta);
    const outRadApex5 = this.circleShort(this.outCircle1,  45 + outRadTheta);
    const outRadApex6 = this.circleShort(this.outCircle4, 225 - outRadTheta);
    this.outRadiation2 = [outRadApex3, outRadApex4];
    this.outRadiation3 = [outRadApex5, outRadApex6];

    // 羽の輪郭線
    const conApex1 = this.circleShort(this.circle3, - 45);
    const conApex2 = this.circleShort(this.circle4, - 45);
    const conApex3 = this.circleShort(this.circle3,  135);
    const conApex4 = this.circleShort(this.circle4,  135);
    this.contour1 = [conApex1, conApex2];
    this.contour2 = [conApex3, conApex4];

    // 羽の輪郭線（内側）
    const inConApex1 = this.circleShort(this.inCircle1, - 45);
    const inConApex2 = this.circleShort(this.inCircle2, - 45);
    const inConApex3 = this.circleShort(this.inCircle1,  135);
    const inConApex4 = this.circleShort(this.inCircle2,  135);
    this.inContour1 = [inConApex1, inConApex2];
    this.inContour2 = [inConApex3, inConApex4];

    // 羽の輪郭線（外側）
    const outConApex1 = this.circleShort(this.outCircle1, - 45);
    const outConApex2 = this.circleShort(this.outCircle2, - 45);
    const outConApex3 = this.circleShort(this.outCircle1,  135);
    const outConApex4 = this.circleShort(this.outCircle2,  135);
    this.outContour1 = [outConApex1, outConApex2];
    this.outContour2 = [outConApex3, outConApex4];

    // 回転後の輪郭線
    const conApex1d = this.rotateCoordinate(conApex1, 90);
    const conApex2d = this.rotateCoordinate(conApex2, 90);
    const conApex3d = this.rotateCoordinate(conApex3, 90);
    const conApex4d = this.rotateCoordinate(conApex4, 90);
    this.contour1d = [conApex1d, conApex2d];
    this.contour2d = [conApex3d, conApex4d];

    // 回転後の輪郭線（外側）
    const outConApex1d = this.rotateCoordinate(outConApex1, 90);
    const outConApex2d = this.rotateCoordinate(outConApex2, 90);
    const outConApex3d = this.rotateCoordinate(outConApex3, 90);
    const outConApex4d = this.rotateCoordinate(outConApex4, 90);
    this.outContour1d = [outConApex1d, outConApex2d];
    this.outContour2d = [outConApex3d, outConApex4d];

    // 対角線と輪郭線の交差
    const interApex1 = this.getIntersect3(this.radiation2, this.contour1d);
    const interApex2 = this.getIntersect3(this.radiation2, this.contour2d);
    const interApex3 = this.getIntersect3(this.radiation3, this.contour1d);
    const interApex4 = this.getIntersect3(this.radiation3, this.contour2d);
    this.radiation4 = [radApex3, interApex1];
    this.radiation5 = [interApex2, radApex4];
    this.radiation6 = [radApex5, interApex3];
    this.radiation7 = [interApex4, radApex6];

    // 輪郭線同士の交差
    const interApex5 = this.getIntersect3(this.contour1, this.contour1d);
    const interApex6 = this.getIntersect3(this.contour1, this.contour2d);
    const interApex7 = this.getIntersect3(this.contour2, this.contour1d);
    const interApex8 = this.getIntersect3(this.contour2, this.contour2d);
    this.contour3 = [conApex1, interApex5];
    this.contour4 = [interApex6, conApex2];
    this.contour5 = [conApex3, interApex7];
    this.contour6 = [interApex8, conApex4];

    // 羽の模様
    this.decorations1 = [];
    this.decorations2 = [];

    for (var i = 0;i <= 3;i ++) {
      for (var j = 0;j <= 2;j ++) {

        // 交点の算出用の座標パラメータ
        const val = i <= 1 ? 110 + 100 * j : - 630 + 100 * j;
        const x1 = i % 2 == 0 ?    0 : val, y1 = i % 2 == 0 ? val :    0;
        const x2 = i % 2 == 0 ? 1600 : val, y2 = i % 2 == 0 ? val : 1600;
        const line = [new THREE.Vector3(x1, y1, 0), new THREE.Vector3(x2, y2, 0)];

        // 対角線や輪郭との交点を算出
        const radiation = i % 2 == 0 ? this.radiation2 : this.radiation3;
        const apexF = this.getIntersect3(radiation, line);
        var apexT;
        const n = i * 3 + j;
        if (n == 0) {
          const contour = i % 2 == 0 ? this.contour1 : this.contour2;
          apexT = this.getIntersect3(contour, line);
        } else if (i <= 1) {
          const apexTd = this.interLineCircle3(this.circle3, line);
          apexT = i % 2 == 0
            ? apexTd[0].x > apexTd[1].x ? apexTd[0] : apexTd[1]
            : apexTd[0].y > apexTd[1].y ? apexTd[0] : apexTd[1];
        } else {
          const contour = i % 2 == 0 ? this.contour1 : this.contour2;
          apexT = this.getIntersect3(contour, line);
        }
        this.decorations1.push([apexF, apexT]);

        // 対角線や輪郭との交点を算出（回転用）
        const inter1 = i <= 1 ? this.contour1d : i == 2 ? this.radiation2 : this.radiation3;
        const apexF2 = this.getIntersect3(inter1, line);
        var apexT2 = i <= 1 ? apexT : this.getIntersect3(this.contour2d, line);
        this.decorations2.push([apexF2, apexT2]);

      }
    }

    // 羽の模様（内側・上ズレ）
    this.innerDeco1 = [];
    this.innerDeco2 = [];

    for (var i = 0;i <= 3;i ++) {
      for (var j = 0;j <= 2;j ++) {

        // 交点の算出用の座標パラメータ
        const val = i <= 1 ? 110 + w + 100 * j : - 630 + w + 100 * j;
        const x1 = i % 2 == 0 ?    0 : val, y1 = i % 2 == 0 ? val :    0;
        const x2 = i % 2 == 0 ? 1600 : val, y2 = i % 2 == 0 ? val : 1600;
        const line = [new THREE.Vector3(x1, y1, 0), new THREE.Vector3(x2, y2, 0)];

        // 対角線や輪郭との交点を算出
        const radiation = i % 2 == 0 ? this.outRadiation2 : this.outRadiation3;
        const apexF = this.getIntersect3(radiation, line);
        var apexT;
        const n = i * 3 + j;
        if (n == 0) {
          const contour = i % 2 == 0 ? this.inContour1 : this.inContour2;
          apexT = this.getIntersect3(contour, line);
        } else if (i <= 1) {
          const apexTd = this.interLineCircle3(this.inCircle1, line);
          apexT = i % 2 == 0
            ? apexTd[0].x > apexTd[1].x ? apexTd[0] : apexTd[1]
            : apexTd[0].y > apexTd[1].y ? apexTd[0] : apexTd[1];
        } else {
          const contour = i % 2 == 0 ? this.inContour1 : this.inContour2;
          apexT = this.getIntersect3(contour, line);
        }
        this.innerDeco1.push([apexF, apexT]);

        // 対角線や輪郭との交点を算出（回転用）
        const inter1 = i <= 1 ? this.outContour1d : i == 2 ? this.radiation2 : this.radiation3;
        const apexF2 = this.getIntersect3(inter1, line);
        var apexT2 = i <= 1 ? apexT : this.getIntersect3(this.outContour2d, line);
        this.innerDeco2.push([apexF2, apexT2]);

      }
    }

    // 羽の模様（内側・下ズレ）
    this.innerDeco3 = [];
    this.innerDeco4 = [];

    for (var i = 0;i <= 3;i ++) {
      for (var j = 0;j <= 2;j ++) {

        // 交点の算出用の座標パラメータ
        const val = i <= 1 ? 110 - w + 100 * j : - 630 - w + 100 * j;
        const x1 = i % 2 == 0 ?    0 : val, y1 = i % 2 == 0 ? val :    0;
        const x2 = i % 2 == 0 ? 1600 : val, y2 = i % 2 == 0 ? val : 1600;
        const line = [new THREE.Vector3(x1, y1, 0), new THREE.Vector3(x2, y2, 0)];

        // 対角線や輪郭との交点を算出
        const radiation = i % 2 == 0 ? this.outRadiation2 : this.outRadiation3;
        const apexF = this.getIntersect3(radiation, line);
        var apexT;
        const n = i * 3 + j;
        if (n == 0) {
          const contour = i % 2 == 0 ? this.inContour1 : this.inContour2;
          apexT = this.getIntersect3(contour, line);
        } else if (i <= 1) {
          const apexTd = this.interLineCircle3(this.inCircle1, line);
          apexT = i % 2 == 0
            ? apexTd[0].x > apexTd[1].x ? apexTd[0] : apexTd[1]
            : apexTd[0].y > apexTd[1].y ? apexTd[0] : apexTd[1];
        } else {
          const contour = i % 2 == 0 ? this.inContour1 : this.inContour2;
          apexT = this.getIntersect3(contour, line);
        }
        this.innerDeco3.push([apexF, apexT]);

        // 対角線や輪郭との交点を算出（回転用）
        const inter1 = i <= 1 ? this.outContour1d : i == 2 ? this.radiation2 : this.radiation3;
        const apexF2 = this.getIntersect3(inter1, line);
        var apexT2 = i <= 1 ? apexT : this.getIntersect3(this.outContour2d, line);
        this.innerDeco4.push([apexF2, apexT2]);

      }
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
    var shadows = new THREE.Group();

    // 中心円
    const circles1 = [this.circle1, this.circle2];
    for (var i = 0;i <= circles1.length - 1;i ++) {
      const circle = circles1[i];
      const points = this.circlePointGen2(circle,[90, 450], this.divCount);
      const mesh = this.guidelineGen(points);
      this.guidelines.add(mesh);
    }

    // 羽の輪郭円
    var pointsSum1 = [];
    const circles2 = [this.circle3, this.circle4, this.circle5, this.circle6];
    for (var i = 0;i <= circles2.length - 1;i ++) {
      const circle = circles2[i];
      const points = this.circlePointGen2(circle,[90, 450], this.divCount);
      pointsSum1.push(points);
    }

    // 羽の輪郭線
    var pointsSum2 = [];
    const contours = [this.contour1, this.contour2];
    for (var i = 0;i <= contours.length - 1;i ++) {
      const contour = contours[i];
      const points = this.linePointGen2(contour[0], contour[1], 0, this.divCount);
      pointsSum2.push(points);
    }

    // 対角線１
    const radPoints = this.linePointGen2(this.radiation1[0], this.radiation1[1], 0, this.divCount);
    const radMesh = this.sublineGen(radPoints);
    this.guidelines.add(radMesh);

    // 対角線２
    var pointsSum3 = [];
    const radiations = [this.radiation2, this.radiation3];
    for (var i = 0;i <= radiations.length - 1;i ++) {
      const rad = radiations[i];
      const points = this.linePointGen2(rad[0], rad[1], 0, this.divCount);
      pointsSum3.push(points);
    }

    // 羽の模様
    var pointsSum4 = [];
    for (var i = 0;i <= this.decorations1.length - 1;i ++) {
      const deco = this.decorations1[i];
      const points = this.linePointGen3(deco[0], deco[1], 0, this.divCount);
      pointsSum4.push(points);
    }
 
    for (var i = 0;i <= 1;i ++) {
      const pointsSums = [pointsSum1, pointsSum2, pointsSum3, pointsSum4];
      pointsSums.forEach((pointsSum) => {
        const mat = i == 0 ? this.guideMat : this.subMat;
        pointsSum.forEach((points) => {
          const geo = new THREE.BufferGeometry().setFromPoints(points);
          const mesh = new THREE.Line(geo, mat);
          mesh.rotation.z = THREE.MathUtils.degToRad(90 * i);
          mesh.position.z = - 1 * i;
          i == 0 ? this.guidelines.add(mesh) : shadows.add(mesh);
        })
      })
    }
    this.guidelines.add(shadows);

    this.group.add(this.guidelines);
  }

  // アウトラインを作成
  generateOutline = () => {

    const w = 4;

    // 中心円
    const circles1 = [this.circle1, this.circle2];
    circles1.forEach((circle) => {
      const circle1 = {a: circle.a, b: circle.b, r: circle.r + w};
      const circle2 = {a: circle.a, b: circle.b, r: circle.r - w};
      const shape = this.curvePointGen2(circle1, [0, 360]);
      const path  = this.curvePointGen2(circle2, [0, 360]);
      const geo = this.shapeGeoGen(shape, path);
      const mesh = new THREE.Mesh(geo, this.outlineMat);
      this.outlines.add(mesh);
    });

    // 対角線
    const radGroup = [
      [this.radiation2, this.radiation3],
      [this.radiation4, this.radiation5, this.radiation6,this.radiation7],
    ];
    for (var i = 0;i <= radGroup.length - 1;i ++) {
      const radiations = radGroup[i];
      radiations.forEach((radiation) => {
        const geo = this.outlineGeoGen(radiation[0], radiation[1]);
        const mesh = new THREE.Mesh(geo, this.outlineMat);
        mesh.rotation.z = THREE.MathUtils.degToRad(90 * i);
        this.outlines.add(mesh);
      })
    }

    // 羽の輪郭円
    const circles2 = [this.circle3, this.circle4, this.circle5, this.circle6];
    const angles = [
      [- 45, 135], [135, 315], [135, 315], [135, 315]
    ]
    for (var i = 0;i <= circles2.length - 1;i ++) {
      const circle = circles2[i];
      const angle = angles[i];
      const arc1 = {a: circle.a, b: circle.b, r: circle.r + w};
      const arc2 = {a: circle.a, b: circle.b, r: circle.r - w};
      const point1 = this.curvePointGen2(arc1, [angle[0], angle[1]]);
      const point2 = this.curvePointGen2(arc2, [angle[1], angle[0]]);
      const points = point2.concat(point1);
      const geo = this.shapeGeoGen(points);
      for (var j = 0;j <= 1;j ++) {
        const mesh = new THREE.Mesh(geo, this.outlineMat);
        mesh.rotation.z = THREE.MathUtils.degToRad(90 * j);
        this.outlines.add(mesh);
      }
    }

    // 羽の輪郭線
    const contoursGroup = [
      [this.contour1, this.contour2],
      [this.contour3, this.contour4, this.contour5,this.contour6],
    ];
    for (var i = 0;i <= contoursGroup.length - 1;i ++) {
      const contours = contoursGroup[i];
      contours.forEach((radiation) => {
        const geo = this.outlineGeoGen(radiation[0], radiation[1]);
        const mesh = new THREE.Mesh(geo, this.outlineMat);
        mesh.rotation.z = THREE.MathUtils.degToRad(90 * i);
        this.outlines.add(mesh);
      })
    }

    // 羽の模様
    const decoGroup = [this.decorations1, this.decorations2];
    for (var i = 0;i <= decoGroup.length - 1;i ++) {
      const decorations = decoGroup[i];
      decorations.forEach((decoration) => {
        const geo = this.outlineGeoGen(decoration[0], decoration[1]);
        const mesh = new THREE.Mesh(geo, this.outlineMat);
        mesh.rotation.z = THREE.MathUtils.degToRad(90 * i);
        this.outlines.add(mesh);
      })
    }

    this.group.add(this.outlines);
  }

  // 塗りつぶし図形を生成
  generateShape = () => {

    const w = 4;

    // 中心円
    const outers = [this.circle1, this.circle2];
    for (var i = 0;i <= 0;i ++) {
      const shape = this.curvePointGen2(outers[0], [0, 360]);
      const path  = this.curvePointGen2(outers[1], [0, 360]);
      const geo   = this.shapeGeoGen(shape, path);
      const mesh  = new THREE.Mesh(geo, this.shapeMat);
      this.shapes.add(mesh);
    }

    // 対角線
    const radTheta = THREE.MathUtils.radToDeg(Math.asin((40 - w) / this.inCircle1.r));

    const radArc1 = this.curvePointGen3(this.inCircle1,  [ 45 + radTheta,  45 - radTheta], true);
    const radArc2 = this.curvePointGen3(this.inCircle4,  [225 + radTheta, 225 - radTheta], true);
    const radArc3 = this.curvePointGen3(this.outCircle4, [225 - radTheta, 225 + radTheta], false);
    const radArc4 = this.curvePointGen3(this.inCircle3,  [225 + radTheta, 225 - radTheta], true);
    const radArc5 = this.curvePointGen3(this.outCircle3, [225 - radTheta, 225 + radTheta], false);
    const radArc6 = this.curvePointGen3(this.inCircle2,  [225 + radTheta, 225 - radTheta], true);

    // // 羽の輪郭線
    // const conApex1 = this.circleShort(this.outCircle1, - 45);
    // const conApex2 = this.circleShort(this.outCircle2, - 45);
    // const conApex3 = this.circleShort(this.outCircle1,  135);
    // const conApex4 = this.circleShort(this.outCircle2,  135);

    // // 回転後の輪郭線
    // const conApex1d = this.rotateCoordinate(conApex1, 90);
    // const conApex2d = this.rotateCoordinate(conApex2, 90);
    // const conApex3d = this.rotateCoordinate(conApex3, 90);
    // const conApex4d = this.rotateCoordinate(conApex4, 90);

    // const radApex1  = this.circleShort(this.inCircle1,  45 - radTheta);
    // const radApex2  = this.circleShort(this.inCircle4, 225 + radTheta);
    // const radApex3  = this.circleShort(this.inCircle4, 225 - radTheta);
    // const radApex4  = this.circleShort(this.inCircle1,  45 + radTheta);

    const radApex5 = this.getIntersect3(this.inRadiation2, this.outContour1d);
    const radApex6 = this.getIntersect3(this.inRadiation3, this.outContour1d);
    const radApex7 = this.getIntersect3(this.inRadiation2, this.outContour2d);
    const radApex8 = this.getIntersect3(this.inRadiation3, this.outContour2d);

    const radPoints1 = radArc1.concat(radArc2);
    const radPoints2 = radArc3.concat(radArc4);
    const radPoints3 = radArc5.concat(radArc6);
    const radPoints4 = radArc1.concat([radApex5, radApex6]);
    const radPoints5 = radArc2.concat([radApex8, radApex7]);

    const radGeo1 = this.shapeGeoGen(radPoints1);
    const radGeo2 = this.shapeGeoGen(radPoints2);
    const radGeo3 = this.shapeGeoGen(radPoints3);
    const radGeo4 = this.shapeGeoGen(radPoints4);
    const radGeo5 = this.shapeGeoGen(radPoints5);

    const radGeos = [
      [radGeo1, radGeo2, radGeo3],
      [radGeo4, radGeo5, radGeo2, radGeo3],
    ];

    for (var i = 0;i <= radGeos.length - 1;i ++) {
      const geos = radGeos[i];
      geos.forEach((geo) => {
        const mesh = new THREE.Mesh(geo, this.shapeMat);
        mesh.rotation.z = THREE.MathUtils.degToRad(90 * i);
        this.shapes.add(mesh);
      })
    }

    // 羽の輪郭
    const conTheta = THREE.MathUtils.radToDeg(Math.asin((40 + w) / this.inCircle1.r));
    const conAngle1 = this.arcAngle(this.inCircle1, this.innerDeco1[2][1]);
    const conArc1 = this.curvePointGen3(this.inCircle1, [45 - conTheta, conAngle1], true);
    const interApex1 = this.getIntersect3(this.outRadiation2, this.outContour1d);
    const conPoints1 = conArc1.concat(this.innerDeco1[2][0]);
    const conPoints2 = conArc1.concat(this.innerDeco2[2][0], interApex1);
    const conGeo1 = this.shapeGeoGen(conPoints1);
    const conGeo2 = this.shapeGeoGen(conPoints2);

    const conAngle2 = this.arcAngle(this.inCircle1, this.innerDeco3[2][1]);
    const conAngle3 = this.arcAngle(this.inCircle1, this.innerDeco1[1][1]);
    const conArc2 = this.curvePointGen3(this.inCircle1, [conAngle2, conAngle3], true);
    const conPoints3 = conArc2.concat(this.innerDeco1[1][0], this.innerDeco3[2][0]);
    const conPoints4 = conArc2.concat(this.innerDeco2[1][0], this.innerDeco4[2][0]);
    const conGeo3 = this.shapeGeoGen(conPoints3);
    const conGeo4 = this.shapeGeoGen(conPoints4);

    const conAngle4 = this.arcAngle(this.inCircle1, this.innerDeco3[1][1]);
    const conArc3 = this.curvePointGen3(this.inCircle1, [conAngle4, - 45], true);
    const conPoints5 = conArc3.concat(this.innerDeco1[0][1], this.innerDeco1[0][0], this.innerDeco3[1][0]);
    const conPoints6 = conArc3.concat(this.innerDeco2[0][1], this.innerDeco2[0][0], this.innerDeco4[1][0]);
    const conGeo5 = this.shapeGeoGen(conPoints5);
    const conGeo6 = this.shapeGeoGen(conPoints6);

    const interApex2 = this.getIntersect3(this.inContour1, this.outContour1d);
    const conPoints7 = this.innerDeco3[0].concat(this.innerDeco1[8][1], this.innerDeco1[8][0]);
    const conPoints8 = this.innerDeco4[0].concat(interApex2);
    const conGeo7 = this.shapeGeoGen(conPoints7);
    const conGeo8 = this.shapeGeoGen(conPoints8);

    const conGeos = [
      [conGeo1, conGeo3, conGeo5, conGeo7],
      [conGeo1, conGeo3, conGeo5, conGeo7],
      [conGeo2, conGeo4, conGeo6, conGeo8],
      [conGeo2, conGeo4, conGeo6, conGeo8],
    ];

    for (var i = 0;i <= conGeos.length - 1;i ++) {
      const geos = conGeos[i];
      geos.forEach((geo) => {
        const mesh = new THREE.Mesh(geo, this.shapeMat);
        mesh.rotation.y = THREE.MathUtils.degToRad(180 * Math.ceil(i / 2));
        mesh.rotation.z = THREE.MathUtils.degToRad(90 * Math.trunc(i % 2));
        this.shapes.add(mesh);
      })
    }



    // // 外円
    // const shapes = this.curvePointGen(0, 0, 1600, 0, 360, false);
    // const pathes = this.curvePointGen(0, 0, 1300, 0, 360, false);
    // const circleGeo = this.shapeGeoGen(shapes, pathes);
    // const circleMesh = new THREE.Mesh(circleGeo, this.shapeMat);
    // this.shapes.add(circleMesh);

    // // 円のパラメータ
    // const ens = [
    //   {a:   516, b:   516, r: 516},
    //   {a: - 416, b: - 416, r: 516},
    //   {a: - 466, b: - 466, r: 516},
    //   {a: - 516, b: - 516, r: 516},
    //   {a: - 416, b: - 416, r: 550},
    //   {a: - 466, b: - 466, r: 550},
    // ];

    // // 輪郭＆中心の線のパラメータ
    // const theta = THREE.MathUtils.degToRad(45);
    // const sens = [
    //   {p: - 516 * Math.cos(theta), q: - 516 * Math.sin(theta)},
    //   {p: -  71 * Math.cos(theta), q: -  71 * Math.sin(theta)},
    //   {p: -  35 * Math.cos(theta), q: -  35 * Math.sin(theta)},
    //   {p: - 552 * Math.cos(theta), q: - 552 * Math.sin(theta)},
    // ];

    // // 羽の模様線のパラメータ
    // const stripes = [94, 130, 194, 230, 294, 330, - 646, - 610, - 546, - 510, - 446, - 410];

    // // 黒い板
    // const params = [
    //   [- (sens[3].p + sens[3].q),    500],
    //   [- (sens[3].p + sens[3].q), - 1300],
    //   [  (sens[3].p + sens[3].q), -  500],
    //   [  (sens[3].p + sens[3].q),   1300]
    // ];
    // var points = [];
    // params.forEach((param) => {
    //   const point = this.straight(1, 1, param[0], param[1], undefined);
    //   points.push(point);
    // })
    // const bbGeo = this.shapeGeoGen(points);
    // const bbMesh = new THREE.Mesh(bbGeo, this.blackBoardMat);
    // this.blackBoard.add(bbMesh);
    // this.blackBoard.position.z = - 1;
    // // this.group.add(this.blackBoard);

    // // 羽

    // // 中心の棒
    // const arc0 = this.curvePointGen(ens[0].a, ens[0].b, ens[0].r, 45, 45 + THREE.MathUtils.radToDeg(Math.asin(35 / ens[0].r)), false);
    // const arc1 = this.curvePointGen(ens[3].a, ens[3].b, ens[3].r, 225 - THREE.MathUtils.radToDeg(Math.asin(35 / ens[3].r)), 225, false);
    // const points0 = arc0.concat(arc1);
    // const geo0 = this.shapeGeoGen(points0);
    // for (var i = 0;i <= 3;i ++) {
    //   const mesh = new THREE.Mesh(geo0, this.shapeMat);
    //   mesh.rotation.set(0, THREE.MathUtils.degToRad(180 * Math.ceil(i / 2)), THREE.MathUtils.degToRad(90 * Math.trunc(i % 2)));
    //   mesh.position.z = i <= 1 ? 0 : - 2;
    //   this.shapes.add(mesh);
    // }

    // // 羽の部品0
    // const arc2 = this.curvePointGen(ens[0].a, ens[0].b, ens[0].r, 45 + THREE.MathUtils.radToDeg(Math.asin(71 / ens[0].r)), 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - 330) / ens[0].r)), false);
    // const point1 = this.straight(1, 1, - (sens[1].p + sens[1].q), stripes[5], undefined);
    // const points1 = arc2.concat(point1);
    // const geo1 = this.shapeGeoGen(points1);
    // for (var i = 0;i <= 3;i ++) {
    //   const mesh = new THREE.Mesh(geo1, this.shapeMat);
    //   mesh.rotation.set(0, THREE.MathUtils.degToRad(180 * Math.ceil(i / 2)), THREE.MathUtils.degToRad(90 * Math.trunc(i % 2)));
    //   mesh.position.z = i <= 1 ? 0 : - 2;
    //   this.shapes.add(mesh);
    // }

    // // 羽の部品1
    // const arc3 = this.curvePointGen(ens[0].a, ens[0].b, ens[0].r, 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - stripes[4]) / ens[0].r)), 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - stripes[3]) / ens[0].r)), false);
    // const point2 = this.straight(1, 1, - (sens[1].p + sens[1].q), stripes[3], undefined);
    // const point3 = this.straight(1, 1, - (sens[1].p + sens[1].q), stripes[4], undefined);
    // const points2 = arc3.concat(point2, point3);
    // const geo2 = this.shapeGeoGen(points2);
    // for (var i = 0;i <= 3;i ++) {
    //   const mesh = new THREE.Mesh(geo2, this.shapeMat);
    //   mesh.rotation.set(0, THREE.MathUtils.degToRad(180 * Math.ceil(i / 2)), THREE.MathUtils.degToRad(90 * Math.trunc(i % 2)));
    //   mesh.position.z = i <= 1 ? 0 : - 2;
    //   this.shapes.add(mesh);
    // }

    // // 羽の部品2
    // const arc4 = this.curvePointGen(ens[0].a, ens[0].b, ens[0].r, 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - stripes[2]) / ens[0].r)), 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - stripes[1]) / ens[0].r)), false);
    // const point4 = this.straight(1, 1, - (sens[1].p + sens[1].q), stripes[1], undefined);
    // const point5 = this.straight(1, 1, - (sens[1].p + sens[1].q), stripes[2], undefined);
    // const points3 = arc4.concat(point4, point5);
    // const geo3 = this.shapeGeoGen(points3);
    // for (var i = 0;i <= 3;i ++) {
    //   const mesh = new THREE.Mesh(geo3, this.shapeMat);
    //   mesh.rotation.set(0, THREE.MathUtils.degToRad(180 * Math.ceil(i / 2)), THREE.MathUtils.degToRad(90 * Math.trunc(i % 2)));
    //   mesh.position.z = i <= 1 ? 0 : - 2;
    //   this.shapes.add(mesh);
    // }

    // // 羽の部品3
    // const point6 = this.straight(1, 1, - (sens[0].p + sens[0].q), stripes[0], undefined);
    // const point7 = this.straight(1, 1, - (sens[0].p + sens[0].q), stripes[11], undefined);
    // const point8 = this.straight(1, 1, - (sens[1].p + sens[1].q), stripes[11], undefined);
    // const point9 = this.straight(1, 1, - (sens[1].p + sens[1].q), stripes[0], undefined);
    // const points4 = [point6, point7, point8, point9];
    // const geo4 = this.shapeGeoGen(points4);
    // for (var i = 0;i <= 3;i ++) {
    //   const mesh = new THREE.Mesh(geo4, this.shapeMat);
    //   mesh.rotation.set(0, THREE.MathUtils.degToRad(180 * Math.ceil(i / 2)), THREE.MathUtils.degToRad(90 * Math.trunc(i % 2)));
    //   mesh.position.z = i <= 1 ? 0 : - 2;
    //   this.shapes.add(mesh);
    // }

    // // 羽の部品4
    // const point10 = this.straight(1, 1, - (sens[0].p + sens[0].q), stripes[10], undefined);
    // const point11 = this.straight(1, 1, - (sens[0].p + sens[0].q), stripes[9], undefined);
    // const point12 = this.straight(1, 1, - (sens[1].p + sens[1].q), stripes[9], undefined);
    // const point13 = this.straight(1, 1, - (sens[1].p + sens[1].q), stripes[10], undefined);
    // const points5 = [point10, point11, point12, point13];
    // const geo5 = this.shapeGeoGen(points5);
    // for (var i = 0;i <= 3;i ++) {
    //   const mesh = new THREE.Mesh(geo5, this.shapeMat);
    //   mesh.rotation.set(0, THREE.MathUtils.degToRad(180 * Math.ceil(i / 2)), THREE.MathUtils.degToRad(90 * Math.trunc(i % 2)));
    //   mesh.position.z = i <= 1 ? 0 : - 2;
    //   this.shapes.add(mesh);
    // }

    // // 羽の部品5
    // const point14 = this.straight(1, 1, - (sens[0].p + sens[0].q), stripes[8], undefined);
    // const point15 = this.straight(1, 1, - (sens[0].p + sens[0].q), stripes[7], undefined);
    // const point16 = this.straight(1, 1, - (sens[1].p + sens[1].q), stripes[7], undefined);
    // const point17 = this.straight(1, 1, - (sens[1].p + sens[1].q), stripes[8], undefined);
    // const points6 = [point14, point15, point16, point17];
    // const geo6 = this.shapeGeoGen(points6);
    // for (var i = 0;i <= 3;i ++) {
    //   const mesh = new THREE.Mesh(geo6, this.shapeMat);
    //   mesh.rotation.set(0, THREE.MathUtils.degToRad(180 * Math.ceil(i / 2)), THREE.MathUtils.degToRad(90 * Math.trunc(i % 2)));
    //   mesh.position.z = i <= 1 ? 0 : - 2;
    //   this.shapes.add(mesh);
    // }

    // // 羽の部品6
    // const arc5 = this.curvePointGen(ens[1].a, ens[1].b, ens[1].r, 135, 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[1].r)), false);
    // const point18 = this.straight(1, 1, - (sens[1].p + sens[1].q), stripes[6], undefined);
    // const point19 = this.straight(1, 1, - (sens[0].p + sens[0].q), stripes[6], undefined);
    // const points7 = arc5.concat(point18, point19);
    // const geo7 = this.shapeGeoGen(points7);
    // for (var i = 0;i <= 3;i ++) {
    //   const mesh = new THREE.Mesh(geo7, this.shapeMat);
    //   mesh.rotation.set(0, THREE.MathUtils.degToRad(180 * Math.ceil(i / 2)), THREE.MathUtils.degToRad(90 * Math.trunc(i % 2)));
    //   mesh.position.z = i <= 1 ? 0 : - 2;
    //   this.shapes.add(mesh);
    // }

    // // 羽の部品7
    // const arc6 = this.curvePointGen(ens[2].a, ens[2].b, ens[2].r, 155, 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[2].r)), false);
    // const arc7 = this.curvePointGen(ens[4].a, ens[4].b, ens[4].r, 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[4].r)), 166, true);
    // const points8 = arc6.concat(arc7);
    // const geo8 = this.shapeGeoGen(points8);
    // for (var i = 0;i <= 3;i ++) {
    //   const mesh = new THREE.Mesh(geo8, this.shapeMat);
    //   mesh.rotation.set(0, THREE.MathUtils.degToRad(180 * Math.ceil(i / 2)), THREE.MathUtils.degToRad(90 * Math.trunc(i % 2)));
    //   mesh.position.z = i <= 1 ? 0 : - 2;
    //   this.shapes.add(mesh);
    // }

    // // 羽の部品8
    // const arc8 = this.curvePointGen(ens[3].a, ens[3].b, ens[3].r, 155, 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[3].r)), false);
    // const arc9 = this.curvePointGen(ens[5].a, ens[5].b, ens[5].r, 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[5].r)), 166, true);
    // const points9 = arc8.concat(arc9);
    // const geo9 = this.shapeGeoGen(points9);
    // for (var i = 0;i <= 3;i ++) {
    //   const mesh = new THREE.Mesh(geo9, this.shapeMat);
    //   mesh.rotation.set(0, THREE.MathUtils.degToRad(180 * Math.ceil(i / 2)), THREE.MathUtils.degToRad(90 * Math.trunc(i % 2)));
    //   mesh.position.z = i <= 1 ? 0 : - 2;
    //   this.shapes.add(mesh);
    // }

    this.group.add(this.shapes);
  }


}
