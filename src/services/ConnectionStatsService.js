class ConnectionStatsService {
  constructor() {
    this.stats = {
      bitrate: 0,
      packetsLost: 0,
      roundTripTime: 0,
      jitter: 0,
      resolution: { width: 0, height: 0 }
    };
  }

  async getStats(peerConnection) {
    if (!peerConnection) return this.stats;

    try {
      const stats = await peerConnection.getStats();
      
      stats.forEach(report => {
        if (report.type === 'inbound-rtp' && report.kind === 'video') {
          const now = report.timestamp;
          const bytes = report.bytesReceived;
          const packets = report.packetsLost;
          
          if (this.lastResult && this.lastResult.has(report.id)) {
            const lastReport = this.lastResult.get(report.id);
            const timeDiff = now - lastReport.timestamp;
            const bitrate = 8 * (bytes - lastReport.bytesReceived) / timeDiff;
            
            this.stats.bitrate = Math.round(bitrate);
            this.stats.packetsLost = packets;
          }
        }
        
        if (report.type === 'track' && report.kind === 'video') {
          this.stats.resolution = {
            width: report.frameWidth,
            height: report.frameHeight
          };
        }

        if (report.type === 'remote-inbound-rtp') {
          this.stats.roundTripTime = report.roundTripTime;
          this.stats.jitter = report.jitter;
        }
      });

      this.lastResult = stats;
      return this.stats;
    } catch (error) {
      console.error('Error getting connection stats:', error);
      return this.stats;
    }
  }

  getConnectionQuality() {
    const { bitrate, packetsLost, roundTripTime } = this.stats;
    
    if (bitrate < 100000 || packetsLost > 50 || roundTripTime > 1000) {
      return 'poor';
    } else if (bitrate < 500000 || packetsLost > 10 || roundTripTime > 300) {
      return 'fair';
    } else {
      return 'good';
    }
  }
}

const connectionStatsService = new ConnectionStatsService();
export default connectionStatsService; 