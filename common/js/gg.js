import TgaLoader from './tga.js';

export function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader)); // eslint-disable-line
  gl.deleteShader(shader);
  return undefined;
}

export function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program)); // eslint-disable-line
  gl.deleteProgram(program);
  return undefined;
}
/*
 ** Image ファイル (8/16/24/32bit) を読み込む
 **
 **   name 読み込むファイル名
 **   @returns Promise<{width, height, image}>
 **   width 読み込んだファイルの横の画素数
 **   height 読み込んだファイルの縦の画素数
 **   image 読み込んだ画像を格納する vector
 */
export function ggReadImage(name) {
  return new Promise((res, rej) => {
    const image = new Image();
    image.onload = () => {
      res({
        image,
        width: image.width,
        height: image.height,
      });
    };
    image.onerror = (e) => rej(e);
    image.src = name;
  });
}

/*
 ** TGA ファイル (8/16/24/32bit) を読み込む
 **
 **   name 読み込むファイル名
 **   @returns Promise<{width, height, image}>
 **   width 読み込んだファイルの横の画素数
 **   height 読み込んだファイルの縦の画素数
 **   image 読み込んだ画像を格納する ImageData型
 */
export function ggReadTGAImage(name) {
  return new Promise((res, rej) => {
    const tga = new TgaLoader();
    tga.open(name, () => {
      const image = tga.getImageData();
      res({
        image,
        width: image.width,
        height: image.height,
      });
    });
    tga.onerror = (e) => rej(e);
  });
}

/*
** グレースケール画像 (8bit) から法線マップのデータを作成する
**
**   heightImg 高さマップ（グレースケール画像）ImageData型
**   nz 法線の z 成分の割合
**   戻り値 ImageData型の法線マップ
*/
export function ggCreateNormalMap(heightImg, nz) {
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  var width = heightImg.width;
  var height = heightImg.height;
  canvas.width = width;
  canvas.height = height;
  var hmap = heightImg.data;
  var nmapImageData = context.createImageData(width, height);
  var nmap = nmapImageData.data;
  // 法線マップの作成
  var size = width * height;
  var stride = 4;
  var base = 255.0;
  for (var i = 0; i < size; ++i)
  {
    var x = i % width;
    var y = i - x;
    var u0 = (y + (x - 1 + width) % width) * stride;
    var u1 = (y + (x + 1) % width) * stride;
    var v0 = ((y - width + size) % size + x) * stride;
    var v1 = ((y + width) % size + x) * stride;

    // 隣接する画素との値の差を法線の成分に用いる
    var idx = i * 4;
    var n = [];
    n[0] = hmap[u1] - hmap[u0];
    n[1] = hmap[v1] - hmap[v0];
    n[2] = nz;
    // 正規化後に0-255の範囲に収める
    ggNormalize3(n);
    nmap[idx] = (n[0] + 1.0) * 0.5 * base;
    nmap[idx + 1] = (n[1] + 1.0) * 0.5 * base;
    nmap[idx + 2] = (n[2] + 1.0) * 0.5 * base;
    nmap[idx + 3] = hmap[i * stride];
  }
  return nmapImageData;
}

/*
 ** 3 要素の正規化.
 **
 **  vec 3 要素の配列変数.
 */
export function ggNormalize3(vec) {
  var l = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2]);
  if (l > 0.0)
  {
    vec[0] /= l;
    vec[1] /= l;
    vec[2] /= l;
  }
}
