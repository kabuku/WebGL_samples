export const vertexShaderSource = `#version 300 es

// 光源
const vec4 pl = vec4(0.0, 4.0, 7.0, 1.0);           // 位置

// 頂点属性
in vec4 pv;                                         // ローカル座標系の頂点位置
in vec4 nv;                                         // 頂点の法線ベクトル

// 変換行列
uniform mat4 mw;                                    // 視点座標系への変換行列
uniform mat4 mc;                                    // クリッピング座標系への変換行列
uniform mat4 mg;                                    // 法線ベクトルの変換行列

// ラスタライザに送る頂点属性
out vec3 n;                                         // 頂点の法線ベクトル
out vec3 l;                                         // 光線ベクトル
out vec3 v;                                         // 視線ベクトル

void main(void)
{
  vec4 p = mw * pv;                                 // 視点座標系の頂点の位置
  vec4 q = mw * pl;                                 // 視点座標系の光源の位置

  n = normalize((mg * nv).xyz);                     // 法線ベクトル
  l = normalize((q * p.w - p * q.w).xyz);           // 光線ベクトル
  v = normalize(p.xyz / p.w);                       // 視線ベクトル

  gl_Position = mc * pv;
}
`;

export const fragmentShaderSource = `#version 300 es
// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;

// 光源
const vec4 lamb   = vec4(0.2, 0.2, 0.2, 1.0);       // 環境光成分の強度
const vec4 ldiff  = vec4(1.0, 1.0, 1.0, 0.0);       // 拡散反射成分の強度
const vec4 lspec  = vec4(1.0, 1.0, 1.0, 0.0);       // 鏡面反射成分の強度

// 材質
const vec4 kamb   = vec4(0.2, 0.4, 0.6, 1.0);       // 環境光の反射係数
const vec4 kdiff  = vec4(0.2, 0.4, 0.6, 1.0);       // 拡散反射係数
const vec4 kspec  = vec4(0.4, 0.4, 0.4, 1.0);       // 鏡面反射係数
const float kshi  = 40.0;                           // 輝き係数

// ラスタライザから受け取る頂点属性の補間値
in vec3 n;                                          // 補間された法線ベクトル
in vec3 l;                                          // 補間された光線ベクトル
in vec3 v;                                          // 補間された視線ベクトル

// フレームバッファに出力するデータ
out vec4 fc;                                        // フラグメントの色

void main(void)
{
  vec3 nn = normalize(n);                           // 法線ベクトル
  vec3 nl = normalize(l);                           // 光線ベクトル
  vec3 nv = normalize(v);                           // 視線ベクトル
  vec3 nr = reflect(nl, nn);                        // 反射ベクトル

  vec3 b = vec3(-n.z, 0.0, n.x);                    // 従接線ベクトル (n × (0, 1, 0))
  vec3 t = normalize(cross(n, b));                  // 接線ベクトル (n × b)

  float lt = dot(nl, t);
  float vt = dot(nv, t);
  float ct = sqrt(1.0 - (lt * lt));
  float ca = ct * sqrt(1.0 - (vt * vt)) - (lt * vt);

  vec4 iamb = kamb * lamb;
  vec4 idiff = ct * kdiff * ldiff;
  vec4 ispec = pow(max(ca, 0.0), kshi) * kspec * lspec;

  fc = iamb + idiff + ispec;
}
`;
