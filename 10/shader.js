export const vertexShaderSource = `#version 300 es

// 光源
const vec4 pl = vec4(3.0, 4.0, 5.0, 1.0);           // 位置
const vec3 ldiff = vec3(1.0, 1.0, 1.0);             // 拡散反射成分の強度

// 材質
const vec3 kdiff = vec3(0.8, 0.8, 0.8);             // 拡散反射係数

// 頂点属性
in vec4 pv;                                         // ローカル座標系の頂点位置
in vec4 nv;                                         // 頂点の法線ベクトル

// 変換行列
uniform mat4 mw;                                    // 視点座標系への変換行列
uniform mat4 mc;                                    // クリッピング座標系への変換行列
uniform mat4 mg;                                    // 法線ベクトルの変換行列

// 球面調和解析
const float k1 = 0.429043;
const float k2 = 0.511664;
const float k3 = 0.743125;
const float k4 = 0.886227;
const float k5 = 0.247708;

// 球面調和係数
uniform vec3 sh0;
uniform vec3 sh1;
uniform vec3 sh2;
uniform vec3 sh3;
uniform vec3 sh4;
uniform vec3 sh5;
uniform vec3 sh6;
uniform vec3 sh7;
uniform vec3 sh8;
uniform vec3 sh9;

// ラスタライザに送る頂点属性
out vec3 idiff;                                     // 拡散反射光強度

void main(void)
{
  vec4 p = mw * pv;                                 // 視点座標系の頂点の位置
  vec3 l = normalize((pl * p.w - p * pl.w).xyz);    // 光線ベクトル
  vec3 n = normalize((mg * nv).xyz);                // 法線ベクトル

  idiff = max(dot(n, l), 0.0) * kdiff * ldiff;

  gl_Position = mc * pv;
}
`;

export const fragmentShaderSource = `#version 300 es
// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;

// ラスタライザから受け取る頂点属性の補間値
in vec3 idiff;                                      // 拡散反射光強度

// フレームバッファに出力するデータ
layout (location = 0) out vec4 fc;                                       // フラグメントの色

void main(void)
{
  fc = vec4(idiff, 1.0);
}
`;
