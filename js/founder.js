'use strict';

import * as THREE from 'three';

export default class Founder {

  constructor() {

  }

  // 直線の方程式
  straight = (a, b, c, x, y) => {
    // console.log(a, b, c, x, y)
    if (x == undefined) {
      return new THREE.Vector3((b * y - c) / a, y, 0);
    } else if (y == undefined) {
      return new THREE.Vector3(x, (a * x + c) / b, 0);
    }
  }

  // 円弧の座標を求める式（a: 中心X座標, b: 中心Y座標, r: 半径, t:角度）
  circle(a, b, r, t) {
    const rt = THREE.MathUtils.degToRad(t);
    const x = a + r * Math.cos(rt);
    const y = b + r * Math.sin(rt);
    return new THREE.Vector3(x, y, 0);
  }

  // 円弧の座標を求める式（a: 中心X座標, b: 中心Y座標, r: 半径, t:角度）
  circleShort(param, t) {
    return this.circle(param.a, param.b, param.r, t);
  }

  // 円弧の角度を求める式（a: 中心X座標, b: 中心Y座標, x: 円周X座標, x: 円周Y座標）
  arc(a, b, x, y) {
    return THREE.MathUtils.radToDeg(Math.atan2(y - b, x - a));
  }

  // 直線と円の交点を求める（r: 半径, h: 中心X座標, k: 中心Y座標, m: 直線式の傾き, n: 直線式の切片）
  interLineCircle = (r, h, k, m, n) => {
    var a = 1 + Math.pow(m, 2);
    var b = -2 * h + 2 * m * (n - k);
    var c = Math.pow(h, 2) + Math.pow((n - k), 2) - Math.pow(r, 2);
    var D = Math.pow(b, 2) - 4 * a * c;

    var kouten = [];
    if (D >= 0) {
      var x1 = (-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
      var x2 = (-b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
      if (D == 0) {
        kouten.push(new THREE.Vector3(x1, m * x1 + n, 0));
      } else {
        kouten.push(new THREE.Vector3(x1, m * x1 + n, 0));
        kouten.push(new THREE.Vector3(x2, m * x2 + n, 0));
      }
    }
    return kouten;
  }

  interLineCircle2 = (circle, form) => {
    return this.interLineCircle(circle.r, circle.a, circle.b, form.a, form.b);
  }

  // interLineCircle3 = (circle, apices) => {
  //   const form = this.from2Points3(apices[0], apices[1]);
  //   return this.interLineCircle(circle.r, circle.a, circle.b, form.a, form.c);
  // }

  // #直線の座標A、直線の座標、円の中心点の座標、円の半径
  // aX,aY,bX,bY,cX,cY,r
  interLineCircle3 = (circle, apices) => {
    const cx = circle.a;
    const cy = circle.b;
    const cr = circle.r;
    const x1 = apices[0].x;
    const y1 = apices[0].y;
    const x2 = apices[1].x;
    const y2 = apices[1].y;

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

    // getPointsOfIntersectionWithLineAndCircle=(aX,aY,bX,bY,cX,cY,r)->
    
      // a = bY - aY
      // b = aX - bX
      // c = -( a*aX + b*aY )
    
      // l = Math.sqrt((bX-aX)*(bX-aX)+(bY-aY)*(bY-aY))
    
      // eX = (bX - aX) / l
      // eY = (bY - aY) / l
    
      // vX = -eY
      // vY = eX
    
      // k = - (a*cX + b*cY + c)/(a*vX+b*vY)
    
      // pX = cX + k*vX
      // pY = cY + k*vY
    
      // if r<k
      //   return false
      // else
      //   S = Math.sqrt( r*r - k*k )
    
      //   x1 = pX + S*eX
      //   y1 = pY + S*eY
      //   x2 = pX - S*eX
      //   y2 = pY - S*eY
    
        // return [x1,y1,x2,y2]
    
  }


  // ２点の座標から方程式のa,bを取得
  from2Points = (x1, y1, x2, y2) => {
    const a = (y2 - y1) / (x2 - x1);
    const b = (x2 * y1 - x1 * y2) / (x2 - x1);
    return {a: a, b: b};
  }

  // ２点の座標から方程式のa,bを取得
  from2Points2 = (v1, v2) => {
    return this.from2Points(v1.x, v1.y, v2.x, v2.y);
  }

  // ２点の座標から方程式のa,bを取得
  from2Points3 = (v1, v2) => {
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

  // ２直線の交点を求める式
  getIntersect(a1, b1, a2, b2) {
    const interX = (b2 - b1) / (a1 - a2);
    const interY = ((a1 * b2) - (a2 * b1)) / (a1 - a2);
    return new THREE.Vector3(interX, interY, 0);
  }

  // ２直線の交点を求める式
  getIntersect2(f1, f2) {
    return this.getIntersect(f1.a, f1.b, f2.a, f2.b);
    // const interX = (b2 - b1) / (a1 - a2);
    // const interY = ((a1 * b2) - (a2 * b1)) / (a1 - a2);
    // return new THREE.Vector3(interX, interY, 0);
  }

  // ２直線の交点を求める式
  getIntersect3(vs1, vs2) {
    const form1 = this.from2Points3(vs1[0], vs1[1]);
    const form2 = this.from2Points3(vs2[0], vs2[1]);
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

  // 座標の回転(v: 座標、t: 回転角度)
  rotateCoordinate = (vertex, theta) => {
    const t = THREE.MathUtils.degToRad(theta);
    const x = vertex.x;
    const y = vertex.y;
    const xd = x * Math.cos(t) - y * Math.sin(t);
    const yd = x * Math.sin(t) - y * Math.cos(t);
    // console.log(theta, x, y, xd, yd)
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
      const point = this.circle(a, b, r, p);
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

}
