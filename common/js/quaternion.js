export function qmake(axis, rad) {
    const ll = axis[0]*axis[0] + axis[1]*axis[1] + axis[2]*axis[2]
    if (ll === 0) return null
  
    const ph = rad / 2
    const s = Math.sin(ph) / Math.sqrt(ll)
    return [
      axis[0] * s,
      axis[1] * s,
      axis[2] * s,
      Math.cos(ph)
    ]
  }
  
  export function slerp(q, r, t) {
    const qr = q[0]*r[0] + q[1]*r[1] + q[2]*r[2] + q[3]*r[3]
    const ss = 1 - qr*qr
    if (ss === 0) {
      return [...q]
    } else {
      const sp = Math.sqrt(ss)
      const ph = Math.acos(qr)
      const pt = ph * t
      const t1 = Math.sin(pt) / sp
      const t0 = Math.sin(ph - pt) / sp
      return [
        q[0]*t0 + r[0]*t1,
        q[1]*t0 + r[1]*t1,
        q[2]*t0 + r[2]*t1,
        q[3]*t0 + r[3]*t1,
      ]
    }
  }
  
  export function qrot(q) {
    const m00 = 1 - 2*(q[1]*q[1] + q[2]*q[2])
    const m01 = 2*(q[0]*q[1] - q[3]*q[2])
    const m02 = 2*(q[2]*q[0] + q[3]*q[1])
    const m03 = 0
  
    const m10 = 2*(q[0]*q[1] + q[3]*q[2])
    const m11 = 1 - 2*(q[2]*q[2] + q[0]*q[0])
    const m12 = 2*(q[1]*q[2] - q[3]*q[0])
    const m13 = 0
  
    const m20 = 2*(q[2]*q[0] - q[3]*q[1])
    const m21 = 2*(q[1]*q[2] + q[3]*q[0])
    const m22 = 1 - 2*(q[0]*q[0] + q[1]*q[1])
    const m23 = 0
  
    const m30 = 0
    const m31 = 0
    const m32 = 0
    const m33 = 1
    return [
      m00, m10, m20, m30,
      m01, m11, m21, m31,
      m02, m12, m22, m32,
      m03, m13, m23, m33,
    ]
  }

  export function rotateX(a) {
    return qrot(qmake([1.0, 0.0, 0.0], a))
  }
  