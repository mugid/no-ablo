"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useAnimationFrame, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

const TEXT = "these letters are attached to each other";
const CHARACTERS = TEXT.split("");

const FRICTION = 0.86;
const WALL_BOUNCE = 0.35;
const BOX_PADDING = 12;
const REPULSION_RADIUS = 40;
const REPULSION_STRENGTH = 0.24;
const CURSOR_RADIUS = 120;
const CURSOR_STRENGTH = 0.45;
const VELOCITY_THRESHOLD = 0.03;
const ROTATION_THRESHOLD = 0.015;
const MAX_ROTATE = 18;

type LetterBody = {
  x: number;
  y: number;
  rotate: number;
  vx: number;
  vy: number;
  vr: number;
};

type HomePosition = {
  x: number;
  y: number;
  halfW: number;
  halfH: number;
};

function clampToBox(
  body: LetterBody,
  home: HomePosition,
  boxW: number,
  boxH: number,
) {
  const minX = BOX_PADDING + home.halfW - home.x;
  const maxX = boxW - BOX_PADDING - home.halfW - home.x;
  const minY = BOX_PADDING + home.halfH - home.y;
  const maxY = boxH - BOX_PADDING - home.halfH - home.y;

  if (body.x < minX) {
    body.x = minX;
    body.vx *= -WALL_BOUNCE;
  } else if (body.x > maxX) {
    body.x = maxX;
    body.vx *= -WALL_BOUNCE;
  }

  if (body.y < minY) {
    body.y = minY;
    body.vy *= -WALL_BOUNCE;
  } else if (body.y > maxY) {
    body.y = maxY;
    body.vy *= -WALL_BOUNCE;
  }

  body.rotate = Math.max(-MAX_ROTATE, Math.min(MAX_ROTATE, body.rotate));
}

export function DetachedLetters() {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const glyphRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const homes = useRef<HomePosition[]>([]);
  const boxSize = useRef({ w: 0, h: 0 });
  const bodies = useRef<LetterBody[]>(
    CHARACTERS.map(() => ({
      x: 0,
      y: 0,
      rotate: 0,
      vx: 0,
      vy: 0,
      vr: 0,
    })),
  );
  const isDragging = useRef(false);
  const physicsActive = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0, time: 0 });
  const pointerVelocity = useRef({ x: 0, y: 0 });

  const [dragging, setDragging] = useState(false);

  const measureBox = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    boxSize.current = { w: rect.width, h: rect.height };
  }, []);

  const measureHomes = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    boxSize.current = {
      w: containerRect.width,
      h: containerRect.height,
    };

    homes.current = CHARACTERS.map((char, i) => {
      if (char === " ") return { x: 0, y: 0, halfW: 0, halfH: 0 };

      const glyph = measureRefs.current[i];
      if (!glyph) return { x: 0, y: 0, halfW: 0, halfH: 0 };

      const rect = glyph.getBoundingClientRect();
      return {
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top + rect.height / 2,
        halfW: rect.width / 2,
        halfH: rect.height / 2,
      };
    });
  }, []);

  const updateTransforms = useCallback(() => {
    bodies.current.forEach((body, i) => {
      const glyph = glyphRefs.current[i];
      const home = homes.current[i];
      if (!glyph || CHARACTERS[i] === " " || !home) return;

      glyph.style.left = `${home.x}px`;
      glyph.style.top = `${home.y}px`;
      glyph.style.transform = `translate(-50%, -50%) translate3d(${body.x}px, ${body.y}px, 0) rotate(${body.rotate}deg)`;
    });
  }, []);

  const applyRepulsion = useCallback(() => {
    for (let i = 0; i < CHARACTERS.length; i++) {
      if (CHARACTERS[i] === " ") continue;

      const bi = bodies.current[i];
      const hi = homes.current[i];
      if (!hi) continue;

      const cxI = hi.x + bi.x;
      const cyI = hi.y + bi.y;

      for (let j = i + 1; j < CHARACTERS.length; j++) {
        if (CHARACTERS[j] === " ") continue;

        const bj = bodies.current[j];
        const hj = homes.current[j];
        if (!hj) continue;

        const cxJ = hj.x + bj.x;
        const cyJ = hj.y + bj.y;

        const dx = cxI - cxJ;
        const dy = cyI - cyJ;
        const dist = Math.hypot(dx, dy) || 1;

        if (dist < REPULSION_RADIUS) {
          const force =
            ((REPULSION_RADIUS - dist) / REPULSION_RADIUS) * REPULSION_STRENGTH;
          const nx = dx / dist;
          const ny = dy / dist;

          bi.vx += nx * force;
          bi.vy += ny * force;
          bj.vx -= nx * force;
          bj.vy -= ny * force;
        }
      }
    }
  }, []);

  const applyPointerForces = useCallback((clientX: number, clientY: number) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const px = clientX - rect.left;
    const py = clientY - rect.top;
    const { x: pvx, y: pvy } = pointerVelocity.current;
    const speed = Math.hypot(pvx, pvy);

    bodies.current.forEach((body, i) => {
      if (CHARACTERS[i] === " ") return;

      const home = homes.current[i];
      if (!home) return;

      const cx = home.x + body.x;
      const cy = home.y + body.y;
      const dx = cx - px;
      const dy = cy - py;
      const dist = Math.hypot(dx, dy) || 1;

      if (dist < CURSOR_RADIUS) {
        const falloff = 1 - dist / CURSOR_RADIUS;
        const impulse = falloff * (CURSOR_STRENGTH + speed * 0.1);

        body.vx += (dx / dist) * impulse + pvx * falloff * 0.05;
        body.vy += (dy / dist) * impulse + pvy * falloff * 0.05;
        body.vr += (pvx - pvy) * falloff * 0.03;
      }
    });
  }, []);

  const wakePhysics = useCallback(() => {
    physicsActive.current = true;
  }, []);

  useLayoutEffect(() => {
    measureHomes();
    updateTransforms();
  }, [measureHomes, updateTransforms]);

  useEffect(() => {
    window.addEventListener("resize", measureBox);
    return () => window.removeEventListener("resize", measureBox);
  }, [measureBox]);

  useAnimationFrame(() => {
    if (!physicsActive.current) return;

    if (isDragging.current) {
      applyRepulsion();
    }

    const { w, h } = boxSize.current;
    let stillMoving = isDragging.current;

    bodies.current.forEach((body, i) => {
      if (CHARACTERS[i] === " ") return;

      body.x += body.vx;
      body.y += body.vy;
      body.rotate += body.vr;

      const home = homes.current[i];
      if (home && w > 0 && h > 0) {
        clampToBox(body, home, w, h);
      }

      body.vx *= FRICTION;
      body.vy *= FRICTION;
      body.vr *= FRICTION;

      if (Math.abs(body.vx) < VELOCITY_THRESHOLD) body.vx = 0;
      if (Math.abs(body.vy) < VELOCITY_THRESHOLD) body.vy = 0;
      if (Math.abs(body.vr) < ROTATION_THRESHOLD) body.vr = 0;

      if (body.vx !== 0 || body.vy !== 0 || body.vr !== 0) {
        stillMoving = true;
      }
    });

    updateTransforms();
    physicsActive.current = stillMoving;
  });

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;

    measureBox();
    isDragging.current = true;
    setDragging(true);
    wakePhysics();

    const now = performance.now();
    lastPointer.current = { x: event.clientX, y: event.clientY, time: now };
    pointerVelocity.current = { x: 0, y: 0 };

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging.current) return;

    const now = performance.now();
    const dt = Math.max(now - lastPointer.current.time, 1);
    const dx = event.clientX - lastPointer.current.x;
    const dy = event.clientY - lastPointer.current.y;

    pointerVelocity.current = {
      x: (dx / dt) * 16,
      y: (dy / dt) * 16,
    };

    lastPointer.current = { x: event.clientX, y: event.clientY, time: now };
    applyPointerForces(event.clientX, event.clientY);
    wakePhysics();
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging.current) return;

    isDragging.current = false;
    setDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
    wakePhysics();
  }

  if (shouldReduceMotion) {
    return (
      <p className="text-center text-base font-medium leading-relaxed tracking-tight">
        {TEXT}
      </p>
    );
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={cn(
        "absolute inset-0 overflow-hidden",
        dragging ? "cursor-grabbing" : "cursor-grab",
      )}
    >
      <p
        className="pointer-events-none invisible absolute top-1/2 left-1/2 w-max max-w-[85%] -translate-x-1/2 -translate-y-1/2 text-center text-base font-medium leading-relaxed tracking-tight"
        aria-hidden
      >
        {CHARACTERS.map((char, i) => (
          <span
            key={`measure-${i}`}
            ref={(el) => {
              measureRefs.current[i] = el;
            }}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </p>

      {CHARACTERS.map((char, i) => {
        if (char === " ") return null;

        return (
          <span
            key={i}
            ref={(el) => {
              glyphRefs.current[i] = el;
              if (el) {
                const body = bodies.current[i];
                const home = homes.current[i];
                if (home) {
                  el.style.left = `${home.x}px`;
                  el.style.top = `${home.y}px`;
                }
                el.style.transform = `translate(-50%, -50%) translate3d(${body.x}px, ${body.y}px, 0) rotate(${body.rotate}deg)`;
              }
            }}
            className="absolute inline-block will-change-transform"
          >
            {char}
          </span>
        );
      })}
    </div>
  );
}
