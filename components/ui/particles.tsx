"use client";

import { cn } from "@/lib/utils";
import React, { useCallback, useEffect, useRef } from "react";

interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  refresh?: boolean;
  color?: string;
  vx?: number;
  vy?: number;
}

function hexToRgb(hex: string): number[] {
  hex = hex.replace("#", "");

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const hexInt = parseInt(hex, 16);
  const red = (hexInt >> 16) & 255;
  const green = (hexInt >> 8) & 255;
  const blue = hexInt & 255;
  return [red, green, blue];
}

type Circle = {
  x: number;
  y: number;
  translateX: number;
  translateY: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  dx: number;
  dy: number;
  magnetism: number;
  baseSize: number;
  expanding: boolean;
  growthRate: number;
  maxSize: number;
};

const ParticlesBackground: React.FC<ParticlesProps> = ({
  className = "",
  quantity = 50,
  staticity = 50,
  ease = 50,
  size = 0.4,
  refresh = false,
  color = "#ffffff",
  vx = 0,
  vy = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<Circle[]>([]);
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
  const rafID = useRef<number | null>(null);

  function debounce(func: () => void, wait: number) {
    let timeout: NodeJS.Timeout;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(func, wait);
    };
  }

  const rgb = hexToRgb(color);

  const circleParams = useCallback((): Circle => {
    const x = Math.floor(Math.random() * (canvasSize.current.w || 1));
    const y = Math.floor(Math.random() * (canvasSize.current.h || 1));
    const translateX = 0;
    const translateY = 0;
    const pSize = Math.floor(Math.random() * 2) + size;
    const alpha = 0;
    const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
    const dx = (Math.random() - 0.5) * 0.1;
    const dy = (Math.random() - 0.5) * 0.1;
    const magnetism = 0.1 + Math.random() * 4;
    const baseSize = Math.random() * 2 + pSize;
    const maxSize = baseSize + Math.random() * 5;
    const growthRate = Math.random() * 0.02 + 0.005;
    const expanding = Math.random() > 0.5;
    return {
      x,
      y,
      translateX,
      translateY,
      size: pSize,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnetism,
      baseSize,
      expanding,
      growthRate,
      maxSize,
    };
  }, [canvasSize, size]);

  const drawCircle = useCallback((circle: Circle, update = false) => {
    if (context.current) {
      const { x, y, translateX, translateY, size, alpha } = circle;
      context.current.translate(translateX, translateY);
      context.current.beginPath();
      context.current.arc(x, y, size, 0, 2 * Math.PI);
      context.current.fillStyle = `rgba(${rgb.join(", ")}, ${alpha})`;
      context.current.fill();
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!update) {
        circles.current.push(circle);
      }
    }
  }, [rgb, dpr]);

  const clearContext = useCallback(() => {
    if (context.current) {
      context.current.clearRect(
        0,
        0,
        canvasSize.current.w,
        canvasSize.current.h
      );
    }
  }, []);

  const drawParticles = useCallback(() => {
    clearContext();
    const particleCount = quantity;
    for (let i = 0; i < particleCount; i++) {
      const circle = circleParams();
      drawCircle(circle);
    }
  }, [quantity, circleParams, drawCircle, clearContext]);

  const debouncedResizeCanvas = debounce(() => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      const prevWidth = canvasSize.current.w;
      const prevHeight = canvasSize.current.h;
  
      canvasSize.current.w = canvasContainerRef.current.offsetWidth;
      canvasSize.current.h = canvasContainerRef.current.offsetHeight;
  
      canvasRef.current.width = canvasSize.current.w * dpr;
      canvasRef.current.height = canvasSize.current.h * dpr;
      canvasRef.current.style.width = `${canvasSize.current.w}px`;
      canvasRef.current.style.height = `${canvasSize.current.h}px`;
      context.current.scale(dpr, dpr);
  
      if (canvasSize.current.w > prevWidth || canvasSize.current.h > prevHeight) {
        const additionalParticles = Math.floor((canvasSize.current.w * canvasSize.current.h - prevWidth * prevHeight) / 10000);
        for (let i = 0; i < additionalParticles; i++) {
          const circle = circleParams();
          drawCircle(circle);
        }
      }
    }
  }, 200);

  const initCanvas = useCallback(() => {
    debouncedResizeCanvas();
    drawParticles();
  }, [debouncedResizeCanvas, drawParticles]);

  const animate = useCallback(() => {
    clearContext();
    circles.current.forEach((circle: Circle, i: number) => {
      const edge = [
        circle.x + circle.translateX - circle.size,
        canvasSize.current.w - circle.x - circle.translateX - circle.size,
        circle.y + circle.translateY - circle.size,
        canvasSize.current.h - circle.y - circle.translateY - circle.size,
      ];
      const closestEdge = edge.reduce((a, b) => Math.min(a, b), Infinity);
      const remapClosestEdge = parseFloat(
        remapValue(closestEdge, 0, 20, 0, 1).toFixed(2)
      );
      if (remapClosestEdge > 1) {
        circle.alpha += 0.02;
        if (circle.alpha > circle.targetAlpha) {
          circle.alpha = circle.targetAlpha;
        }
      } else {
        circle.alpha = circle.targetAlpha * remapClosestEdge;
      }

      circle.x += circle.dx + vx;
      circle.y += circle.dy + vy;
      circle.translateX += (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) / ease;
      circle.translateY += (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) / ease;

      if (circle.expanding) {
        circle.size += circle.growthRate;
      } else {
        circle.size -= circle.growthRate;
      }
      if (circle.size >= circle.maxSize) circle.expanding = false;
      if (circle.size <= circle.baseSize) circle.expanding = true;

      drawCircle(circle, true);

      if (
        circle.x < -circle.size ||
        circle.x > canvasSize.current.w + circle.size ||
        circle.y < -circle.size ||
        circle.y > canvasSize.current.h + circle.size
      ) {
        circles.current.splice(i, 1);
      
        // FIX: Respawn particles more naturally around canvas edges
        const edge = Math.floor(Math.random() * 4);
        let x, y;
      
        if (edge === 0) {
          x = Math.random() * canvasSize.current.w;
          y = -circle.size;
        } else if (edge === 1) {
          x = Math.random() * canvasSize.current.w;
          y = canvasSize.current.h + circle.size;
        } else if (edge === 2) {
          x = -circle.size;
          y = Math.random() * canvasSize.current.h;
        } else {
          x = canvasSize.current.w + circle.size;
          y = Math.random() * canvasSize.current.h;
        }

        const newCircle = {
          ...circleParams(),
          x,
          y,
        };
        drawCircle(newCircle);
      }
    });
    rafID.current = window.requestAnimationFrame(animate);
  }, [circleParams, clearContext, drawCircle, ease, staticity, vx, vy]);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      debouncedResizeCanvas();
    });

    if (canvasContainerRef.current) {
      observer.observe(canvasContainerRef.current);
    }

    return () => observer.disconnect();
  });

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }
    initCanvas();
    animate();

    window.addEventListener("resize", debouncedResizeCanvas);

    return () => {
      if (rafID.current != null) {
        window.cancelAnimationFrame(rafID.current);
      }
      window.removeEventListener("resize", debouncedResizeCanvas);
    };
  }, [color, animate, debouncedResizeCanvas, initCanvas]);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  useEffect(() => {
    initCanvas();
  }, [refresh, initCanvas]);

  const onMouseMove = (event: MouseEvent) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const { w, h } = canvasSize.current;

      const x = event.clientX - rect.left - w / 2;
      const y = event.clientY - rect.top - h / 2;

      const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;

      if (inside) {
        mouse.current.x = x;
        mouse.current.y = y;
      }
    }
  };

  const remapValue = (
    value: number,
    start1: number,
    end1: number,
    start2: number,
    end2: number
  ): number => {
    const remapped =
      ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
    return remapped > 0 ? remapped : 0;
  };

  return (
    <div
      className={cn("pointer-events-none", className)}
      ref={canvasContainerRef}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
};

export default ParticlesBackground;