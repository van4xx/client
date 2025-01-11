class VideoQualityService {
  constructor() {
    this.qualityLevels = {
      high: { width: 1280, height: 720, frameRate: 30, bitrate: 2500000 },
      medium: { width: 854, height: 480, frameRate: 25, bitrate: 1000000 },
      low: { width: 640, height: 360, frameRate: 20, bitrate: 500000 }
    };
    
    this.currentQuality = 'high';
  }

  async adjustQuality(producer, connectionStats) {
    if (!producer) return;

    const quality = connectionStats.getConnectionQuality();
    let newQuality = this.currentQuality;

    if (quality === 'poor' && this.currentQuality !== 'low') {
      newQuality = 'low';
    } else if (quality === 'fair' && this.currentQuality === 'high') {
      newQuality = 'medium';
    } else if (quality === 'good' && this.currentQuality !== 'high') {
      newQuality = 'high';
    }

    if (newQuality !== this.currentQuality) {
      const params = this.qualityLevels[newQuality];
      await this.applyQualityParams(producer, params);
      this.currentQuality = newQuality;
    }
  }

  async applyQualityParams(producer, params) {
    try {
      await producer.setMaxSpatialLayer(this.getLayerFromQuality(params));
      await producer.setRtpEncodingParameters({
        maxBitrate: params.bitrate,
        maxFramerate: params.frameRate
      });
    } catch (error) {
      console.error('Error applying quality params:', error);
    }
  }

  getLayerFromQuality(params) {
    if (params.height >= 720) return 2;
    if (params.height >= 480) return 1;
    return 0;
  }
}

const videoQualityService = new VideoQualityService();
export default videoQualityService; 