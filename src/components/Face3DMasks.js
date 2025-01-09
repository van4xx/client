import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as faceapi from 'face-api.js';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import './Face3DMasks.css';

const Face3DMasks = ({ videoRef, activeFilter }) => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const maskRef = useRef(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoSize, setVideoSize] = useState({ width: 640, height: 480 });
  const [isSceneInitialized, setIsSceneInitialized] = useState(false);

  const masks = {
    none: null,
    fox: '/models/fox_mask.glb',
    cat: '/models/cat_mask.glb',
    dog: '/models/dog_mask.glb',
    robot: '/models/robot_mask.glb',
    alien: '/models/alien_mask.glb',
    dragon: '/models/dragon_mask.glb',
    demon: '/models/demon_mask.glb',
    cyborg: '/models/cyborg_mask.glb',
    samurai: '/models/samurai_mask.glb',
    clown: '/models/clown_mask.glb',
  };

  // Добавляем обработчик изменения размеров видео
  useEffect(() => {
    const handleVideoMetadata = () => {
      if (videoRef.current) {
        setVideoSize({
          width: videoRef.current.videoWidth || 640,
          height: videoRef.current.videoHeight || 480
        });
      }
    };

    if (videoRef.current) {
      videoRef.current.addEventListener('loadedmetadata', handleVideoMetadata);
      // Если видео уже загружено
      if (videoRef.current.videoWidth) {
        handleVideoMetadata();
      }
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('loadedmetadata', handleVideoMetadata);
      }
    };
  }, [videoRef]);

  // Инициализация Three.js
  useEffect(() => {
    const initScene = () => {
      if (!canvasRef.current) return false;

      try {
        // Настройка Three.js
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(
          75,
          videoSize.width / videoSize.height,
          0.1,
          1000
        );
        camera.position.z = 5;
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({
          canvas: canvasRef.current,
          alpha: true,
          antialias: true
        });
        renderer.setSize(videoSize.width, videoSize.height);
        rendererRef.current = renderer;

        // Добавление освещения
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 1, 2);
        scene.add(directionalLight);

        return true;
      } catch (err) {
        console.error('Error initializing Three.js:', err);
        setError('Failed to initialize 3D renderer');
        return false;
      }
    };

    const success = initScene();
    setIsSceneInitialized(success);

    // Очистка при размонтировании
    return () => {
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (sceneRef.current) {
        while(sceneRef.current.children.length > 0) { 
          sceneRef.current.remove(sceneRef.current.children[0]); 
        }
      }
    };
  }, [videoSize]);

  // Инициализация моделей распознавания лица
  useEffect(() => {
    const initFaceAPI = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Настройка TensorFlow.js
        await tf.ready();
        await tf.setBackend('webgl');
        
        // Загрузка моделей для распознавания лица
        const MODEL_URL = `${process.env.PUBLIC_URL}/models`;

        // Инициализируем faceapi с нужными параметрами
        await faceapi.env.monkeyPatch({
          Canvas: HTMLCanvasElement,
          Image: HTMLImageElement,
          ImageData: ImageData,
          Video: HTMLVideoElement,
          createCanvasElement: () => document.createElement('canvas'),
          createImageElement: () => document.createElement('img')
        });

        // Загружаем модели последовательно
        await faceapi.nets.tinyFaceDetector.load(MODEL_URL);
        console.log('TinyFaceDetector loaded');
        
        await faceapi.nets.faceLandmark68Net.load(MODEL_URL);
        console.log('FaceLandmark68Net loaded');
        
        await faceapi.nets.faceRecognitionNet.load(MODEL_URL);
        console.log('FaceRecognitionNet loaded');

        setIsModelLoaded(true);
        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing Face3DMasks:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    initFaceAPI();
  }, []);

  // Загрузка и обновление 3D маски
  useEffect(() => {
    if (!isModelLoaded || !isSceneInitialized || !masks[activeFilter] || !sceneRef.current) {
      console.log('Not ready to load mask:', {
        isModelLoaded,
        isSceneInitialized,
        hasMaskPath: !!masks[activeFilter],
        hasScene: !!sceneRef.current
      });
      return;
    }

    console.log('Loading mask:', activeFilter);
    console.log('Mask path:', masks[activeFilter]);

    const loader = new GLTFLoader();
    
    loader.load(
      masks[activeFilter],
      (gltf) => {
        console.log('Mask loaded successfully:', activeFilter);

        if (maskRef.current && sceneRef.current) {
          console.log('Removing old mask');
          sceneRef.current.remove(maskRef.current);
          maskRef.current = null;
        }

        const mask = gltf.scene;
        console.log('Mask scene:', mask);
        
        // Настраиваем позицию и ориентацию маски
        mask.position.set(0, 0, 0);
        mask.rotation.set(0, Math.PI, 0);
        
        // Устанавливаем начальный масштаб
        const initialScale = 0.1;
        mask.scale.set(initialScale, initialScale, initialScale);
        
        // Оптимизация и настройка материалов
        mask.traverse((node) => {
          if (node.isMesh) {
            node.frustumCulled = true;
            node.castShadow = false;
            node.receiveShadow = false;
            
            if (node.material) {
              node.material.transparent = true;
              node.material.opacity = 1;
              node.material.side = THREE.DoubleSide;
              node.material.depthTest = true;
              node.material.needsUpdate = true;
            }
          }
        });

        if (sceneRef.current) {
          sceneRef.current.add(mask);
          maskRef.current = mask;
          
          // Принудительно обновляем рендер
          if (rendererRef.current && cameraRef.current) {
            rendererRef.current.render(sceneRef.current, cameraRef.current);
          }
          console.log('Mask added to scene');
        } else {
          console.error('Scene is null when trying to add mask');
        }
      },
      (progress) => {
        const percentage = (progress.loaded / progress.total) * 100;
        console.log(`Loading mask ${activeFilter}: ${percentage.toFixed(2)}%`);
      },
      (error) => {
        console.error('Error loading mask:', error);
        setError(`Failed to load mask model ${activeFilter}: ${error.message}`);
      }
    );

    return () => {
      if (maskRef.current && sceneRef.current) {
        sceneRef.current.remove(maskRef.current);
        maskRef.current = null;
      }
    };
  }, [activeFilter, isModelLoaded, isSceneInitialized]);

  // Обновляем функцию отслеживания лица
  useEffect(() => {
    if (!isModelLoaded || !videoRef.current || !maskRef.current) {
      console.log('Face tracking not ready:', { 
        isModelLoaded, 
        hasVideo: !!videoRef.current, 
        hasMask: !!maskRef.current 
      });
      return;
    }

    let animationFrameId;

    const detectFace = async () => {
      try {
        if (!videoRef.current || videoRef.current.readyState !== 4) {
          return;
        }

        const videoCanvas = document.createElement('canvas');
        videoCanvas.width = videoSize.width;
        videoCanvas.height = videoSize.height;
        const ctx = videoCanvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, videoSize.width, videoSize.height);

        const detections = await faceapi
          .detectAllFaces(
            videoCanvas,
            new faceapi.TinyFaceDetectorOptions({
              inputSize: 416,
              scoreThreshold: 0.5
            })
          )
          .withFaceLandmarks();

        if (detections.length > 0) {
          const face = detections[0];
          const { landmarks } = face;
          
          if (maskRef.current) {
            const nose = landmarks.getNose();
            const leftEye = landmarks.getLeftEye();
            const rightEye = landmarks.getRightEye();

            const center = nose[3];
            const angle = Math.atan2(
              rightEye[0].y - leftEye[0].y,
              rightEye[0].x - leftEye[0].x
            );

            // Настраиваем масштаб и позицию маски
            const faceWidth = Math.abs(rightEye[3].x - leftEye[3].x);
            const scale = faceWidth * 0.01; // Масштаб зависит от размера лица

            maskRef.current.position.set(
              (center.x - videoSize.width / 2) * 0.008,
              -(center.y - videoSize.height / 2) * 0.008,
              0
            );

            maskRef.current.rotation.z = angle;
            maskRef.current.scale.set(scale, scale, scale);

            // Принудительно обновляем рендер
            if (rendererRef.current && sceneRef.current && cameraRef.current) {
              rendererRef.current.render(sceneRef.current, cameraRef.current);
            }
          }
        }

        animationFrameId = requestAnimationFrame(detectFace);
      } catch (err) {
        console.error('Error in face detection:', err);
        setError('Face detection failed');
      }
    };

    console.log('Starting face detection');
    detectFace();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isModelLoaded, videoRef, videoSize]);

  if (error) {
    return (
      <div className="face-3d-mask-error">
        Error: {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="face-3d-mask-loading">
        Loading face detection models...
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="face-3d-mask-canvas"
      width={videoSize.width}
      height={videoSize.height}
    />
  );
};

export default Face3DMasks; 