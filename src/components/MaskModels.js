import * as THREE from 'three';

export const createMaskModel = (type) => {
  const maskGeometry = getMaskGeometry(type);
  const maskMaterial = getMaskMaterial(type);
  return new THREE.Mesh(maskGeometry, maskMaterial);
};

const getMaskGeometry = (type) => {
  switch (type) {
    case 'fox':
      return new THREE.Group()
        .add(createEars())
        .add(createSnout())
        .add(createNose());
    
    case 'cat':
      return new THREE.Group()
        .add(createPointyEars())
        .add(createCatSnout())
        .add(createWhiskers());
    
    case 'dog':
      return new THREE.Group()
        .add(createFlopEars())
        .add(createDogSnout())
        .add(createDogNose());
    
    case 'robot':
      return new THREE.Group()
        .add(createRobotHead())
        .add(createAntennas())
        .add(createLEDEyes());
    
    case 'alien':
      return new THREE.Group()
        .add(createAlienHead())
        .add(createBigEyes())
        .add(createAntennae());
    
    case 'dragon':
      return new THREE.Group()
        .add(createHorns())
        .add(createScales())
        .add(createDragonSnout());
    
    case 'demon':
      return new THREE.Group()
        .add(createDemonHorns())
        .add(createDemonEyes())
        .add(createFangs());
    
    case 'cyborg':
      return new THREE.Group()
        .add(createCyberParts())
        .add(createWires())
        .add(createLenses());
    
    case 'samurai':
      return new THREE.Group()
        .add(createHelmet())
        .add(createMaskPlate())
        .add(createDecoration());
    
    case 'clown':
      return new THREE.Group()
        .add(createClownNose())
        .add(createClownHair())
        .add(createMakeup());
    
    default:
      return new THREE.BoxGeometry(1, 1, 1);
  }
};

const getMaskMaterial = (type) => {
  switch (type) {
    case 'fox':
      return new THREE.MeshPhongMaterial({
        color: 0xff6600,
        shininess: 30,
        specular: 0x111111
      });
    
    case 'cat':
      return new THREE.MeshPhongMaterial({
        color: 0x333333,
        shininess: 50,
        specular: 0x222222
      });
    
    case 'dog':
      return new THREE.MeshPhongMaterial({
        color: 0x8B4513,
        shininess: 20,
        specular: 0x111111
      });
    
    case 'robot':
      return new THREE.MeshStandardMaterial({
        color: 0x888888,
        metalness: 0.8,
        roughness: 0.2
      });
    
    case 'alien':
      return new THREE.MeshPhongMaterial({
        color: 0x00ff00,
        shininess: 100,
        specular: 0x00ff00,
        opacity: 0.8,
        transparent: true
      });
    
    case 'dragon':
      return new THREE.MeshStandardMaterial({
        color: 0x8B0000,
        roughness: 0.7,
        metalness: 0.3
      });
    
    case 'demon':
      return new THREE.MeshPhongMaterial({
        color: 0x000000,
        shininess: 100,
        specular: 0xff0000,
        emissive: 0x330000
      });
    
    case 'cyborg':
      return new THREE.MeshStandardMaterial({
        color: 0x444444,
        metalness: 1,
        roughness: 0.1,
        envMapIntensity: 1
      });
    
    case 'samurai':
      return new THREE.MeshPhongMaterial({
        color: 0x222222,
        shininess: 80,
        specular: 0x666666
      });
    
    case 'clown':
      return new THREE.MeshPhongMaterial({
        color: 0xff0000,
        shininess: 30,
        specular: 0xffffff
      });
    
    default:
      return new THREE.MeshBasicMaterial({ color: 0xffffff });
  }
};

// Вспомогательные функции для создания частей масок
const createEars = () => {
  const ears = new THREE.Group();
  const earGeometry = new THREE.ConeGeometry(0.2, 0.4, 32);
  const leftEar = new THREE.Mesh(earGeometry, new THREE.MeshPhongMaterial({ color: 0xff6600 }));
  const rightEar = leftEar.clone();
  
  leftEar.position.set(-0.3, 0.5, 0);
  rightEar.position.set(0.3, 0.5, 0);
  
  ears.add(leftEar);
  ears.add(rightEar);
  return ears;
};

const createSnout = () => {
  const snout = new THREE.Group();
  const snoutGeometry = new THREE.ConeGeometry(0.15, 0.3, 32);
  const snoutMesh = new THREE.Mesh(snoutGeometry, new THREE.MeshPhongMaterial({ color: 0xffffff }));
  snoutMesh.rotation.x = Math.PI / 2;
  snoutMesh.position.set(0, 0, 0.2);
  snout.add(snoutMesh);
  return snout;
};

// Аналогичные функции для других частей масок...
// Здесь будут реализованы все остальные вспомогательные функции,
// такие как createPointyEars(), createCatSnout(), createWhiskers() и т.д.

export const updateMaskPosition = (mask, landmarks) => {
  if (!mask || !landmarks) return;

  const nose = landmarks.getNose();
  const leftEye = landmarks.getLeftEye();
  const rightEye = landmarks.getRightEye();

  // Вычисляем центр и ориентацию маски
  const center = nose[3];
  const angle = Math.atan2(
    rightEye[0].y - leftEye[0].y,
    rightEye[0].x - leftEye[0].x
  );

  // Обновляем позицию и поворот маски
  mask.position.set(
    (center.x - window.innerWidth / 2) * 0.01,
    -(center.y - window.innerHeight / 2) * 0.01,
    0
  );
  mask.rotation.z = angle;

  // Масштабируем маску в зависимости от размера лица
  const faceWidth = Math.abs(rightEye[3].x - leftEye[3].x);
  const scale = faceWidth * 0.01;
  mask.scale.set(scale, scale, scale);
}; 