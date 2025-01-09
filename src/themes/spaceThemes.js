const spaceThemes = {
  day: {
    background: 'linear-gradient(to bottom, #0288d1, #29b6f6, #81d4fa, #b3e5fc)',
    stars: {
      count: 50,
      color: '#ffd700',
      size: { min: 2, max: 4 },
      twinkleSpeed: { min: 3, max: 5 },
    },
    planets: [
      {
        size: 180,
        color: 'radial-gradient(circle at 30% 30%, #ffd700, #ffa000)',
        orbitRadius: 300,
        orbitSpeed: 35,
        glowColor: 'rgba(255, 215, 0, 0.4)',
        rings: true,
        ringsColor: 'rgba(255, 215, 0, 0.2)',
        satellites: [
          { size: 25, orbitRadius: 200, orbitSpeed: 8, color: '#ffd740' }
        ]
      },
      {
        size: 120,
        color: 'radial-gradient(circle at 40% 40%, #64ffda, #00bfa5)',
        orbitRadius: 500,
        orbitSpeed: 30,
        glowColor: 'rgba(0, 191, 165, 0.3)'
      }
    ],
    comets: {
      count: 3,
      tailLength: 150,
      color: '#40c4ff',
      speed: { min: 14, max: 14 }
    },
    ufos: {
      count: 3,
      emoji: '🛸',
      size: 30,
      speed: { min: 0.15, max: 0.3 }
    },
    nebulas: [
      {
        size: 400,
        color: 'rgba(0, 191, 165, 0.1)',
        position: { x: '20%', y: '30%' }
      },
      {
        size: 350,
        color: 'rgba(255, 64, 129, 0.08)',
        position: { x: '70%', y: '60%' }
      }
    ],
    shootingStars: {
      count: 2,
      tailLength: 150,
      color: '#ffd700',
      speed: { min: 14, max: 14 }
    }
  },
  night: {
    background: 'linear-gradient(to bottom, #000000, #1a237e, #311b92, #4a148c)',
    stars: {
      count: 150,
      color: '#ffffff',
      size: { min: 2, max: 4 },
      twinkleSpeed: { min: 3, max: 5 },
    },
    planets: [
      {
        size: 150,
        color: 'radial-gradient(circle at 35% 35%, #9575cd, #7e57c2)',
        orbitRadius: 350,
        orbitSpeed: 40,
        rings: true,
        ringsColor: 'rgba(126, 87, 194, 0.3)',
        glowColor: 'rgba(126, 87, 194, 0.4)',
        satellites: [
          { size: 35, orbitRadius: 190, orbitSpeed: 8, color: '#b39ddb' }
        ]
      },
      {
        size: 110,
        color: 'radial-gradient(circle at 40% 40%, #90caf9, #42a5f5)',
        orbitRadius: 550,
        orbitSpeed: 32,
        glowColor: 'rgba(25, 118, 210, 0.4)'
      }
    ],
    comets: {
      count: 6,
      tailLength: 180,
      color: '#18ffff',
      speed: { min: 14, max: 14 }
    },
    nebulas: [
      {
        size: 500,
        color: 'rgba(103, 58, 183, 0.1)',
        position: { x: '30%', y: '40%' }
      },
      {
        size: 450,
        color: 'rgba(3, 169, 244, 0.08)',
        position: { x: '80%', y: '20%' }
      }
    ],
    shootingStars: {
      count: 4,
      tailLength: 180,
      color: '#ffffff',
      speed: { min: 14, max: 14 }
    },
    ufos: {
      count: 3,
      emoji: '🛸',
      size: 35,
      speed: { min: 0.15, max: 0.3 }
    }
  }
};

export default spaceThemes; 