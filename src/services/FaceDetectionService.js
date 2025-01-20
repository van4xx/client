import * as faceapi from 'face-api.js';

class FaceDetectionService {
  constructor() {
    this.isModelLoaded = false;
    this.lastFaceCheck = Date.now();
    this.faceCheckInterval = 0.1 * 60 * 1000; // 0.1 минуты
    this.activeMask = null;
    this.canvas = null;
  }

  async loadModels() {
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models')
      ]);
      this.isModelLoaded = true;
      console.log('Модели загружены успешно');
    } catch (error) {
      console.error('Ошибка загрузки моделей:', error);
    }
  }

  async detectFace(videoElement) {
    if (!this.isModelLoaded) {
      console.warn('Модели не загружены');
      return null;
    }

    try {
      const detection = await faceapi.detectSingleFace(
        videoElement,
        new faceapi.TinyFaceDetectorOptions()
      ).withFaceLandmarks();

      return detection;
    } catch (error) {
      console.error('Ошибка при определении лица:', error);
      return null;
    }
  }

  async checkFacePresence(videoElement) {
    const now = Date.now();
    if (now - this.lastFaceCheck < this.faceCheckInterval) {
      return true;
    }

    const detection = await this.detectFace(videoElement);
    this.lastFaceCheck = now;

    return !!detection;
  }

  initCanvas(videoElement) {
    if (!this.canvas) {
      this.canvas = faceapi.createCanvasFromMedia(videoElement);
      this.canvas.style.position = 'absolute';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      videoElement.parentNode.appendChild(this.canvas);
    }
    
    this.canvas.width = videoElement.videoWidth;
    this.canvas.height = videoElement.videoHeight;
  }

  async applyMask(videoElement, maskId) {
    if (!this.isModelLoaded) return;

    this.activeMask = maskId;
    this.initCanvas(videoElement);

    const mask = new Image();
    mask.src = `/masks/${maskId}.png`;

    const drawMask = async () => {
      if (!this.activeMask || this.activeMask !== maskId) return;

      const detection = await this.detectFace(videoElement);
      if (detection) {
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Получаем точки лица
        const landmarks = detection.landmarks;
        const jawline = landmarks.getJawOutline();
        const nose = landmarks.getNose();
        
        // Вычисляем размер и позицию маски
        const maskWidth = jawline[16].x - jawline[0].x;
        const maskHeight = (nose[6].y - jawline[0].y) * 1.5;
        const maskX = jawline[0].x;
        const maskY = jawline[0].y - maskHeight * 0.3;

        // Рисуем маску
        ctx.drawImage(mask, maskX, maskY, maskWidth, maskHeight);
      }

      if (this.activeMask === maskId) {
        requestAnimationFrame(drawMask);
      }
    };

    mask.onload = () => {
      drawMask();
    };
  }

  removeMask() {
    this.activeMask = null;
    if (this.canvas) {
      const ctx = this.canvas.getContext('2d');
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  destroy() {
    this.removeMask();
    if (this.canvas) {
      this.canvas.remove();
      this.canvas = null;
    }
  }
}

export default new FaceDetectionService(); 