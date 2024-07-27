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
    this.outer1 = {a: 0, b: 0, r: 1600};
    this.outer2 = {a: 0, b: 0, r: 1300};

    // 羽の輪郭円（[内中外][４円]）
    this.wingR = 530;
    this.wingC = [];
    for (var i = 0;i <= 2;i ++) {
      const circles = [];
      for (var j = 0;j <= 3;j ++) {
        const s = j > 0 ? - 1 : 1;
        const o = j > 0 ? (j - 1) * 50 : 0;
        circles.push({a: s * this.wingR + o, b: s * this.wingR + o, r: this.wingR + (i - 1) * w});
      }
      this.wingC.push(circles);
    }

    // 対角線
    this.rad = [
      this.circleShort(this.outer1,  45),
      this.circleShort(this.outer1, 225)
    ];

    // 羽弁（[i: 回転（＋α）][j: 内中外][k: 右左（右２左２）][l: ２点]）
    this.vane = [];
    for (var i = 0;i <= 2;i ++) {
      const shapes = [];
      for (var j = 0;j <= 2;j ++) {
        const lines = [];
        if (i == 2) {
          for (var k = 0;k <= 3;k ++) {
            const m = Math.trunc(k / 2);
            const n = k % 2 == 0 ? 0 : 1;
            const inter = this.getIntersect3(this.vane[0][j][m], this.vane[1][2][n]);
            lines.push([this.vane[0][j][m][n], inter]);
          }
        } else {
          for (var k = 0;k <= 1;k ++) {
            const points = [];
            const a = 45 + (90 * k);
            const s = k == 1 ? 1 : - 1;
            for (var l = 0;l <= 1;l ++) {
              var point = this.circleShort(this.wingC[j][l], a * s);
              if (i == 1) point = this.rotateCoordinate(point, 90);
              points.push(point);
            }
            lines.push(points);
          }
        }
        shapes.push(lines);
      }
      this.vane.push(shapes);
    }

    // 羽軸（[i: 回転][j: 内中外][k: 右左（右２左２）][l: ２点]）
    this.rachis = [];
    for (var i = 0;i <= 1;i ++) {
      const shapes = [];
      for (var j = 0;j <= 2;j ++) {
        const lines = [];
        const jw = (j - 1) * w;
        const t = THREE.MathUtils.radToDeg(Math.asin((40 + jw) / (this.wingR + jw)));
        if (i == 0) {
          for (var k = 0;k <= 1;k ++) {
            const points = [];
            for (var l = 0;l <= 1;l ++) {
              const a = 45 + (180 * l);
              const s = k + l == 1 ? 1 : - 1;
              points.push(this.circleShort(this.wingC[j][l], a + s * t));
            }
            lines.push(points);
          }
        } else {
          for (var k = 0;k <= 3;k ++) {
            const m = Math.trunc(k / 2);
            const n = k % 2 == 0 ? 0 : 1;
            const inter = this.getIntersect3(this.rachis[0][j][m], this.vane[1][2][n]);
            lines.push([this.rachis[0][j][m][n], inter]);
          }
        }
        shapes.push(lines);
      }
      this.rachis.push(shapes);
    }

    // 羽枝（[i: 回転][j: 下中上][k: 右２左２][l: 線３本]）
    this.barb = [];
    for (var i = 0;i <= 1;i ++) {
      const shapes = [];
      for (var j = 0;j <= 2;j ++) {
        const sides = [];
        for (var k = 0;k <= 3;k ++) {
          const lines = [];
          const m = k % 2 == 0 ? 0 : 1;
          const jw = (j - 1) * w;
          for (var l = 0;l <= 2;l ++) {

            // 交点の算出用の座標パラメータ
            const val = m == 0 ? 110 + jw + 100 * l : - 630 + jw + 100 * l;
            const x1 = k <= 1 ?    0 : val, y1 = k <= 1 ? val :    0;
            const x2 = k <= 1 ? 1600 : val, y2 = k <= 1 ? val : 1600;
            const refLine = [new THREE.Vector3(x1, y1, 0), new THREE.Vector3(x2, y2, 0)];

            const n = j == 1 ? 1 : 2;
            var object;
            if (i == 1 && m == 0) {
              object = this.vane[1][n][0];
            } else {
              object = k <= 1 ? this.rachis[0][n][0] : this.rachis[0][n][1];
            }
            const pointF = this.getIntersect3(object, refLine);

            var pointT;
            if (m == 0 && l >= 1) {
              const inters = this.interLineCircle3(this.wingC[0][0], refLine);
              pointT = k <= 1
                ? inters[0].x > inters[1].x ? inters[0] : inters[1]
                : inters[0].y > inters[1].y ? inters[0] : inters[1];
            } else {
              var object;
              if (i == 1 && m == 1) {
                object = this.vane[1][n][1];
              } else {
                const o = j == 1 ? 1 : 0;
                object = k <= 1 ? this.vane[0][o][0] : this.vane[0][o][1];  
              }
              pointT = this.getIntersect3(object, refLine);
            }
            lines.push([pointF, pointT]);
          }
          sides.push(lines);
        }
        shapes.push(sides);
      }
      this.barb.push(shapes);
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
    const outers = [this.outer1, this.outer2];
    for (var i = 0;i <= outers.length - 1;i ++) {
      const outer = outers[i];
      const points = this.circlePointGen2(outer,[90, 450], this.divCount);
      const mesh = this.guidelineGen(points);
      this.guidelines.add(mesh);
    }

    // 羽の輪郭円
    var pointsSum1 = [];
    for (var i = 0;i <= this.wingC[1].length - 1;i ++) {
      const circle = this.wingC[1][i];
      const points = this.circlePointGen2(circle,[90, 450], this.divCount);
      pointsSum1.push(points);
    }

    // 羽弁
    var pointsSum2 = [];
    for (var i = 0;i <= this.vane[0][1].length - 1;i ++) {
      const contour = this.vane[0][1][i];
      const points = this.linePointGen2(contour[0], contour[1], 0, this.divCount);
      pointsSum2.push(points);
    }

    // 対角線
    const radPoints = this.linePointGen2(this.rad[0], this.rad[1], 0, this.divCount);
    const radMesh = this.sublineGen(radPoints);
    this.guidelines.add(radMesh);

    // 羽軸
    var pointsSum3 = [];
    for (var i = 0;i <= this.rachis[0][1].length - 1;i ++) {
      const rad = this.rachis[0][1][i];
      const points = this.linePointGen2(rad[0], rad[1], 0, this.divCount);
      pointsSum3.push(points);
    }

    // 羽枝
    var pointsSum4 = [];
    for (var i = 0;i <= this.barb[0][1].length - 1;i ++) {
      const lines = this.barb[0][1][i];
      lines.forEach((line) => {
        const points = this.linePointGen3(line[0], line[1], 0, this.divCount);
        pointsSum4.push(points);
      })
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
    const outers = [this.outer1, this.outer2];
    outers.forEach((outer) => {
      const outer1 = {a: outer.a, b: outer.b, r: outer.r + w};
      const outer2 = {a: outer.a, b: outer.b, r: outer.r - w};
      const shape = this.curvePointGen2(outer1, [0, 360]);
      const path  = this.curvePointGen2(outer2, [0, 360]);
      const geo = this.shapeGeoGen(shape, path);
      const mesh = new THREE.Mesh(geo, this.outlineMat);
      this.outlines.add(mesh);
    });

    // 羽軸
    for (var i = 0;i <= this.rachis.length - 1;i ++) {
      const lines = this.rachis[i][1];
      lines.forEach((line) => {
        const geo = this.outlineGeoGen(line[0], line[1]);
        const mesh = new THREE.Mesh(geo, this.outlineMat);
        mesh.rotation.z = THREE.MathUtils.degToRad(90 * i);
        this.outlines.add(mesh);
      })
    }

    // 羽の輪郭円
    const angles = [
      [- 45, 135], [135, 315], [135, 315], [135, 315]
    ]
    for (var i = 0;i <= this.wingC[1].length - 1;i ++) {
      const circle = this.wingC[1][i];
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

    // 羽弁
    const vanes = [this.vane[0], this.vane[2]];
    for (var i = 0;i <= vanes.length - 1;i ++) {
      const lines = vanes[i][1];
      lines.forEach((line) => {
        const geo = this.outlineGeoGen(line[0], line[1]);
        const mesh = new THREE.Mesh(geo, this.outlineMat);
        mesh.rotation.z = THREE.MathUtils.degToRad(90 * i);
        this.outlines.add(mesh);
      })
    }

    // 羽枝
    for (var i = 0;i <= this.barb.length - 1;i ++) {
      const sides = this.barb[i][1];
      sides.forEach((lines) => {
        lines.forEach((line) => {
          const geo = this.outlineGeoGen(line[0], line[1]);
          const mesh = new THREE.Mesh(geo, this.outlineMat);
          mesh.rotation.z = THREE.MathUtils.degToRad(90 * i);
          this.outlines.add(mesh);  
        })
      })
    }

    this.group.add(this.outlines);
  }

  // 塗りつぶし図形を生成
  generateShape = () => {

    const w = 4;

    // 中心円
    const outers = [this.outer1, this.outer2];
    for (var i = 0;i <= 0;i ++) {
      const shape = this.curvePointGen2(outers[0], [0, 360]);
      const path  = this.curvePointGen2(outers[1], [0, 360]);
      const geo   = this.shapeGeoGen(shape, path);
      const mesh  = new THREE.Mesh(geo, this.shapeMat);
      this.shapes.add(mesh);
    }

    // 羽軸
    const rTheta = THREE.MathUtils.radToDeg(Math.asin((40 - w) / this.wingC[0][0].r));
    const rachisArcs = [];
    rachisArcs.push(this.curvePointGen3(this.wingC[0][0], [ 45 + rTheta,  45 - rTheta], true));
    rachisArcs.push(this.curvePointGen3(this.wingC[0][3], [225 + rTheta, 225 - rTheta], true));
    rachisArcs.push(this.curvePointGen3(this.wingC[2][3], [225 - rTheta, 225 + rTheta], false));
    rachisArcs.push(this.curvePointGen3(this.wingC[0][2], [225 + rTheta, 225 - rTheta], true));
    rachisArcs.push(this.curvePointGen3(this.wingC[2][2], [225 - rTheta, 225 + rTheta], false));
    rachisArcs.push(this.curvePointGen3(this.wingC[0][1], [225 + rTheta, 225 - rTheta], true));

    const rachisPoints = [];
    rachisPoints.push(rachisArcs[0].concat(rachisArcs[1]));
    rachisPoints.push(rachisArcs[2].concat(rachisArcs[3]));
    rachisPoints.push(rachisArcs[4].concat(rachisArcs[5]));
    rachisPoints.push(rachisArcs[0].concat([this.rachis[1][0][0][1], this.rachis[1][0][2][1]]));
    rachisPoints.push(rachisArcs[1].concat([this.rachis[1][0][3][1], this.rachis[1][0][1][1]]));

    const rachisGeos = [];
    const numArr = [[0, 1, 2], [3, 4, 1, 2]];
    numArr.forEach((nums) => {
      const group = [];
      nums.forEach((num) => {
        const points = rachisPoints[num];
        group.push(this.shapeGeoGen(points));
      })
      rachisGeos.push(group);
    })

    for (var i = 0;i <= rachisGeos.length - 1;i ++) {
      const geos = rachisGeos[i];
      geos.forEach((geo) => {
        const mesh = new THREE.Mesh(geo, this.shapeMat);
        mesh.rotation.z = THREE.MathUtils.degToRad(90 * i);
        this.shapes.add(mesh);
      })
    }

    // 羽枝
    const barbGeos = [];
    const barbAngles = [];
    const barbPoints = [];

    // 一つ目
    barbAngles.push([
      this.arcAngle(this.wingC[0][0], this.barb[0][0][0][2][1]), 
      this.arcAngle(this.wingC[0][0], this.barb[0][2][0][1][1])
    ]);
    barbPoints.push([
      this.curvePointGen3(this.wingC[0][0], barbAngles[0], true).concat(
        this.barb[0][2][0][1][0], this.barb[0][0][0][2][0]),
      this.curvePointGen3(this.wingC[0][0], barbAngles[0], true).concat(
        this.barb[1][2][0][1][0], this.barb[1][0][0][2][0])
    ]);
    barbGeos.push([
      this.shapeGeoGen(barbPoints[0][0]),
      this.shapeGeoGen(barbPoints[0][1])
    ]);

    // 二つ目
    barbAngles.push([
      this.arcAngle(this.wingC[0][0], this.barb[0][0][0][1][1]), 
      - 45
    ]);
    barbPoints.push([
      this.curvePointGen3(this.wingC[0][0], barbAngles[1], true).concat(
        this.barb[0][2][0][0][1], this.barb[0][2][0][0][0], this.barb[0][0][0][1][0]),
      this.curvePointGen3(this.wingC[0][0], barbAngles[1], true).concat(
        this.barb[1][2][0][0][1], this.barb[1][2][0][0][0], this.barb[1][0][0][1][0])
    ]);
    barbGeos.push([
      this.shapeGeoGen(barbPoints[1][0]),
      this.shapeGeoGen(barbPoints[1][1])
    ]);

    // 三つ目
    barbPoints.push([
      [this.barb[0][0][1][2][0]].concat(this.barb[0][0][1][2][1], 
        this.barb[0][2][1][1][1], this.barb[0][2][1][1][0]),
      [this.barb[1][0][1][2][0]].concat(this.barb[1][0][1][2][1], 
        this.barb[1][2][1][1][1], this.barb[1][2][1][1][0])
    ]);
    barbGeos.push([
      this.shapeGeoGen(barbPoints[2][0]),
      this.shapeGeoGen(barbPoints[2][1])
    ]);

    // 四つ目
    barbPoints.push([
      [this.barb[0][0][1][1][0]].concat(this.barb[0][0][1][1][1], 
        this.barb[0][2][1][0][1], this.barb[0][2][1][0][0]),
      [this.barb[1][0][1][1][0]].concat(this.barb[1][0][1][1][1], 
        this.barb[1][2][1][0][1], this.barb[1][2][1][0][0])
    ]);
    barbGeos.push([
      this.shapeGeoGen(barbPoints[3][0]),
      this.shapeGeoGen(barbPoints[3][1])
    ]);

    barbGeos.forEach((geos) => {
      for (var i = 0;i <= geos.length - 1;i ++) {
        const geo = geos[i];
        for (var j = 0;j <= 1;j ++) {
          const mesh = new THREE.Mesh(geo, this.shapeMat);
          mesh.rotation.y = THREE.MathUtils.degToRad(180 * (i + j));
          mesh.rotation.z = THREE.MathUtils.degToRad(90 * j);
          this.shapes.add(mesh);
        }
      }
    })

    // 羽弁
    const vaneGeos = [];
    const vaneAngles = [];
    const vanePoints = [];

    // 一つ目
    vaneAngles.push([
      this.arcAngle(this.wingC[0][0], this.rachis[0][2][0][0]), 
      this.arcAngle(this.wingC[0][0], this.barb[0][2][0][2][1])
    ]);
    vanePoints.push([
      this.curvePointGen3(this.wingC[0][0], vaneAngles[0], true).concat(
        this.barb[0][2][0][2][0]),
      this.curvePointGen3(this.wingC[0][0], vaneAngles[0], true).concat(
        this.barb[1][2][0][2][0], this.rachis[1][2][0][1])
    ]);
    vaneGeos.push([
      this.shapeGeoGen(vanePoints[0][0]),
      this.shapeGeoGen(vanePoints[0][1])
    ]);

    // 二つ目
    vanePoints.push([
      [this.barb[0][0][0][0][0]].concat(this.barb[0][0][0][0][1], 
        this.barb[0][2][1][2][1], this.barb[0][2][1][2][0]),
      [this.barb[1][0][0][0][0]].concat(this.barb[1][0][0][0][1], 
        this.vane[2][0][0][1])
    ]);
    vaneGeos.push([
      this.shapeGeoGen(vanePoints[1][0]),
      this.shapeGeoGen(vanePoints[1][1])
    ]);

    // 二つ目
    vanePoints.push([
      [],
      [this.rachis[1][2][1][1]].concat(this.barb[1][2][1][2][1], 
        this.barb[1][2][1][2][0])
    ]);
    vaneGeos.push([
      ,
      this.shapeGeoGen(vanePoints[2][1])
    ]);



    // console.log(barbAngles, vaneAngles)

    // const conTheta = THREE.MathUtils.radToDeg(Math.asin((40 + w) / this.wingC[0][0].r));
    // const conAngle1 = this.arcAngle(this.wingC[0][0], this.barb[0][2][0][2][1]);
    // const conArc1 = this.curvePointGen3(this.wingC[0][0], [45 - conTheta, conAngle1], true);
    // const interApex1 = this.getIntersect3(this.rachis[0][2][0], this.vane[1][2][0]);
    // const conPoints1 = conArc1.concat(this.barb[0][2][0][2][0]);
    // const conPoints2 = conArc1.concat(this.barb[1][2][0][2][0], interApex1);
    // const conGeo1 = this.shapeGeoGen(conPoints1);
    // const conGeo2 = this.shapeGeoGen(conPoints2);

    // const interApex2 = this.getIntersect3(this.vane[0][0][0], this.vane[1][2][0]);
    // const conPoints7 = this.barb[0][0][0][0].concat(this.barb[0][2][1][2][1], this.barb[0][2][1][2][0]);
    // const conPoints8 = this.barb[1][0][0][0].concat(interApex2);
    // const conGeo7 = this.shapeGeoGen(conPoints7);
    // const conGeo8 = this.shapeGeoGen(conPoints8);

    // const conGeos = [
    //   [conGeo1, conGeo7],
    //   [conGeo1, conGeo7],
    //   [conGeo2, conGeo8],
    //   [conGeo2, conGeo8],
    //   // [conGeo1, conGeo3, conGeo5, conGeo7],
    //   // [conGeo1, conGeo3, conGeo5, conGeo7],
    //   // [conGeo2, conGeo4, conGeo6, conGeo8],
    //   // [conGeo2, conGeo4, conGeo6, conGeo8],
    // ];

    vaneGeos.forEach((geos) => {
      for (var i = 0;i <= geos.length - 1;i ++) {
        const geo = geos[i];
        for (var j = 0;j <= 1;j ++) {
          const mesh = new THREE.Mesh(geo, this.shapeMat);
          mesh.rotation.y = THREE.MathUtils.degToRad(180 * (i + j));
          mesh.rotation.z = THREE.MathUtils.degToRad(90 * j);
          this.shapes.add(mesh);
        }
      }
    })

    // for (var i = 0;i <= conGeos.length - 1;i ++) {
    //   const geos = conGeos[i];
    //   geos.forEach((geo) => {
    //     const mesh = new THREE.Mesh(geo, this.shapeMat);
    //     mesh.rotation.y = THREE.MathUtils.degToRad(180 * Math.ceil(i / 2));
    //     mesh.rotation.z = THREE.MathUtils.degToRad(90 * Math.trunc(i % 2));
    //     this.shapes.add(mesh);
    //   })
    // }



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
