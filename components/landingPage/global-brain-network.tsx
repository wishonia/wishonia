"use client"
import React, { useEffect, useRef, useState } from 'react';

interface Node {
  lat: number;
  lon: number;
  pulsePhase: number;
  size: number;
  synapseStrength: number;
}

interface BrainWave {
  amplitude: number;
  frequency: number;
  phase: number;
}

interface DataPacket {
  startNode: Node;
  endNode: Node;
  progress: number;
}

interface GlobalBrainNetworkLoaderProps {
  className?: string;
}

const GlobalBrainNetwork: React.FC<GlobalBrainNetworkLoaderProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(300);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setSize(containerRef.current.offsetWidth);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const center = size / 2;
    const radius = size * 0.28;

    const nodes: Node[] = Array(20).fill(null).map(() => ({
      lat: Math.random() * Math.PI - Math.PI / 2,
      lon: Math.random() * Math.PI * 2,
      pulsePhase: Math.random() * Math.PI * 2,
      size: Math.random() * 3 + 2,
      synapseStrength: Math.random(),
    }));

    const brainWaves: BrainWave[] = Array(5).fill(null).map(() => ({
      amplitude: Math.random() * 10 + 5,
      frequency: Math.random() * 0.02 + 0.01,
      phase: Math.random() * Math.PI * 2,
    }));

    const dataPackets: DataPacket[] = [];

    const drawGlowingLine = (x1: number, y1: number, x2: number, y2: number, color: string, width = 1): void => {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = width / 2;
      ctx.stroke();
    };

    const createRadialGradient = (x: number, y: number, r: number, colorStops: [number, string][]): CanvasGradient => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
      colorStops.forEach(([stop, color]) => gradient.addColorStop(stop, color));
      return gradient;
    };

    const animate = (): void => {
      time += 0.02;
      ctx.fillStyle = '#000500';
      ctx.fillRect(0, 0, size, size);

      // Clip to circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(center, center, size / 2, 0, Math.PI * 2);
      ctx.clip();

      // Draw background galaxy effect
      const galaxyGradient = createRadialGradient(center, center, size / 2, [
        [0, 'rgba(0, 40, 80, 0.2)'],
        [0.5, 'rgba(0, 20, 40, 0.1)'],
        [1, 'rgba(0, 0, 0, 0)']
      ]);
      ctx.fillStyle = galaxyGradient;
      ctx.fillRect(0, 0, size, size);

      // Draw brain wave patterns
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      brainWaves.forEach((wave) => {
        ctx.beginPath();
        for (let x = 0; x < size; x++) {
          const y = center + wave.amplitude * Math.sin(x * wave.frequency + time + wave.phase);
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      // Draw wireframe globe
      ctx.strokeStyle = 'rgba(0, 255, 128, 0.3)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        for (let j = 0; j <= 100; j++) {
          const lat = (j / 100) * Math.PI - Math.PI / 2;
          const lon = (i / 10) * Math.PI * 2 + time * 0.1;
          const x = center + radius * Math.cos(lat) * Math.sin(lon);
          const y = center + radius * Math.sin(lat);
          const z = radius * Math.cos(lat) * Math.cos(lon);
          if (z > 0 || j === 0) ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Draw nodes and connections (synapses)
      nodes.forEach((node, index) => {
        const x = center + radius * Math.cos(node.lat) * Math.sin(node.lon + time * 0.2);
        const y = center + radius * Math.sin(node.lat);
        const z = radius * Math.cos(node.lat) * Math.cos(node.lon + time * 0.2);
        if (z > 0) {
          const pulseSize = (Math.sin(time * 3 + node.pulsePhase) * 0.5 + 1) * node.size;
          const nodeGradient = createRadialGradient(x, y, pulseSize, [
            [0, `rgba(0, ${128 + Math.sin(time) * 64}, 255, 1)`],
            [0.6, `rgba(0, ${128 + Math.sin(time) * 64}, 255, 0.5)`],
            [1, `rgba(0, ${128 + Math.sin(time) * 64}, 255, 0)`]
          ]);
          ctx.fillStyle = nodeGradient;
          ctx.beginPath();
          ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
          ctx.fill();

          // Connect to other visible nodes (synapses)
          nodes.forEach((otherNode, otherIndex) => {
            if (index < otherIndex) {
              const ox = center + radius * Math.cos(otherNode.lat) * Math.sin(otherNode.lon + time * 0.2);
              const oy = center + radius * Math.sin(otherNode.lat);
              const oz = radius * Math.cos(otherNode.lat) * Math.cos(otherNode.lon + time * 0.2);
              if (oz > 0) {
                const distance = Math.hypot(x - ox, y - oy);
                if (distance < size * 0.4) {
                  const synapseStrength = (node.synapseStrength + otherNode.synapseStrength) / 2;
                  const alpha = (0.2 + Math.sin(time * 2) * 0.1 - distance / (size * 0.8)) * synapseStrength;
                  drawGlowingLine(x, y, ox, oy, `rgba(0, 255, 255, ${alpha})`);
                }
              }
            }
          });
        }
      });

      // Neural impulse animation
      if (Math.random() < 0.05 && dataPackets.length < 8) {
        const startNode = nodes[Math.floor(Math.random() * nodes.length)];
        let endNode: Node;
        do {
          endNode = nodes[Math.floor(Math.random() * nodes.length)];
        } while (endNode === startNode);

        dataPackets.push({ startNode, endNode, progress: 0 });
      }

      dataPackets.forEach((packet, index) => {
        packet.progress += 0.02;
        const startX = center + radius * Math.cos(packet.startNode.lat) * Math.sin(packet.startNode.lon + time * 0.2);
        const startY = center + radius * Math.sin(packet.startNode.lat);
        const endX = center + radius * Math.cos(packet.endNode.lat) * Math.sin(packet.endNode.lon + time * 0.2);
        const endY = center + radius * Math.sin(packet.endNode.lat);
        const x = startX + (endX - startX) * packet.progress;
        const y = startY + (endY - startY) * packet.progress;

        const packetGradient = createRadialGradient(x, y, size / 40, [
          [0, 'rgba(255, 255, 255, 1)'],
          [0.6, 'rgba(0, 255, 255, 0.5)'],
          [1, 'rgba(0, 255, 255, 0)']
        ]);
        ctx.fillStyle = packetGradient;
        ctx.beginPath();
        ctx.arc(x, y, size / 40, 0, Math.PI * 2);
        ctx.fill();

        if (packet.progress >= 1) {
          dataPackets.splice(index, 1);
        }
      });

      // Restore clip
      ctx.restore();

      // Draw circular border with energy effect
      const borderWidth = size / 25;
      const borderGradient = ctx.createLinearGradient(0, 0, size, size);
      borderGradient.addColorStop(0, '#00ffff');
      borderGradient.addColorStop(0.5, '#0080ff');
      borderGradient.addColorStop(1, '#8000ff');
      
      ctx.strokeStyle = borderGradient;
      ctx.lineWidth = borderWidth;
      ctx.beginPath();
      ctx.arc(center, center, size / 2 - borderWidth / 2, 0, Math.PI * 2);
      ctx.stroke();

      // Energy particles along the border
      for (let i = 0; i < 50; i++) {
        const angle = (i / 50) * Math.PI * 2 + time;
        const x = center + (size / 2 - borderWidth / 2) * Math.cos(angle);
        const y = center + (size / 2 - borderWidth / 2) * Math.sin(angle);
        const particleSize = (Math.sin(time * 5 + i) + 1) * 2;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(x, y, particleSize, 0, Math.PI * 2);
        ctx.fill();
      }

      // Holographic overlay
      ctx.fillStyle = 'rgba(0, 255, 255, 0.05)';
      for (let i = 0; i < size; i += 4) {
        ctx.fillRect(0, i, size, 2);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [size]);

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      <canvas 
        ref={canvasRef} 
        width={size} 
        height={size} 
        style={{ width: '100%', height: 'auto', aspectRatio: '1 / 1' }}
        className="rounded-full shadow-lg shadow-cyan-500/50"
      />
    </div>
  );
};

export default GlobalBrainNetwork;