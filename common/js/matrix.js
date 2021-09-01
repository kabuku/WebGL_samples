export function translation(tx, ty, tz) {
    return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      tx, ty, tz, 1,
    ];
  }

  export function projection(width, height, depth) {
    // Note: This matrix flips the Y axis so 0 is at the top.
    return [
       2 / width, 0, 0, 0,
       0, -2 / height, 0, 0,
       0, 0, 2 / depth, 0,
      -1, 1, 0, 1,
    ];
  }
  export function multiply(a, b) {
    var a00 = a[0 * 4 + 0];
    var a01 = a[0 * 4 + 1];
    var a02 = a[0 * 4 + 2];
    var a03 = a[0 * 4 + 3];
    var a10 = a[1 * 4 + 0];
    var a11 = a[1 * 4 + 1];
    var a12 = a[1 * 4 + 2];
    var a13 = a[1 * 4 + 3];
    var a20 = a[2 * 4 + 0];
    var a21 = a[2 * 4 + 1];
    var a22 = a[2 * 4 + 2];
    var a23 = a[2 * 4 + 3];
    var a30 = a[3 * 4 + 0];
    var a31 = a[3 * 4 + 1];
    var a32 = a[3 * 4 + 2];
    var a33 = a[3 * 4 + 3];
    var b00 = b[0 * 4 + 0];
    var b01 = b[0 * 4 + 1];
    var b02 = b[0 * 4 + 2];
    var b03 = b[0 * 4 + 3];
    var b10 = b[1 * 4 + 0];
    var b11 = b[1 * 4 + 1];
    var b12 = b[1 * 4 + 2];
    var b13 = b[1 * 4 + 3];
    var b20 = b[2 * 4 + 0];
    var b21 = b[2 * 4 + 1];
    var b22 = b[2 * 4 + 2];
    var b23 = b[2 * 4 + 3];
    var b30 = b[3 * 4 + 0];
    var b31 = b[3 * 4 + 1];
    var b32 = b[3 * 4 + 2];
    var b33 = b[3 * 4 + 3];
    return [
      b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
      b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
      b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
      b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
      b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
      b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
      b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
      b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
      b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
      b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
      b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
      b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
      b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
      b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
      b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
      b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
    ];
  }
  export function ortho(left, right, bottom, top, zNear, zFar)
  {
    return [
      2 / (right - left),0,0,0,
      0,2 / (top - bottom),0,0,
      0,0,-2 / (zFar - zNear),0,
      -(right + left) / (right - left),-(top + bottom) / (top - bottom),-(zFar + zNear) / (zFar - zNear),1,
    ];
  }
  export function frustum(left, right, bottom, top, zNear, zFar)
  {
    return [
      2 * zNear / (right - left),0,0,0,
      0,2 * zNear / (top - bottom),0,0
      (right + left) / (right - left),(top + bottom) / (top - bottom),-(zFar + zNear) / (zFar - zNear),-1,
      0,0,-2 * zFar * zNear / (zFar - zNear),0
    ];
  }
  //
  // 画角を指定して透視投影変換行列を求める
  //
  //   fovy: 画角（ラジアン）
  //   aspect: ウィンドウの縦横比
  //   zNear, zFar: 前方面および後方面までの距離
  //
  export function perspective(fovy, aspect, zNear, zFar)
  {
    // 【宿題】ここを解答してください（loadIdentity() を置き換えてください）
    const f = 1 / Math.tan(fovy/2)
    return [
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, -(zFar + zNear) / (zFar - zNear), -1,
      0, 0,  - 2 * zFar * zNear / ( zFar - zNear), 0,
    ];
  }
  //
  // ビュー変換行列を求める
  //
  //   m: ビュー変換行列を格納する配列
  //   ex, ey, ez: 視点の位置
  //   tx, ty, tz: 目標点の位置
  //   ux, uy, uz: 上方向のベクトル
  //
  export function lookat(ex, ey, ez, tx, ty, tz, ux, uy, uz)
  {
    // 【宿題】ここを解答してください（loadIdentity() を置き換えてください）
    const normET = Math.sqrt(Math.pow(ex-tx,2) + Math.pow(ey - ty,2) + Math.pow(ez-tz,2));
    const zDash = [ (ex - tx) / normET, (ey - ty) / normET, (ez -tz) / normET];
    const normUZDash = Math.sqrt(
      Math.pow(uy * zDash[2] - uz * zDash[1],2) + Math.pow(uz * zDash[0] - ux * zDash[2],2) + Math.pow(ux * zDash[1] - uy * zDash[0],2)
    );
    const xDash = [
      uy * zDash[2] - uz * zDash[1] / normUZDash,
      uz * zDash[0] - ux * zDash[2] / normUZDash,
      ux * zDash[1] - uy * zDash[0] / normUZDash
    ];
    const yDash = [
      zDash[1] * xDash[2] - zDash[2] * xDash[1],
      zDash[2] * xDash[0] - zDash[0] * xDash[2],
      zDash[0] * xDash[1] - zDash[1] * xDash[0],
    ];
    const Rv = [
      xDash[0],yDash[0],zDash[0],0,
      xDash[1],yDash[1],zDash[1],0,
      xDash[2],yDash[2],zDash[2],0,
      0,0,0,1
    ];
    const Tv = [
      1,0,0,0,
      0,1,0,0,
      0,0,1,0,
      -ex,-ey,-ez,1
    ]
    return multiply(Rv, Tv);
  }
  export function loadIdentity(){
    return [
      1,0,0,0,
      0,1,0,0,
      0,0,1,0,
      0,0,0,1,
    ]
  }

  export function mulV(mat, v) {
    return [
      mat[0]*v[0] + mat[3]*v[1] + mat[6]*v[2],
      mat[1]*v[0] + mat[4]*v[1] + mat[7]*v[2],
      mat[2]*v[0] + mat[5]*v[1] + mat[8]*v[2],
    ]
  }

/**
 * Y 軸回転の行列を取得する
 * @param {number[]} a 角度
 * @returns number[]
 */
export function rotateY(a) {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [
      c, 0.0,  -s, 0.0,
    0.0, 1.0, 0.0, 0.0,
      s, 0.0,   c, 0.0,
    0.0, 0.0, 0.0, 1.0,
  ];
}

/**
 * 法線変換行列を設定する
 * @param {number[]} marray
 * @returns number[]
 */
export function normal(marray) {
  return [
    marray[ 5] * marray[10] - marray[ 6] * marray[ 9],    // 0
    marray[ 6] * marray[ 8] - marray[ 4] * marray[10],    // 1
    marray[ 4] * marray[ 9] - marray[ 5] * marray[ 8],    // 2
    0.0,                                                  // 3
    marray[ 9] * marray[ 2] - marray[10] * marray[ 1],    // 4
    marray[10] * marray[ 0] - marray[ 8] * marray[ 2],    // 5
    marray[ 8] * marray[ 1] - marray[ 9] * marray[ 0],    // 6
    0.0,                                                  // 7
    marray[ 1] * marray[ 6] - marray[ 2] * marray[ 5],    // 8
    marray[ 2] * marray[ 4] - marray[ 0] * marray[ 6],    // 9
    marray[ 0] * marray[ 5] - marray[ 1] * marray[ 4],    // 10
    0.0,                                                  // 11
    0.0,                                                  // 12
    0.0,                                                  // 13
    0.0,                                                  // 14
    1.0,                                                  // 15
  ];
}
