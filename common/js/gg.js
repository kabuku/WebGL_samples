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
