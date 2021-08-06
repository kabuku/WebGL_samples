function catmullRom(x0, x1, x2, x3, t) {
  const m0 = (x2 - x0) / 2
  const m1 = (x3 - x1) / 2

  const d = x1 - x2
  const a = 2*d + m0 + m1
  const b = -3*d - 2*m0 - m1

  return ((a * t + b) * t + m0) * t + x1
}

function interpolate(p0, p1, p2, p3, t) {
  return [
    catmullRom(p0[0], p1[0], p2[0], p3[0], t),
    catmullRom(p0[1], p1[1], p2[1], p3[1], t),
    catmullRom(p0[2], p1[2], p2[2], p3[2], t)
  ]
}

// p -> route
// t -> transit
// n -> transit.length
// u -> t
export function spline(route, transit, t) {
  if (transit.length === 0) return null

  let i = 0
  let j = transit.length - 1

  // u を含む t の区間 [t[i], t[i+1]) を二分法で求める
  while (i < j) {
    const k = Math.floor((i + j) / 2)
    if (transit[k] < t)
      i = k + 1;
    else
      j = k;
  }

  i = Math.max(i, 0)

  if (transit.length - 1 <= i) {
    return [...route[transit.length - 1]]
  }

  const i0 = Math.max(i - 1, 0)
  const i1 = i + 1
  const i2 = Math.min(i1 + 1, transit.length - 1)

  // タイムラインを線形（折れ線）補間する場合
  return interpolate(route[i0], route[i], route[i1], route[i2], (t - transit[i]) / (transit[i1] - transit[i]));
}
