"use strict";

class TextureCoordinate {
  /**
   * @param {number} u
   * @param {number} v
   */
  constructor(u, v) {
    /** @type {number} */
    this.u = u;
    /** @type {number} */
    this.v = v;
  }
}

class Vec3 {
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  constructor(x, y, z) {
    /** @type {number} */
    this.x = x;
    /** @type {number} */
    this.y = y;
    /** @type {number} */
    this.z = z;
  }

  /**
   * @param {Vec3} v
   * @returns {Vec3}
   */
  sub(v) {
    return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z);
  };

  /**
   * @param {Vec3} v
   * @returns {Vec3}
   */
  cross(v) {
    return new Vec3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  };

  /**
   * @returns {number}
   */
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  };

  /**
   * @returns {Vec3}
   */
  normalize() {
    const l = this.length();
    return new Vec3(this.x / l, this.y / l, this.z / l);
  };

  /**
   * @returns {Array<number>}
   */
  toArray() {
    return [this.x, this.y, this.z];
  }
}

class VertexesInfo {
  constructor() {
    /** @type {Array<Vec3>} */
    this.vertexes = [];
    /** @type {Array<Vec3>} */
    this.normalVecs = [];
    /** @type {Array<TextureCoordinate>} */
    this.textureCoordinates = [];
  }
}

class Color {
  /**
   * @param {number} r
   * @param {number} g
   * @param {number} b
   */
  constructor(r, g, b) {
    /** @type {number} */
    this.r = r;
    /** @type {number} */
    this.g = g;
    /** @type {number} */
    this.b = b;
  }
}

class Material {
  /**
   *
   * @param {string} name
   */
  constructor(name) {
    /** @type {string} */
    this.name = name;
    /** @type {Color} */
    this.ambient = null;
    /** @type {Color} */
    this.diffuse = null;
    /** @type {Color} */
    this.specular = null;
    /** @type {number} */
    this.shininess = null;
  }
}

class FaceVertex {
  /**
   * @param {string} word
   */
  constructor(word) {
    const tokens = (word + "//").split("/");
    /** @type {number} */
    this.vertexIndex = parseInt(tokens[0], 10) - 1;
    /** @type {number} */
    this.textureIndex = tokens[1] !== "" ? parseInt(tokens[1], 10) - 1 : null;
    /** @type {number} */
    this.normalVecIndex = tokens[2] !== "" ? parseInt(tokens[2], 10) - 1 : null;
  }
}

class Face {
  /**
   * @param {FaceVertex} v1
   * @param {FaceVertex} v2
   * @param {FaceVertex} v3
   */
  constructor(v1, v2, v3) {
    /** @type {FaceVertex} */
    this.v1 = v1;
    /** @type {FaceVertex} */
    this.v2 = v2;
    /** @type {FaceVertex} */
    this.v3 = v3;
  }
}

class Group {
  /**
   * @param {Array<Face>} faces
   * @param {Material} material
   */
  constructor(faces, material) {
    /** @type {string} */
    this.name = "";
    /** @type {Array<Face>} */
    this.faces = faces;
    /** @type {Material} */
    this.material = material;
    /** @type {boolean} */
    this.isSmooth = false;
  }
}

class Obj {
  /**
   * @param {VertexesInfo} vertexesInfo
   * @param {Array<Group>} groups
   */
  constructor(vertexesInfo, groups) {
    /** @type {VertexesInfo} */
    this.vertexesInfo = vertexesInfo;
    /** @type {Array<Group>} */
    this.groups = groups;
  }
}

/**
 * @param {string} url
 * @returns {Promise<Array<Group>>}
 */
export async function loadMtl(url) {
  const materials = {};
  const response = await fetch(url);
  const text = await response.text();
  const materialTexts = text.split("newmtl ");
  for (const materialText of materialTexts) {
    const lines = materialText.split("\n");
    const name = lines[0];
    const material = new Material(name);
    for (const line of lines.slice(1)) {
      if (line.startsWith("Ka ")) {
        const values = line.split(" ");
        material.ambient = new Color(
          parseFloat(values[1]),
          parseFloat(values[2]),
          parseFloat(values[3])
        );
      } else if (line.startsWith("Kd ")) {
        const values = line.split(" ");
        material.diffuse = new Color(
          parseFloat(values[1]),
          parseFloat(values[2]),
          parseFloat(values[3])
        );
      } else if (line.startsWith("Ks ")) {
        const values = line.split(" ");
        material.specular = new Color(
          parseFloat(values[1]),
          parseFloat(values[2]),
          parseFloat(values[3])
        );
      } else if (line.startsWith("Ns ")) {
        material.shininess = parseFloat(line.split(" ")[1]);
      }
    }
    // ambient, diffuse, specularがすべてnullだった場合は無効なマテリアルとする
    if (
      material.ambient === null &&
      material.diffuse === null &&
      material.specular === null
    ) {
      continue;
    }
    materials[name] = material;
  }
  return materials;
}

/**
 * @param {string} url
 * @param {Array<Material>} materials
 * @returns {Promise<Obj>}
 */
export async function loadObj(url, materials) {
  const response = await fetch(url);
  const text = await response.text();
  const [vertexesText, ...rawGroupTextList] = text.split("usemtl ");

  const vertexesInfo = vertexesText.split("\n").reduce(
    /**
     * @param {VertexesInfo} acc
     * @param {string} cur
     * @returns {VertexesInfo}
     */
    (acc, cur) => {
      if (cur.startsWith("v ")) {
        const values = cur.split(" ");
        acc.vertexes.push(
          new Vec3(
            parseFloat(values[1]),
            parseFloat(values[2]),
            parseFloat(values[3])
          )
        );
      } else if (cur.startsWith("vn ")) {
        const values = cur.split(" ");
        acc.normalVecs.push(
          new Vec3(
            parseFloat(values[1]),
            parseFloat(values[2]),
            parseFloat(values[3])
          )
        );
      } else if (cur.startsWith("vt ")) {
        const values = cur.split(" ");
        acc.textureCoordinates.push(
          new TextureCoordinate(parseFloat(values[1]), parseFloat(values[2]))
        );
      }
      return acc;
    },
    new VertexesInfo()
  );

  const groups = rawGroupTextList.map(
    (rawGroupText) => {
      const [materialName, ...rawGroupTextLines] = rawGroupText.split("\n");
      const material = materials[materialName.replace("\r", "")];
      const faces = rawGroupTextLines
        .filter((t) => t.startsWith("f "))
        .map((faceText) => {
          const values = faceText.split(" ");
          const faceVertexes = values
            .slice(1)
            .map((word) => new FaceVertex(word));
          return new Face(faceVertexes[0], faceVertexes[1], faceVertexes[2]);
        });
      return new Group(faces, material);
    }
  );
  return new Obj(vertexesInfo, groups);
}

/**
 * @param {Obj} obj
 */
export function createGLObjects(obj) {
  /** @type {Array<number>} */
  const pv = [];
  /** @type {Array<number>} */
  const nv = [];
  /** @type {Array<number>} */
  const faces = [];

  let pIndex = 0;
  // TODO: マテリアルの設定も反映する
  for (const facesWithMaterial of obj.groups) {
    for (const face of facesWithMaterial.faces) {
        const v1 = obj.vertexesInfo.vertexes[face.v1.vertexIndex];
        const v2 = obj.vertexesInfo.vertexes[face.v2.vertexIndex];
        const v3 = obj.vertexesInfo.vertexes[face.v3.vertexIndex];
        pv.push(...v1.toArray(), ...v2.toArray(), ...v3.toArray());
        const n1 = obj.vertexesInfo.normalVecs[face.v1.normalVecIndex] ?? v1;
        const n2 = obj.vertexesInfo.normalVecs[face.v2.normalVecIndex] ?? v2;
        const n3 = obj.vertexesInfo.normalVecs[face.v3.normalVecIndex] ?? v3;
        nv.push(...n1.toArray(), ...n2.toArray(), ...n3.toArray());
        faces.push(pIndex++, pIndex++, pIndex++);
    }
  }
  return {
    pv: new Float32Array(pv),
    nv: new Float32Array(nv),
    faces: new Uint16Array(faces),
  };
}
