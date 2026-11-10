import fs from 'node:fs';
import { createHash } from 'node:crypto';

const models = [
  { path: 'public/models/jyc-spatial.glb', size: 876764, gitBlobSha: 'de110e2ac5a9fc5349918959df20597da3e3a830' },
  { path: 'public/models/1780947277181-w2z6yhqv.glb', size: 2660588, gitBlobSha: 'd80b87e699ae517b9e29d7b0814e5ed5dabc08b2' }
];
const errors = [];
const list = value => Array.isArray(value) ? value : [];
const fail = (file, message) => errors.push(`${file}: ${message}`);
const botSource = fs.readFileSync('src/jyc-bot.jsx', 'utf8');
const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
const csp = (vercelConfig.headers || []).flatMap(entry => entry.headers || []).find(header => header.key === 'Content-Security-Policy')?.value || '';

const ref = (value, collection, label, file) => {
  if (!Number.isInteger(value) || value < 0 || value >= collection.length) fail(file, `${label} reference ${value} is out of range`);
};
const textureInfo = (info, textures, label, file) => {
  if (info && info.index !== undefined) ref(info.index, textures, label, file);
};

function inspectModel(model) {
  const file = model.path;
  if (!fs.existsSync(file)) {
    fail(file, 'required GLB asset is missing');
    return;
  }
  const bytes = fs.readFileSync(file);
  if (bytes.length !== model.size) fail(file, `expected ${model.size} bytes, received ${bytes.length}`);
  const gitBlobSha = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
  if (gitBlobSha !== model.gitBlobSha) fail(file, `Git blob integrity mismatch: ${gitBlobSha}`);
  if (bytes.length < 20 || bytes.toString('ascii', 0, 4) !== 'glTF') {
    fail(file, 'invalid or truncated GLB header');
    return;
  }
  const version = bytes.readUInt32LE(4);
  const declaredLength = bytes.readUInt32LE(8);
  if (version !== 2) fail(file, `GLB 2.0 required; found version ${version}`);
  if (declaredLength !== bytes.length) fail(file, `header length ${declaredLength} does not match file length ${bytes.length}`);

  let offset = 12;
  let json = null;
  let jsonChunks = 0;
  let binChunks = 0;
  let binLength = 0;
  const chunks = [];
  while (offset < bytes.length) {
    if (offset + 8 > bytes.length) {
      fail(file, 'truncated chunk header');
      break;
    }
    const chunkLength = bytes.readUInt32LE(offset);
    const chunkType = bytes.readUInt32LE(offset + 4);
    const chunkStart = offset + 8;
    const chunkEnd = chunkStart + chunkLength;
    if (chunkLength % 4 !== 0) fail(file, `chunk at ${offset} is not 4-byte aligned`);
    if (chunkEnd > bytes.length) {
      fail(file, `chunk at ${offset} exceeds the GLB boundary`);
      break;
    }
    chunks.push(chunkType);
    if (chunks.length === 1 && chunkType !== 0x4e4f534a) fail(file, 'JSON must be the first GLB chunk');
    if (chunkType === 0x4e4f534a) {
      jsonChunks++;
      try {
        json = JSON.parse(bytes.subarray(chunkStart, chunkEnd).toString('utf8').replace(/\0+$/g, '').trim());
      } catch (error) {
        fail(file, `invalid glTF JSON chunk: ${error.message}`);
      }
    } else if (chunkType === 0x004e4942) {
      binChunks++;
      binLength = chunkLength;
    }
    offset = chunkEnd;
  }
  if (offset !== bytes.length) fail(file, 'chunk parsing did not end at the declared file length');
  if (jsonChunks !== 1) fail(file, `expected one JSON chunk, found ${jsonChunks}`);
  if (binChunks > 1) fail(file, `expected at most one BIN chunk, found ${binChunks}`);
  if (!json) return;

  if (json.asset?.version !== '2.0') fail(file, 'asset.version must be 2.0');
  const used = list(json.extensionsUsed);
  const required = list(json.extensionsRequired);
  for (const extension of required) if (!used.includes(extension)) fail(file, `required extension ${extension} is absent from extensionsUsed`);

  const buffers = list(json.buffers);
  const views = list(json.bufferViews);
  const accessors = list(json.accessors);
  const meshes = list(json.meshes);
  const nodes = list(json.nodes);
  const scenes = list(json.scenes);
  const materials = list(json.materials);
  const images = list(json.images);
  const textures = list(json.textures);
  const cameras = list(json.cameras);
  const skins = list(json.skins);
  const animations = list(json.animations);
  if (buffers.length > 1) fail(file, 'self-contained GLB must not declare multiple buffers');
  if (buffers.some(buffer => buffer.uri)) fail(file, 'GLB buffer must be embedded in the BIN chunk');
  for (const [index, buffer] of buffers.entries()) {
    if (buffer.byteLength > binLength) fail(file, `buffer ${index} exceeds BIN chunk length`);
    if (binLength - buffer.byteLength > 3) fail(file, `buffer ${index} has unexpected BIN padding`);
  }

  for (const [index, view] of views.entries()) {
    ref(view.buffer, buffers, `bufferView ${index} buffer`, file);
    if (!Number.isInteger(view.byteLength) || view.byteLength < 0) fail(file, `bufferView ${index} has invalid byteLength`);
    const buffer = buffers[view.buffer];
    if (buffer && (view.byteOffset || 0) + view.byteLength > buffer.byteLength) fail(file, `bufferView ${index} exceeds its buffer`);
    if (view.byteStride !== undefined && (view.byteStride < 4 || view.byteStride > 252 || view.byteStride % 4 !== 0)) fail(file, `bufferView ${index} has invalid byteStride`);
  }

  const componentBytes = { 5120: 1, 5121: 1, 5122: 2, 5123: 2, 5125: 4, 5126: 4 };
  const componentCount = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT2: 4, MAT3: 9, MAT4: 16 };
  for (const [index, accessor] of accessors.entries()) {
    if (!componentBytes[accessor.componentType]) fail(file, `accessor ${index} has invalid componentType`);
    if (!componentCount[accessor.type]) fail(file, `accessor ${index} has invalid type`);
    if (!Number.isInteger(accessor.count) || accessor.count < 0) fail(file, `accessor ${index} has invalid count`);
    if (accessor.bufferView !== undefined) {
      ref(accessor.bufferView, views, `accessor ${index} bufferView`, file);
      const view = views[accessor.bufferView];
      const bytesPerElement = componentBytes[accessor.componentType] * componentCount[accessor.type];
      if (view && bytesPerElement && (accessor.byteOffset || 0) + accessor.count * bytesPerElement > view.byteLength && !accessor.sparse) {
        fail(file, `accessor ${index} exceeds its bufferView`);
      }
    } else if (accessor.byteOffset !== undefined) {
      // glTF 2.0 permits accessors without a bufferView: their base values are
      // zero-initialized, and extensions such as KHR_draco_mesh_compression
      // may supply the actual decoded geometry. byteOffset is forbidden
      // when bufferView is omitted.
      fail(file, `accessor ${index} defines byteOffset without a bufferView`);
    }
  }

  for (const [meshIndex, mesh] of meshes.entries()) {
    for (const [primitiveIndex, primitive] of list(mesh.primitives).entries()) {
      for (const [attribute, accessor] of Object.entries(primitive.attributes || {})) ref(accessor, accessors, `mesh ${meshIndex} primitive ${primitiveIndex} attribute ${attribute}`, file);
      if (primitive.indices !== undefined) ref(primitive.indices, accessors, `mesh ${meshIndex} primitive ${primitiveIndex} indices`, file);
      if (primitive.material !== undefined) ref(primitive.material, materials, `mesh ${meshIndex} primitive ${primitiveIndex} material`, file);
      const draco = primitive.extensions?.KHR_draco_mesh_compression;
      if (draco) {
        if (!used.includes('KHR_draco_mesh_compression')) fail(file, 'Draco primitive extension is not declared in extensionsUsed');
        ref(draco.bufferView, views, `mesh ${meshIndex} Draco bufferView`, file);
      }
    }
  }

  for (const [index, node] of nodes.entries()) {
    if (node.mesh !== undefined) ref(node.mesh, meshes, `node ${index} mesh`, file);
    if (node.camera !== undefined) ref(node.camera, cameras, `node ${index} camera`, file);
    if (node.skin !== undefined) ref(node.skin, skins, `node ${index} skin`, file);
    for (const child of list(node.children)) ref(child, nodes, `node ${index} child`, file);
  }
  for (const [index, scene] of scenes.entries()) for (const node of list(scene.nodes)) ref(node, nodes, `scene ${index} node`, file);
  if (json.scene !== undefined) ref(json.scene, scenes, 'default scene', file);
  for (const [index, skin] of skins.entries()) {
    for (const joint of list(skin.joints)) ref(joint, nodes, `skin ${index} joint`, file);
    if (skin.skeleton !== undefined) ref(skin.skeleton, nodes, `skin ${index} skeleton`, file);
  }
  for (const [index, image] of images.entries()) {
    if (image.bufferView !== undefined) ref(image.bufferView, views, `image ${index} bufferView`, file);
    if (image.bufferView !== undefined && !image.mimeType) fail(file, `image ${index} embedded image is missing mimeType`);
  }
  for (const [index, texture] of textures.entries()) {
    if (texture.source !== undefined) ref(texture.source, images, `texture ${index} source`, file);
  }
  for (const [index, material] of materials.entries()) {
    const pbr = material.pbrMetallicRoughness || {};
    textureInfo(pbr.baseColorTexture, textures, `material ${index} baseColorTexture`, file);
    textureInfo(pbr.metallicRoughnessTexture, textures, `material ${index} metallicRoughnessTexture`, file);
    textureInfo(material.normalTexture, textures, `material ${index} normalTexture`, file);
    textureInfo(material.occlusionTexture, textures, `material ${index} occlusionTexture`, file);
    textureInfo(material.emissiveTexture, textures, `material ${index} emissiveTexture`, file);
  }
  for (const [animationIndex, animation] of animations.entries()) {
    for (const [samplerIndex, sampler] of list(animation.samplers).entries()) {
      ref(sampler.input, accessors, `animation ${animationIndex} sampler ${samplerIndex} input`, file);
      ref(sampler.output, accessors, `animation ${animationIndex} sampler ${samplerIndex} output`, file);
    }
    for (const [channelIndex, channel] of list(animation.channels).entries()) {
      ref(channel.sampler, list(animation.samplers), `animation ${animationIndex} channel ${channelIndex} sampler`, file);
      if (channel.target?.node !== undefined) ref(channel.target.node, nodes, `animation ${animationIndex} channel ${channelIndex} node`, file);
    }
  }

  if (!errors.some(message => message.startsWith(file + ':'))) {
    console.log(`PASS: ${file} — GLB 2.0, ${bytes.length.toLocaleString('en-US')} bytes, ${scenes.length} scene(s), ${nodes.length} node(s), ${meshes.length} mesh(es), ${accessors.length} accessor(s)`);
  }
}

if (!botSource.includes("https://ajax.googleapis.com/ajax/libs/model-viewer/4.4.0/model-viewer.min.js")) fail('model-viewer', 'The assistant must lazy-load the pinned Google model-viewer web component.');
if (!botSource.includes('src="/models/jyc-spatial.glb"') || !botSource.includes('poster="/assets/jyc-logo-48.avif"')) fail('model-viewer', 'The assistant viewer must point to the validated GLB and its existing poster asset.');
if (!botSource.includes('disable-zoom disable-pan') || !botSource.includes("'(pointer: coarse)'") || !botSource.includes("'(prefers-reduced-motion: reduce)'") || !botSource.includes('navigator.connection?.saveData')) fail('model-viewer', 'The assistant viewer must avoid touch/reduced-motion/save-data devices and preserve page navigation.');
if (!csp.includes('https://ajax.googleapis.com') || !csp.includes('https://www.gstatic.com') || !csp.includes("'wasm-unsafe-eval'")) fail('model-viewer', 'CSP must permit the pinned viewer, Draco decoder resources and WebAssembly compilation.');

for (const model of models) inspectModel(model);
if (errors.length) {
  errors.forEach(message => console.error('FAIL:', message));
  process.exit(1);
}
console.log(`GLB integrity contract: PASS (${models.length} binary assets)`);
