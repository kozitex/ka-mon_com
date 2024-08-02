'use strict';

import * as THREE from 'three';

export default class Founder {

  constructor() {

  }

  // 直線の方程式
  straight = (a, b, c, x, y) => {
    if (x == undefined) {
      return new THREE.Vector3((b * y - c) / a, y, 0);
    } else if (y == undefined) {
      return new THREE.Vector3(x, (a * x + c) / b, 0);
    }
  }

  // 円周上の座標を求める式（circle: {a: 中心X, b: 中心Y, r: 半径}, theta:角度）
  circumPoint(circle, theta) {
    const a = circle.a, b = circle.b, r = circle.r;
    const t = THREE.MathUtils.degToRad(theta);
    const x = a + r * Math.cos(t);
    const y = b + r * Math.sin(t);
    return new THREE.Vector3(x, y, 0);
  }

  // 円周上の座標の角度を求める式（circle: {a: 中心X, b: 中心Y, r: 半径}, v: {x: 円周上座標X, y: 円周上座標Y}）
  circumAngle(circle, v) {
    const a = circle.a, b = circle.b, x = v.x, y = v.y;
    return THREE.MathUtils.radToDeg(Math.atan2(y - b, x - a));
  }

  // 直線と円の交点を求める（circle: {a: 中心X ,b: 中心Y,r: 半径}, va: 直線を表す２点の座標[{x, y}, {x, y}]）
  interLineCircle = (circle, va) => {
    const cx = circle.a;
    const cy = circle.b;
    const cr = circle.r;
    const x1 = va[0].x;
    const y1 = va[0].y;
    const x2 = va[1].x;
    const y2 = va[1].y;

    const a = y2 - y1;
    const b = x2 - x1;
    const c = - (a * x1 + b * y1);

    const l = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

    const ex = (x2 - x1) / l;
    const ey = (y2 - y1) / l;

    const vx = - ey;
    const vy = ex;

    const k = - (a * cx + b * cy + c) / (a * vx + b * vy);

    const px = cx + k * vx;
    const py = cy + k * vy;

    if (cr < k) {
      return false;
    } else {
      const s = Math.sqrt(cr * cr - k * k);
      const v1 = new THREE.Vector3(px + s * ex, py + s * ey, 0);
      const v2 = new THREE.Vector3(px - s * ex, py - s * ey, 0);
      return [v1, v2];
    }
  }

  // ２点の座標から直線の方程式の係数（a,b,c）を取得（v1,v2: ２点の座標）
  from2Points = (v1, v2) => {
    const x1 = v1.x, y1 = v1.y;
    const x2 = v2.x, y2 = v2.y;
    var a, b, c;
    if (y1 == y2) {
      a = 0, b = 1, c = y1;
    } else if (x1 == x2) {
      a = 1, b = 0, c = x1;
    } else {
      a = (y2 - y1) / (x2 - x1);
      b = 1;
      c = (x2 * y1 - x1 * y2) / (x2 - x1);
    }
    return {a: a, b: b, c: c};
  }

  // ２直線の交点を求める式（va1,2: [0: 直線の始点座標, 1: 直線の終点座標]）
  getIntersect(va1, va2) {
    const form1 = this.from2Points(va1[0], va1[1]);
    const form2 = this.from2Points(va2[0], va2[1]);
    const a1 = form1.a;
    const b1 = form1.b;
    const c1 = form1.c;
    const a2 = form2.a;
    const b2 = form2.b;
    const c2 = form2.c;
    var x, y;
    if (b1 == 0) {
      x = c1;
      y = (a2 * c1 + c2) / b2;
    } else if (b2 == 0) {
      x = c2;
      y = (a1 * c2 + c1) / b1;
    } else {
      x = (c2 - c1) / (a1 - a2);
      y = ((a1 * c2) - (a2 * c1)) / (a1 - a2);
    }
    return new THREE.Vector3(x, y, 0);
  }

  // 座標の回転後の座標を求める(vertex: 座標、theta: 回転角度)
  rotateCoordinate = (vertex, theta) => {
    const t = THREE.MathUtils.degToRad(theta);
    const x = vertex.x;
    const y = vertex.y;
    const xd = x * Math.cos(t) - y * Math.sin(t);
    const yd = x * Math.sin(t) - y * Math.cos(t);
    return new THREE.Vector3(xd, yd, 0);
  }

  // 直線の描画座標を生成
  linePointGen = (a, b, r, f, t, d) => {
    const points = [];
    for (var i = 0;i <= d - 1;i ++) {
      const p = THREE.MathUtils.damp(f, t, 10, i / (d - 1));
      var point;
      if (b == 0) {
        point = this.straight(a, b, r, undefined, p);
      } else {
        point = this.straight(a, b, r, p, undefined);
      }
      points.push(point);
    }
    return points;
  }

  // 円弧の描画座標を生成
  circlePointGen = (a, b, r, f, t, d) => {
    const points = [];
    for (var i = 0;i <= d - 1;i ++) {
      const p = THREE.MathUtils.damp(f, t, 10, i / (d - 1));
      const point = this.circumPoint({a: a, b: b, r: r}, p);
      points.push(point);
    }
    return points;
  }

  // 円弧の図形用座標を生成
  curvePointGen = (a, b, r, f, t, c) => {
    const curve = new THREE.EllipseCurve(
      a, b,
      r, r,
      THREE.MathUtils.degToRad(f), THREE.MathUtils.degToRad(t),
      c, 0
    );
    return curve.getPoints(100);
  }

  intercect = (circle1, circle2) =>
  {
    // 衝突判定の結果オブジェクト
    const result = {
      hit: false,
      pos: [],
    }
  
    // 円1の中心をC1、円2の中心をC2、交点の1つをPとする。
    const C1 = circle1.p;
    const C2 = circle2.p;
  
    // C1からC2に向かうベクトルを vC1C2と定義する
    const vC1C2 = new THREE.Vector2.sub(C2, C1);
  
    // 辺C1C2の長さを a とする
    const a = vC1C2.magnitude;
  
    // a が 2円の半径の和より大きければ当たっていない
    const sumR = circle1.r + circle2.r;
    if (sumR < a) return result;
  
    // ここに来たらとりあえず当たっている
    result.hit = true;
  
    // 円と円の交点を求めていく
  
    // 円が内包されている時は接点は存在しない
    // 円が内包されている場合、a は 2円の半径の差より小さい
    const subR = Math.abs(circle1.r - circle2.r);
    
    if (a < subR) {
      return result;
    }
  
    // 円が外接しているとき、a と 2つの円の半径の和は等しく、接点は１つだけになる。
    if (a === sumR) {
        // vC1C2 を正規化したベクトルを n とする
        const n = vC1C2.normalize;
  
        // 接点P は C1 に n を 円の半径の長さ分伸ばしたベクトルを足せばいい
        const P = Vector2.add(circle1.p, n.times(circle1.r));
        result.pos.push(P);
    
        return result;
    }
  
    // また内接しているとき、a と ２つの円の半径の差は等しく、接点は１つだけになる。
    if (a === subR) 
    {
      // vC1C2 を正規化したベクトルを n とする
      const n = vC1C2.normalize;
  
      // C1の方が大きいかどうか
      const isLarge = (circle1.r > circle2.r);
  
      // 接点をPとすると
      // C1の方が大きい場合、P は C1 + r1・n
      // C1の方が小さい場合、P は C1 - r1・n
      const P = Vector2.add(circle1.p, n.times(isLarge? circle1.r:-circle1.r));
      result.pos.push(P);
  
      return result;
    }
  
    // 三角形C1C2Pの三辺は全て既知である。
    // 辺C1Pの長さをb、辺C2Pの長さをcとする
    const b = circle1.r;
    const c = circle2.r;
  
    // 角C1 の cosθ は余弦定理により
    const cos = (a**2 + b**2 - c**2) / (2 * a * b);
  
    // PからC1C2に垂線を落とした時に当たる位置を H とし、C1Hの長さを rc とすると rc は b * cos
    const rc = b * cos;
  
    // 辺HPの長さを rs とすると rs は三平方の定理から rs = √b^2 - t^2
    const rs = Math.sqrt(b**2 - rc**2);
  
    // vC1C2の正規化したベクトルを n1とする
    const n1 = vC1C2.normalize;
  
    // n1を左に90度回転させたベクトルを n2とする
    const n2 = new Vector2(-n1.y, n1.x);
  
    // 交点であるPの座標は C1 + tn1 + sn2 となり
    // もう一つの交点C'は C1 + tn1 - sn2 となる
    const tn1 = n1.times(rc);
    const sn2 = n2.times(rs);
  
    result.pos.push(circle1.p.clone().add(tn1).add(sn2));
    result.pos.push(circle1.p.clone().add(tn1).sub(sn2));
    
    return result;
  }

}

// export function intercect(circle1, circle2) 
// {
//   // 衝突判定の結果オブジェクト
//   const result = {
//     hit: false,
//     pos: [],
//   }

//   // 円1の中心をC1、円2の中心をC2、交点の1つをPとする。
//   const C1 = circle1.p;
//   const C2 = circle2.p;

//   // C1からC2に向かうベクトルを vC1C2と定義する
//   const vC1C2 = Vector2.sub(C2, C1);

//   // 辺C1C2の長さを a とする
//   const a = vC1C2.magnitude;

//   // a が 2円の半径の和より大きければ当たっていない
//   const sumR = circle1.r + circle2.r;
//   if (sumR < a) return result;

//   // ここに来たらとりあえず当たっている
//   result.hit = true;

//   // 円と円の交点を求めていく

//   // 円が内包されている時は接点は存在しない
//   // 円が内包されている場合、a は 2円の半径の差より小さい
//   const subR = Math.abs(circle1.r - circle2.r);
  
//   if (a < subR) {
//     return result;
//   }

//   // 円が外接しているとき、a と 2つの円の半径の和は等しく、接点は１つだけになる。
//   if (a === sumR) {
//       // vC1C2 を正規化したベクトルを n とする
//       const n = vC1C2.normalize;

//       // 接点P は C1 に n を 円の半径の長さ分伸ばしたベクトルを足せばいい
//       const P = Vector2.add(circle1.p, n.times(circle1.r));
//       result.pos.push(P);
  
//       return result;
//   }

//   // また内接しているとき、a と ２つの円の半径の差は等しく、接点は１つだけになる。
//   if (a === subR) 
//   {
//     // vC1C2 を正規化したベクトルを n とする
//     const n = vC1C2.normalize;

//     // C1の方が大きいかどうか
//     const isLarge = (circle1.r > circle2.r);

//     // 接点をPとすると
//     // C1の方が大きい場合、P は C1 + r1・n
//     // C1の方が小さい場合、P は C1 - r1・n
//     const P = Vector2.add(circle1.p, n.times(isLarge? circle1.r:-circle1.r));
//     result.pos.push(P);

//     return result;
//   }

//   // 三角形C1C2Pの三辺は全て既知である。
//   // 辺C1Pの長さをb、辺C2Pの長さをcとする
//   const b = circle1.r;
//   const c = circle2.r;

//   // 角C1 の cosθ は余弦定理により
//   const cos = (a**2 + b**2 - c**2) / (2 * a * b);

//   // PからC1C2に垂線を落とした時に当たる位置を H とし、C1Hの長さを rc とすると rc は b * cos
//   const rc = b * cos;

//   // 辺HPの長さを rs とすると rs は三平方の定理から rs = √b^2 - t^2
//   const rs = Math.sqrt(b**2 - rc**2);

//   // vC1C2の正規化したベクトルを n1とする
//   const n1 = vC1C2.normalize;

//   // n1を左に90度回転させたベクトルを n2とする
//   const n2 = new Vector2(-n1.y, n1.x);

//   // 交点であるPの座標は C1 + tn1 + sn2 となり
//   // もう一つの交点C'は C1 + tn1 - sn2 となる
//   const tn1 = n1.times(rc);
//   const sn2 = n2.times(rs);

//   result.pos.push(circle1.p.clone().add(tn1).add(sn2));
//   result.pos.push(circle1.p.clone().add(tn1).sub(sn2));
  
//   return result;
// }
