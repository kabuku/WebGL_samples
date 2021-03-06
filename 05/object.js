export function createObject(
  gl,
  index,
  positions,
  positionAttributeLocations,
  ) {
    // 頂点配列オブジェクト
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    for (let i = 0; i < positions.length; i++) {
      // 頂点バッファオブジェクト
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions[i]), gl.STATIC_DRAW);
      // 結合されている頂点バッファオブジェクトを in 変数から参照できるようにする
      gl.vertexAttribPointer(positionAttributeLocations[i], 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(positionAttributeLocations[i]);
    }

    // インデックスバッファオブジェクト
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), gl.STATIC_DRAW);

    // 頂点配列オブジェクトの結合を解除した後に頂点バッファオブジェクトとインデックスバッファオブジェクトの結合を解除する
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    return vao;
}
