//
// Catmull-Rom Spline
//
//   x0, x1, x2, x3: 制御点
//   t: パラメータ
//   戻り値: 補間値
//
function catmullRom(x0, x1, x2, x3, t) {
    const m0 = (x2 - x0) / 2
    const m1 = (x3 - x1) / 2
  
    const d = x1 - x2
    const a = 2*d + m0 + m1
    const b = -3*d - 2*m0 - m1
  
    return ((a * t + b) * t + m0) * t + x1
  }
  
  //
  // Catmull-Rom Spline による点列の補間
  //
  //   p: 補間値
  //   p0, p1, p2, p3: 制御点
  //   t: パラメータ
  //
  function interpolate(p0, p1, p2, p3, t) {
    return [
      catmullRom(p0[0], p1[0], p2[0], p3[0], t),
      catmullRom(p0[1], p1[1], p2[1], p3[1], t),
      catmullRom(p0[2], p1[2], p2[2], p3[2], t)
    ]
  }
  
  //
  // 任意の数の点列の Catmull-Rom Spline による補間
  //
  //   p: 補間する点列の座標値
  //   t: 補間する点列のタイムライン（値は昇順に格納されている）
  //   n: 点の数
  //   u: 補間値を得るパラメータ (t[0]≦u≦t[n - 1]）
  //
  // p -> route
  // t -> transit
  // n -> transit.length
  // u -> t
  export function spline(route, transit, t) {
    let n = transit.length
    if (--n === 0) return null
    if (n === 0) return [...p[0]]
  
    let i = 0
    let j = n
  
    // u を含む t の区間 [t[i], t[i+1]) を二分法で求める
    while (i < j) {
      const k = Math.floor((i + j) / 2)
      if (transit[k] < t)
        i = k + 1;
      else
        j = k;
    }
  
    if (--i < 0) i = 0
  
    if (n <= i) {
      return [...route[n]]
    }
  
    const i0 = Math.max(i - 1, 0)
    const i1 = i + 1
    const i2 = Math.min(i1 + 1, n)
  
    // タイムラインを線形（折れ線）補間する場合
    return interpolate(route[i0], route[i], route[i1], route[i2], (t - transit[i]) / (transit[i1] - transit[i]));
  }