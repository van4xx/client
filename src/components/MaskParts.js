import * as THREE from 'three';

// Общие вспомогательные функции
const createBasicShape = (geometry, material, position = { x: 0, y: 0, z: 0 }, rotation = { x: 0, y: 0, z: 0 }) => {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(position.x, position.y, position.z);
  mesh.rotation.set(rotation.x, rotation.y, rotation.z);
  return mesh;
};

// Части для лисьей маски
export const createPointyEars = () => {
  const ears = new THREE.Group();
  const earGeometry = new THREE.ConeGeometry(0.15, 0.4, 32);
  const earMaterial = new THREE.MeshPhongMaterial({ color: 0xff6600 });
  
  const leftEar = createBasicShape(earGeometry, earMaterial, { x: -0.25, y: 0.4, z: 0 });
  const rightEar = createBasicShape(earGeometry, earMaterial, { x: 0.25, y: 0.4, z: 0 });
  
  ears.add(leftEar, rightEar);
  return ears;
};

export const createFoxSnout = () => {
  const snout = new THREE.Group();
  const snoutGeometry = new THREE.ConeGeometry(0.15, 0.3, 32);
  const snoutMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
  
  const mainSnout = createBasicShape(snoutGeometry, snoutMaterial, 
    { x: 0, y: 0, z: 0.2 }, 
    { x: Math.PI / 2, y: 0, z: 0 }
  );
  
  snout.add(mainSnout);
  return snout;
};

// Части для кошачьей маски
export const createCatEars = () => {
  const ears = new THREE.Group();
  const earGeometry = new THREE.ConeGeometry(0.12, 0.35, 32);
  const earMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
  
  const leftEar = createBasicShape(earGeometry, earMaterial, { x: -0.2, y: 0.35, z: 0 });
  const rightEar = createBasicShape(earGeometry, earMaterial, { x: 0.2, y: 0.35, z: 0 });
  
  ears.add(leftEar, rightEar);
  return ears;
};

export const createWhiskers = () => {
  const whiskers = new THREE.Group();
  const whiskerGeometry = new THREE.CylinderGeometry(0.005, 0.005, 0.3, 8);
  const whiskerMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  
  const positions = [
    { x: -0.2, y: 0, z: 0.1, ry: Math.PI / 4 },
    { x: -0.2, y: 0, z: 0, ry: 0 },
    { x: -0.2, y: 0, z: -0.1, ry: -Math.PI / 4 },
    { x: 0.2, y: 0, z: 0.1, ry: -Math.PI / 4 },
    { x: 0.2, y: 0, z: 0, ry: 0 },
    { x: 0.2, y: 0, z: -0.1, ry: Math.PI / 4 }
  ];
  
  positions.forEach(pos => {
    const whisker = createBasicShape(whiskerGeometry, whiskerMaterial, 
      { x: pos.x, y: pos.y, z: pos.z },
      { x: 0, y: pos.ry, z: Math.PI / 2 }
    );
    whiskers.add(whisker);
  });
  
  return whiskers;
};

// Части для маски робота
export const createRobotHead = () => {
  const head = new THREE.Group();
  const baseGeometry = new THREE.BoxGeometry(0.8, 1, 0.6);
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0x888888,
    metalness: 0.8,
    roughness: 0.2
  });
  
  const base = createBasicShape(baseGeometry, baseMaterial);
  head.add(base);
  
  // Добавляем детали
  const detailGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
  const detailMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    emissive: 0x00ff00,
    emissiveIntensity: 0.5
  });
  
  const positions = [
    { x: -0.2, y: 0.2, z: 0.3 },
    { x: 0.2, y: 0.2, z: 0.3 },
    { x: 0, y: -0.2, z: 0.3 }
  ];
  
  positions.forEach(pos => {
    const detail = createBasicShape(detailGeometry, detailMaterial, pos);
    head.add(detail);
  });
  
  return head;
};

// Части для маски пришельца
export const createAlienHead = () => {
  const head = new THREE.Group();
  const baseGeometry = new THREE.SphereGeometry(0.4, 32, 32);
  const baseMaterial = new THREE.MeshPhongMaterial({
    color: 0x00ff00,
    opacity: 0.8,
    transparent: true
  });
  
  const base = createBasicShape(baseGeometry, baseMaterial);
  head.add(base);
  
  return head;
};

export const createBigEyes = () => {
  const eyes = new THREE.Group();
  const eyeGeometry = new THREE.SphereGeometry(0.15, 32, 32);
  const eyeMaterial = new THREE.MeshPhongMaterial({
    color: 0x000000,
    specular: 0xffffff
  });
  
  const leftEye = createBasicShape(eyeGeometry, eyeMaterial, { x: -0.2, y: 0, z: 0.3 });
  const rightEye = createBasicShape(eyeGeometry, eyeMaterial, { x: 0.2, y: 0, z: 0.3 });
  
  eyes.add(leftEye, rightEye);
  return eyes;
};

// Части для маски демона
export const createDemonHorns = () => {
  const horns = new THREE.Group();
  const hornGeometry = new THREE.ConeGeometry(0.1, 0.4, 32);
  const hornMaterial = new THREE.MeshPhongMaterial({
    color: 0x000000,
    specular: 0xff0000
  });
  
  const leftHorn = createBasicShape(hornGeometry, hornMaterial, 
    { x: -0.2, y: 0.3, z: 0 },
    { x: 0, y: 0, z: -Math.PI / 6 }
  );
  
  const rightHorn = createBasicShape(hornGeometry, hornMaterial,
    { x: 0.2, y: 0.3, z: 0 },
    { x: 0, y: 0, z: Math.PI / 6 }
  );
  
  horns.add(leftHorn, rightHorn);
  return horns;
};

// Части для маски самурая
export const createHelmet = () => {
  const helmet = new THREE.Group();
  const baseGeometry = new THREE.SphereGeometry(0.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const baseMaterial = new THREE.MeshPhongMaterial({
    color: 0x222222,
    specular: 0x666666
  });
  
  const base = createBasicShape(baseGeometry, baseMaterial);
  helmet.add(base);
  
  // Добавляем декоративные элементы
  const decorGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.1);
  const decorMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
  
  const crest = createBasicShape(decorGeometry, decorMaterial, { x: 0, y: 0.4, z: 0 });
  helmet.add(crest);
  
  return helmet;
};

// Экспортируем все части
export const MaskParts = {
  createPointyEars,
  createFoxSnout,
  createCatEars,
  createWhiskers,
  createRobotHead,
  createAlienHead,
  createBigEyes,
  createDemonHorns,
  createHelmet
}; 