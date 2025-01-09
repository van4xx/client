import React, { useEffect, useRef, memo } from 'react';
import styled from 'styled-components';
import spaceThemes from '../themes/spaceThemes';

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.theme.background};
  transition: background 1s ease;
  overflow: hidden;
  z-index: -1;
`;

const SpaceContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
`;

const Star = styled.div`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: ${props => props.color};
  border-radius: 50%;
  animation: starTwinkle ${props => props.twinkleSpeed}s ease-in-out infinite;
  box-shadow: 0 0 ${props => props.size * 2}px ${props => props.color},
              0 0 ${props => props.size * 4}px ${props => props.color},
              0 0 ${props => props.size * 6}px ${props => props.color};
  will-change: transform, opacity, filter;
  transform: translateZ(0);

  @keyframes starTwinkle {
    0% { 
      opacity: 0.3;
      transform: scale(0.9);
      filter: brightness(0.8);
    }
    50% { 
      opacity: 1;
      transform: scale(1.1);
      filter: brightness(1.3);
    }
    100% { 
      opacity: 0.3;
      transform: scale(0.9);
      filter: brightness(0.8);
    }
  }
`;

const Planet = styled.div.attrs(props => ({
  'data-orbit-radius': props.orbitRadius,
  'data-orbit-speed': props.orbitSpeed,
  'data-rings': props.rings,
  'data-rings-color': props.ringsColor,
  'data-glow-color': props.glowColor,
  'data-tail-length': props.tailLength
}))`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: ${props => props.color};
  border-radius: 50%;
  box-shadow: 0 0 50px ${props => props.glowColor || props.color};
  animation: orbit ${props => props.orbitSpeed}s linear infinite;
  transform-origin: 50% 50%;
  will-change: transform;
  transform: translateZ(0);

  &::before {
    content: '';
    position: absolute;
    top: -10%;
    left: -10%;
    right: -10%;
    bottom: -10%;
    background: ${props => props.atmosphereColor || 'transparent'};
    border-radius: 50%;
    opacity: 0.3;
    animation: pulse 8s ease-in-out infinite;
    filter: blur(8px);
  }

  ${props => props.rings ? `
    &::after {
      content: '';
      position: absolute;
      width: 160%;
      height: 20px;
      background: ${props.ringsColor || 'rgba(255, 255, 255, 0.2)'};
      left: -30%;
      top: 50%;
      transform: translateY(-50%) rotate(75deg);
      border-radius: 50%;
      box-shadow: 0 0 30px ${props.ringsColor || 'rgba(255, 255, 255, 0.2)'};
      opacity: 0.7;
    }
  ` : ''}

  @keyframes orbit {
    from { transform: rotate(0deg) translateX(${props => props.orbitRadius}px) rotate(0deg); }
    to { transform: rotate(360deg) translateX(${props => props.orbitRadius}px) rotate(-360deg); }
  }

  @keyframes pulse {
    0% { transform: scale(1); opacity: 0.2; }
    50% { transform: scale(1.2); opacity: 0.4; }
    100% { transform: scale(1); opacity: 0.2; }
  }
`;

const Satellite = styled.div`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: ${props => props.color};
  border-radius: 50%;
  animation: orbit ${props => props.orbitSpeed}s linear infinite;
  transform-origin: 50% 50%;

  @keyframes orbit {
    from { transform: rotate(0deg) translateX(${props => props.orbitRadius}px) rotate(0deg); }
    to { transform: rotate(360deg) translateX(${props => props.orbitRadius}px) rotate(-360deg); }
  }
`;

const Nebula = styled.div`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: ${props => props.color};
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.6;
  left: ${props => props.position.x};
  top: ${props => props.position.y};
  animation: nebulaPulse 20s ease-in-out infinite;

  @keyframes nebulaPulse {
    0% { transform: scale(1); opacity: 0.4; }
    50% { transform: scale(1.1); opacity: 0.6; }
    100% { transform: scale(1); opacity: 0.4; }
  }
`;

const Comet = styled.div`
  position: fixed;
  width: 3px;
  height: 3px;
  background: ${props => props.color};
  border-radius: 50%;
  animation: cometMove ${props => props.speed}s linear infinite;
  animation-delay: ${props => props.delay}s;
  will-change: transform;
  transform: translateZ(0);
  opacity: 0;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: 0;
    width: ${props => props.tailLength}px;
    height: 2px;
    background: linear-gradient(to left, 
      ${props => props.color} 0%,
      ${props => props.color}80 30%,
      ${props => props.color}40 60%,
      ${props => props.color}00 100%
    );
    transform: translateY(-50%);
    border-radius: 100px;
  }

  @keyframes cometMove {
    0% {
      transform: translate(-5vw, -5vh) rotate(35deg);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translate(105vw, 105vh) rotate(35deg);
      opacity: 0;
    }
  }
`;

const UFO = styled.div`
  position: fixed;
  font-size: ${props => props.size}px;
  animation: ufoFloat${props => props.index} ${props => 12 / props.speed}s ease-in-out infinite;
  user-select: none;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
  will-change: transform;
  transform: translateZ(0);

  @keyframes ufoFloat1 {
    0% { transform: translate(0vw, 10vh) rotate(-5deg); }
    25% { transform: translate(30vw, 40vh) rotate(5deg); }
    50% { transform: translate(60vw, 20vh) rotate(-5deg); }
    75% { transform: translate(90vw, 50vh) rotate(5deg); }
    100% { transform: translate(0vw, 10vh) rotate(-5deg); }
  }

  @keyframes ufoFloat2 {
    0% { transform: translate(90vw, 80vh) rotate(5deg); }
    25% { transform: translate(60vw, 40vh) rotate(-5deg); }
    50% { transform: translate(30vw, 60vh) rotate(5deg); }
    75% { transform: translate(10vw, 20vh) rotate(-5deg); }
    100% { transform: translate(90vw, 80vh) rotate(5deg); }
  }

  @keyframes ufoFloat3 {
    0% { transform: translate(50vw, 0vh) rotate(-5deg); }
    25% { transform: translate(80vw, 30vh) rotate(5deg); }
    50% { transform: translate(40vw, 80vh) rotate(-5deg); }
    75% { transform: translate(20vw, 40vh) rotate(5deg); }
    100% { transform: translate(50vw, 0vh) rotate(-5deg); }
  }

  @keyframes ufoFloat4 {
    0% { transform: translate(20vw, 90vh) rotate(5deg); }
    25% { transform: translate(70vw, 60vh) rotate(-5deg); }
    50% { transform: translate(10vw, 30vh) rotate(5deg); }
    75% { transform: translate(90vw, 10vh) rotate(-5deg); }
    100% { transform: translate(20vw, 90vh) rotate(5deg); }
  }

  @keyframes ufoFloat5 {
    0% { transform: translate(40vw, 50vh) rotate(-5deg); }
    25% { transform: translate(10vw, 80vh) rotate(5deg); }
    50% { transform: translate(80vw, 40vh) rotate(-5deg); }
    75% { transform: translate(30vw, 10vh) rotate(5deg); }
    100% { transform: translate(40vw, 50vh) rotate(-5deg); }
  }
`;

const Aurora = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(
    to bottom,
    transparent,
    ${props => props.colors.map((color, i) => `${color} ${i * 25}%`).join(', ')}
  );
  opacity: ${props => props.intensity};
  filter: blur(30px);
  animation: auroraWave ${props => props.speed}s ease-in-out infinite;

  @keyframes auroraWave {
    0% { transform: translateX(-25%) scale(1); }
    50% { transform: translateX(25%) scale(1.2); }
    100% { transform: translateX(-25%) scale(1); }
  }
`;

const SpaceBackground = memo(({ theme = 'night' }) => {
  const canvasRef = useRef(null);
  const currentTheme = spaceThemes[theme];
  const starsRef = useRef([]);

  useEffect(() => {
    if (!document.getElementById('star-animations')) {
      const style = document.createElement('style');
      style.id = 'star-animations';
      style.textContent = `
        @keyframes twinkle {
          0%, 100% { 
            opacity: 0.2;
            transform: scale(0.85);
            filter: brightness(0.5);
          }
          50% { 
            opacity: 1;
            transform: scale(1.15);
            filter: brightness(1.2);
          }
        }
      `;
      document.head.appendChild(style);
    }

    const generateStars = () => {
      const stars = [];
      const { count, size, color, twinkleSpeed } = currentTheme.stars;
      
      for (let i = 0; i < count; i++) {
        stars.push({
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          size: Math.random() * (size.max - size.min) + size.min,
          twinkleSpeed: Math.random() * (twinkleSpeed.max - twinkleSpeed.min) + twinkleSpeed.min,
          delay: Math.random() * 2
        });
      }
      
      return stars;
    };

    if (canvasRef.current && (!starsRef.current.length || theme !== starsRef.current.theme)) {
      canvasRef.current.innerHTML = '';
      const stars = generateStars();
      const fragment = document.createDocumentFragment();

      stars.forEach(star => {
        const starElement = document.createElement('div');
        Object.assign(starElement.style, {
          position: 'absolute',
          left: star.left,
          top: star.top,
          width: `${star.size}px`,
          height: `${star.size}px`,
          background: currentTheme.stars.color,
          borderRadius: '50%',
          boxShadow: `0 0 ${star.size * 2}px ${currentTheme.stars.color},
                      0 0 ${star.size * 4}px ${currentTheme.stars.color},
                      0 0 ${star.size * 6}px ${currentTheme.stars.color}`,
          animation: `twinkle ${star.twinkleSpeed}s ease-in-out infinite`,
          animationDelay: `${star.delay}s`,
          willChange: 'transform, opacity, filter',
          transform: 'translateZ(0)'
        });
        fragment.appendChild(starElement);
      });

      canvasRef.current.appendChild(fragment);
      starsRef.current = { stars, theme };
    }
  }, [theme, currentTheme.stars]);

  const MemoizedPlanet = memo(Planet);
  const MemoizedSatellite = memo(Satellite);
  const MemoizedNebula = memo(Nebula);
  const MemoizedComet = memo(Comet);
  const MemoizedUFO = memo(UFO);

  return (
    <Background theme={currentTheme}>
      <SpaceContainer>
        <div ref={canvasRef} style={{ position: 'absolute', width: '100%', height: '100%' }} />
        
        {currentTheme.nebulas?.map((nebula, i) => (
          <MemoizedNebula key={i} {...nebula} />
        ))}

        {currentTheme.planets.map((planet, i) => (
          <React.Fragment key={i}>
            <MemoizedPlanet {...planet} />
            {planet.satellites?.map((satellite, j) => (
              <MemoizedSatellite key={`${i}-${j}`} {...satellite} />
            ))}
          </React.Fragment>
        ))}

        {currentTheme.comets && Array.from({ length: currentTheme.comets.count }).map((_, i) => (
          <MemoizedComet
            key={i}
            color={currentTheme.comets.color}
            tailLength={currentTheme.comets.tailLength}
            speed={Math.random() * (currentTheme.comets.speed.max - currentTheme.comets.speed.min) + currentTheme.comets.speed.min}
            delay={Math.random() * 10}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}

        {currentTheme.ufos && Array.from({ length: currentTheme.ufos.count }).map((_, i) => (
          <MemoizedUFO
            key={i}
            index={i + 1}
            size={currentTheme.ufos.size}
            speed={Math.random() * (currentTheme.ufos.speed.max - currentTheme.ufos.speed.min) + currentTheme.ufos.speed.min}
          >
            {currentTheme.ufos.emoji}
          </MemoizedUFO>
        ))}

        {currentTheme.aurora?.active && (
          <Aurora {...currentTheme.aurora} />
        )}

        {currentTheme.shootingStars && Array.from({ length: currentTheme.shootingStars.count }).map((_, i) => (
          <MemoizedComet
            key={`shooting-star-${i}`}
            color={currentTheme.shootingStars.color}
            tailLength={currentTheme.shootingStars.tailLength}
            speed={Math.random() * (currentTheme.shootingStars.speed.max - currentTheme.shootingStars.speed.min) + currentTheme.shootingStars.speed.min}
            delay={Math.random() * 15}
          />
        ))}
      </SpaceContainer>
    </Background>
  );
});

SpaceBackground.displayName = 'SpaceBackground';

export default SpaceBackground; 