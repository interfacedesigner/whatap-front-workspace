import { motion, useScroll, useTransform } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';

/** Web3 스타일 Abstract 배경 오브젝트 */
export function AbstractObjects() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Parallax transforms for different layers
  const layer1Y = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const layer2Y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const layer3Y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -30]);

  return (
    <div ref={containerRef} className='absolute inset-0 overflow-hidden pointer-events-none'>
      {/* Gradient Orb - Top Right */}
      <motion.div
        style={{ y: layer1Y, rotate: rotate1 }}
        className='absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full'
      >
        <div className='w-full h-full bg-gradient-to-br from-[#296cf2]/30 via-[#00BEB8]/20 to-transparent blur-3xl' />
      </motion.div>

      {/* Gradient Orb - Bottom Left */}
      <motion.div
        style={{ y: layer2Y, rotate: rotate2 }}
        className='absolute -bottom-60 -left-40 w-[500px] h-[500px] rounded-full'
      >
        <div className='w-full h-full bg-gradient-to-tr from-[#00BEB8]/25 via-[#296cf2]/15 to-transparent blur-3xl' />
      </motion.div>

      {/* Floating Ring - Center Right */}
      <motion.div
        style={{ y: layer3Y }}
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className='absolute top-1/4 right-10 w-32 h-32'
      >
        <div className='w-full h-full rounded-full border-2 border-[#00BEB8]/30' />
      </motion.div>

      {/* Floating Dot Grid */}
      <div className='absolute top-20 left-20 grid grid-cols-5 gap-4 opacity-20'>
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'easeInOut',
            }}
            className='w-1 h-1 rounded-full bg-[#00BEB8]'
          />
        ))}
      </div>

      {/* Glowing Line - Diagonal */}
      <motion.div
        style={{ y: layer2Y }}
        className='absolute top-1/3 left-1/4 w-[300px] h-px bg-gradient-to-r from-transparent via-[#296cf2]/40 to-transparent transform -rotate-45'
      />

      {/* Abstract Shape - Hexagon outline */}
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: 'linear',
        }}
        className='absolute bottom-1/4 right-1/4 w-24 h-24 opacity-20'
      >
        <svg viewBox='0 0 100 100' className='w-full h-full'>
          <polygon points='50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5' fill='none' stroke='#00BEB8' strokeWidth='1' />
        </svg>
      </motion.div>

      {/* Mesh gradient overlay */}
      <div className='absolute inset-0 bg-gradient-to-b from-transparent via-[#1a1a2e]/50 to-[#1a1a2e]' />
    </div>
  );
}

/** Neural Network Node 타입 */
interface NetworkNode {
  id: number;
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  connections: number[];
  pulse: number;
  layer: number; // 0: front, 1: mid, 2: back - for parallax
}

/** Neural Network AI 오브제 컴포넌트 - 스크롤 연동 */
function NeuralNetworkBackground({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const animationRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollRef = useRef(0);
  const scrollVelocityRef = useRef(0);

  // 스크롤 속도 계산
  useEffect(() => {
    scrollVelocityRef.current = (scrollProgress - lastScrollRef.current) * 10;
    lastScrollRef.current = scrollProgress;
  }, [scrollProgress]);

  // 노드 초기화 (컴포넌트 마운트 시 한 번만)
  const initialNodes = useMemo(() => {
    const nodeCount = 45; // 노드 수 증가
    const newNodes: NetworkNode[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      newNodes.push({
        id: i,
        x,
        y,
        baseX: x,
        baseY: y,
        vx: (Math.random() - 0.5) * 0.008, // 속도 감소: 0.02 → 0.008
        vy: (Math.random() - 0.5) * 0.008,
        connections: [],
        pulse: Math.random() * Math.PI * 2,
        layer: Math.floor(Math.random() * 3), // 0, 1, 2 레이어 랜덤 배정
      });
    }

    // 연결 설정 (가까운 노드끼리)
    for (let i = 0; i < nodeCount; i++) {
      const distances: { index: number; dist: number }[] = [];
      for (let j = 0; j < nodeCount; j++) {
        if (i !== j) {
          const dx = newNodes[i]!.x - newNodes[j]!.x;
          const dy = newNodes[i]!.y - newNodes[j]!.y;
          distances.push({ index: j, dist: Math.sqrt(dx * dx + dy * dy) });
        }
      }
      distances.sort((a, b) => a.dist - b.dist);
      newNodes[i]!.connections = distances.slice(0, 4).map((d) => d.index); // 연결 수 증가
    }

    return newNodes;
  }, []);

  useEffect(() => {
    setNodes(initialNodes);

    const animate = () => {
      const scrollVel = scrollVelocityRef.current;
      const scrollEffect = Math.abs(scrollVel) > 0.01;

      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          // 레이어별 패럴랙스 효과
          const parallaxMultiplier = [1.5, 1.0, 0.5][node.layer] ?? 1.0;

          // 스크롤 시 속도 부스트 감소: 3x → 1.5x
          const speedBoost = scrollEffect ? 1.5 : 1;
          const pulseBoost = scrollEffect ? 0.025 : 0.015; // 펄스 속도 감소

          let newX = node.x + node.vx * speedBoost;
          let newY = node.y + node.vy * speedBoost;
          let newVx = node.vx;
          let newVy = node.vy;

          // 스크롤 방향에 따른 노드 이동 (레이어별 차등) - 속도 50% 감소
          if (scrollEffect) {
            newY += scrollVel * parallaxMultiplier * 0.4; // 0.8 → 0.4 (50% 감소)
          }

          // 경계 반사
          if (newX < -5 || newX > 105) {
            newVx = -newVx;
            newX = Math.max(-5, Math.min(105, newX));
          }
          if (newY < -5 || newY > 105) {
            newVy = -newVy;
            newY = Math.max(-5, Math.min(105, newY));
          }

          return {
            ...node,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            pulse: node.pulse + pulseBoost,
          };
        }),
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [initialNodes, scrollProgress]);

  // 연결선 생성 - 스크롤 효과 감소
  const connections = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number; opacity: number; layer: number }[] = [];
    const maxDist = 30; // 스크롤 부스트 제거

    nodes.forEach((node) => {
      node.connections.forEach((connIdx) => {
        const target = nodes[connIdx];
        if (target && node.id < connIdx) {
          const dx = node.x - target.x;
          const dy = node.y - target.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const baseOpacity = (1 - dist / maxDist) * 0.4; // 0.5 → 0.4
            lines.push({
              x1: node.x,
              y1: node.y,
              x2: target.x,
              y2: target.y,
              opacity: baseOpacity, // 스크롤 opacity 부스트 제거
              layer: Math.min(node.layer, target.layer),
            });
          }
        }
      });
    });

    return lines;
  }, [nodes]);

  // 데이터 플로우 파티클 비활성화 - 시선 분산 방지
  const dataParticles: { x: number; y: number; opacity: number }[] = [];

  return (
    <div ref={containerRef} className='absolute inset-0 overflow-hidden'>
      <svg className='w-full h-full' preserveAspectRatio='none'>
        <defs>
          <linearGradient id='nodeGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' stopColor='#4A90FF' />
            <stop offset='100%' stopColor='#A855F7' />
          </linearGradient>
          <linearGradient id='activeGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' stopColor='#00BEB8' />
            <stop offset='100%' stopColor='#4A90FF' />
          </linearGradient>
          <filter id='glow'>
            <feGaussianBlur stdDeviation='2' result='coloredBlur' />
            <feMerge>
              <feMergeNode in='coloredBlur' />
              <feMergeNode in='SourceGraphic' />
            </feMerge>
          </filter>
          <filter id='strongGlow'>
            <feGaussianBlur stdDeviation='4' result='coloredBlur' />
            <feMerge>
              <feMergeNode in='coloredBlur' />
              <feMergeNode in='SourceGraphic' />
            </feMerge>
          </filter>
        </defs>

        {/* 연결선 - 레이어별 그룹화 - 일정한 스타일 */}
        {[2, 1, 0].map((layer) => (
          <g key={`layer-${layer}`} opacity={[0.8, 0.5, 0.3][layer]}>
            {connections
              .filter((conn) => conn.layer === layer)
              .map((conn, i) => (
                <line
                  key={`line-${layer}-${i}`}
                  x1={`${conn.x1}%`}
                  y1={`${conn.y1}%`}
                  x2={`${conn.x2}%`}
                  y2={`${conn.y2}%`}
                  stroke='url(#nodeGradient)'
                  strokeWidth={[1.2, 0.8, 0.5][layer]}
                  opacity={conn.opacity}
                />
              ))}
          </g>
        ))}

        {/* 데이터 플로우 파티클 */}
        {dataParticles.map((particle, i) => (
          <circle
            key={`particle-${i}`}
            cx={`${particle.x}%`}
            cy={`${particle.y}%`}
            r={3}
            fill='#00BEB8'
            opacity={particle.opacity}
            filter='url(#strongGlow)'
          />
        ))}

        {/* 노드 - 레이어별 렌더링 - 효과 감소 */}
        {[2, 1, 0].map((layer) => (
          <g key={`nodes-${layer}`}>
            {nodes
              .filter((node) => node.layer === layer)
              .map((node) => {
                // 펄스 효과 대폭 감소
                const pulseScale = 0.9 + Math.sin(node.pulse) * 0.15; // 0.8 + 0.4 → 0.9 + 0.15
                const pulseOpacity = 0.4 + Math.sin(node.pulse) * 0.15; // 0.3 + 0.3 → 0.4 + 0.15
                const nodeSize = [3, 2, 1.5][layer] ?? 1.5;
                const glowSize = [5, 3.5, 2.5][layer] ?? 2.5; // glow 크기 감소

                return (
                  <g key={node.id}>
                    {/* Glow effect - 일정한 효과 */}
                    <circle
                      cx={`${node.x}%`}
                      cy={`${node.y}%`}
                      r={glowSize * pulseScale}
                      fill='url(#nodeGradient)'
                      opacity={pulseOpacity * 0.4}
                      filter='url(#glow)'
                    />
                    {/* Core node */}
                    <circle
                      cx={`${node.x}%`}
                      cy={`${node.y}%`}
                      r={nodeSize}
                      fill='url(#nodeGradient)'
                      opacity={0.5 + pulseOpacity * 0.3}
                    />
                  </g>
                );
              })}
          </g>
        ))}
      </svg>
    </div>
  );
}

/** Hero 섹션 전용 Abstract 배경 - Figma 디자인 기반 + Neural Network */
export function HeroAbstractBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const [scrollValue, setScrollValue] = useState(0);

  // 스크롤 값을 state로 변환
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      setScrollValue(v);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // 패럴랙스 효과
  const networkY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const networkScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.15]);
  const networkRotate = useTransform(scrollYProgress, [0, 1], [0, 5]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.3, 0.6], [0.5, 0.8, 0.4]);

  return (
    <div ref={containerRef} className='absolute inset-0 overflow-hidden pointer-events-none'>
      {/* Neural Network AI Object - Background Layer with scroll effects */}
      <motion.div
        style={{
          y: networkY,
          scale: networkScale,
          rotate: networkRotate,
        }}
        className='absolute inset-0 opacity-50'
      >
        <NeuralNetworkBackground scrollProgress={scrollValue} />
      </motion.div>

      {/* Main Center Gradient Glow - Primary Blue/Purple - Vertical Middle */}
      <motion.div
        style={{
          y: useTransform(scrollYProgress, [0, 1], [0, -80]),
        }}
        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[900px]'
      >
        <motion.div
          className='absolute inset-0'
          style={{
            opacity: glowOpacity,
            background: `
              radial-gradient(
                ellipse 70% 60% at 50% 50%,
                rgba(41, 108, 242, 0.35) 0%,
                rgba(139, 82, 255, 0.2) 30%,
                rgba(41, 108, 242, 0.1) 50%,
                transparent 70%
              )
            `,
          }}
        />
      </motion.div>

      {/* Secondary Center Glow - Brighter Blue - Centered */}
      <motion.div
        animate={{
          opacity: [0.5, 0.7, 0.5],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          y: useTransform(scrollYProgress, [0, 1], [0, -100]),
          scale: useTransform(scrollYProgress, [0, 0.5], [1, 1.2]),
        }}
        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px]'
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: `
              radial-gradient(
                ellipse 60% 50% at 50% 50%,
                rgba(41, 108, 242, 0.3) 0%,
                rgba(139, 82, 255, 0.15) 40%,
                transparent 70%
              )
            `,
            filter: 'blur(40px)',
          }}
        />
      </motion.div>

      {/* Tertiary Glow - Purple accent on right - Vertical Middle */}
      <motion.div
        style={{
          y: useTransform(scrollYProgress, [0, 1], [0, -80]),
          x: useTransform(scrollYProgress, [0, 1], [0, 40]),
        }}
        className='absolute top-1/2 right-[5%] -translate-y-1/2 w-[500px] h-[500px]'
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: `
              radial-gradient(
                circle at center,
                rgba(139, 82, 255, 0.25) 0%,
                transparent 60%
              )
            `,
            filter: 'blur(60px)',
          }}
        />
      </motion.div>

      {/* Tertiary Glow - Blue accent on left - Vertical Middle */}
      <motion.div
        style={{
          y: useTransform(scrollYProgress, [0, 1], [0, -80]),
          x: useTransform(scrollYProgress, [0, 1], [0, -40]),
        }}
        className='absolute top-1/2 left-[5%] -translate-y-1/2 w-[500px] h-[500px]'
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: `
              radial-gradient(
                circle at center,
                rgba(41, 108, 242, 0.25) 0%,
                transparent 60%
              )
            `,
            filter: 'blur(60px)',
          }}
        />
      </motion.div>

      {/* Animated pulse glow - Centered */}
      <motion.div
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          y: useTransform(scrollYProgress, [0, 1], [0, -60]),
          scale: useTransform(scrollYProgress, [0, 0.5], [1, 1.3]),
        }}
        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px]'
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: `
              radial-gradient(
                ellipse at center,
                rgba(41, 108, 242, 0.25) 0%,
                rgba(139, 82, 255, 0.12) 50%,
                transparent 80%
              )
            `,
            filter: 'blur(50px)',
          }}
        />
      </motion.div>

      {/* Subtle grid pattern */}
      <div
        className='absolute inset-0 opacity-[0.02]'
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Top fade - subtle vignette effect */}
      <div
        className='absolute top-0 left-0 right-0 h-[200px]'
        style={{
          background: 'linear-gradient(to bottom, rgba(26, 26, 46, 0.6) 0%, transparent 100%)',
        }}
      />

      {/* Bottom fade to solid background - reduced height for center focus */}
      <div
        className='absolute bottom-0 left-0 right-0 h-[250px]'
        style={{
          background: 'linear-gradient(to top, #1a1a2e 0%, transparent 100%)',
        }}
      />
    </div>
  );
}
