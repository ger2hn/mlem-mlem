import React, { useState, useEffect } from 'react';
import { FlowerTheme, PhotoPetal } from '../types/flower';
import { sounds } from '../utils/audio';
import { Heart, Sparkles, Eye } from 'lucide-react';

interface BloomingFlowerProps {
  progress: number; // 0.0 to 1.0
  theme: FlowerTheme;
  photoPetals: PhotoPetal[];
  onSelectPetal: (petal: PhotoPetal) => void;
  onCenterClick: () => void;
}

export const BloomingFlower: React.FC<BloomingFlowerProps> = ({
  progress,
  theme,
  photoPetals,
  onSelectPetal,
  onCenterClick
}) => {
  const [swayTime, setSwayTime] = useState(0);
  const [hoveredPetalId, setHoveredPetalId] = useState<string | null>(null);

  // Gentle wind sway animation
  useEffect(() => {
    let animId: number;
    let t = 0;
    const animateSway = () => {
      t += 0.02;
      setSwayTime(t);
      animId = requestAnimationFrame(animateSway);
    };
    animId = requestAnimationFrame(animateSway);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Growth mathematics
  // 1. Sprout emergence: 0.0 -> 0.15
  const sproutProgress = Math.min(1, Math.max(0, progress / 0.18));
  // 2. Stem rising: 0.12 -> 0.60
  const stemProgress = Math.min(1, Math.max(0, (progress - 0.12) / 0.48));
  // 3. Bud formation: 0.45 -> 0.65
  const budProgress = Math.min(1, Math.max(0, (progress - 0.45) / 0.2));
  // 4. Petals blossoming: 0.60 -> 1.0
  const bloomProgress = Math.min(1, Math.max(0, (progress - 0.60) / 0.40));

  // Organic wind sway angle in degrees
  const windSwayDeg = Math.sin(swayTime * 1.2) * 1.8 * Math.min(1, stemProgress);
  const windOffsetHead = Math.sin(swayTime * 1.2) * 12 * Math.min(1, stemProgress);

  // Stem geometry
  const groundY = 680;
  const targetFlowerY = 250;
  const currentStemHeight = (groundY - targetFlowerY) * stemProgress;
  const currentFlowerY = groundY - currentStemHeight;

  // Interleaving math: N photos -> N floral petals + N photo petals = 2N radial sectors
  const count = photoPetals.length;
  const totalSlices = count * 2;
  const sliceAngle = 360 / totalSlices;

  // Leaf appearance milestones
  const leaf1Progress = Math.min(1, Math.max(0, (progress - 0.22) / 0.2));
  const leaf2Progress = Math.min(1, Math.max(0, (progress - 0.35) / 0.2));
  const leaf3Progress = Math.min(1, Math.max(0, (progress - 0.48) / 0.2));

  return (
    <div className="relative mx-auto flex h-[580px] w-full max-w-[700px] select-none items-center justify-center sm:h-[660px] md:h-[720px]">
      <svg
        viewBox="0 0 700 780"
        className="h-full w-full overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Petal gradients from theme */}
          <linearGradient id="floralPetalGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={theme.petalGradient[0]} stopOpacity="0.95" />
            <stop offset="50%" stopColor={theme.petalGradient[1]} stopOpacity="0.98" />
            <stop offset="85%" stopColor={theme.petalGradient[2]} stopOpacity="1" />
            <stop offset="100%" stopColor={theme.petalGradient[3]} stopOpacity="1" />
          </linearGradient>

          <linearGradient id="innerPetalGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={theme.petalSecondaryGradient[0]} />
            <stop offset="60%" stopColor={theme.petalSecondaryGradient[1]} />
            <stop offset="100%" stopColor={theme.petalSecondaryGradient[2]} />
          </linearGradient>

          <linearGradient id="stemGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#2e7d32" />
            <stop offset="40%" stopColor={theme.stemColor} />
            <stop offset="100%" stopColor="#86efac" />
          </linearGradient>

          <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="50%" stopColor={theme.leafColor} />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>

          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="40%" stopColor={theme.pollenColor} stopOpacity="1" />
            <stop offset="80%" stopColor={theme.centerRingColor} stopOpacity="1" />
            <stop offset="100%" stopColor={theme.centerColor} stopOpacity="1" />
          </radialGradient>

          <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="petalShadowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor={theme.petalShadow} floodOpacity="0.45" />
          </filter>

          {/* SVG Clip paths for photo petals */}
          {photoPetals.map((petal, i) => (
            <clipPath id={`petal-clip-${petal.id}`} key={`clip-${petal.id}`}>
              {/* Petal silhouette: pointed bottom base, rounded soft teardrop head */}
              <path d="M 0,0 C -36,-35 -48,-115 -18,-155 C 0,-175 0,-175 18,-155 C 48,-115 36,-35 0,0 Z" />
            </clipPath>
          ))}
        </defs>

        {/* ---------------- GROUND & SOIL ---------------- */}
        <g id="ground-layer">
          {/* Earth back hill */}
          <path
            d="M -50 780 Q 200 660 450 670 T 800 780 Z"
            fill="url(#soilBackGrad)"
            opacity="0.8"
          />
          <linearGradient id="soilBackGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="35%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          {/* Main lush soil mound */}
          <path
            d="M -30 780 C 150 655, 280 645, 350 648 C 420 648, 550 655, 730 780 Z"
            fill="url(#mainSoilGrad)"
          />
          <linearGradient id="mainSoilGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a7f3d0" />
            <stop offset="20%" stopColor="#34d399" />
            <stop offset="45%" stopColor="#15803d" />
            <stop offset="75%" stopColor="#713f12" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>

          {/* Cute grass sprouts along the mound */}
          <g opacity="0.9">
            <path d="M 260 670 Q 255 640 245 635 Q 260 650 265 670 Z" fill="#86efac" />
            <path d="M 270 672 Q 275 635 285 630 Q 278 650 274 672 Z" fill="#4ade80" />
            <path d="M 430 670 Q 440 635 450 632 Q 436 650 433 670 Z" fill="#86efac" />
            <path d="M 445 672 Q 435 640 425 638 Q 438 652 448 672 Z" fill="#4ade80" />
            <path d="M 180 690 Q 170 660 160 655 Q 175 670 185 690 Z" fill="#a7f3d0" />
            <path d="M 520 690 Q 535 660 545 658 Q 530 670 525 690 Z" fill="#a7f3d0" />
          </g>

          {/* Cute wild daisy on ground left */}
          <g transform="translate(210, 672) scale(0.65)">
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <circle
                key={deg}
                cx={Math.cos((deg * Math.PI) / 180) * 8}
                cy={Math.sin((deg * Math.PI) / 180) * 8}
                r="5"
                fill="#ffffff"
                opacity="0.95"
              />
            ))}
            <circle cx="0" cy="0" r="4.5" fill="#fde047" />
          </g>

          {/* Cute wild daisy on ground right */}
          <g transform="translate(490, 676) scale(0.6)">
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <circle
                key={deg}
                cx={Math.cos((deg * Math.PI) / 180) * 8}
                cy={Math.sin((deg * Math.PI) / 180) * 8}
                r="5"
                fill="#ffffff"
                opacity="0.95"
              />
            ))}
            <circle cx="0" cy="0" r="4.5" fill="#fde047" />
          </g>

          {/* Soil emergence crack where stem sprouts */}
          <ellipse cx="350" cy="650" rx="24" ry="7" fill="#451a03" opacity="0.75" />
          <ellipse cx="350" cy="650" rx="16" ry="4" fill="#291202" opacity="0.9" />

          {/* Seed underground (visible at early stage) */}
          {progress < 0.22 && (
            <g
              transform={`translate(350, ${650 - sproutProgress * 15})`}
              style={{
                opacity: Math.max(0, 1 - sproutProgress * 1.5),
                transition: 'opacity 0.2s ease-out'
              }}
            >
              <ellipse cx="0" cy="0" rx="10" ry="14" fill="#854d0e" />
              <path d="M 0 10 Q -6 20 -10 26" stroke="#ca8a04" strokeWidth="2" fill="none" />
              <path d="M 2 10 Q 6 18 10 24" stroke="#ca8a04" strokeWidth="2" fill="none" />
              {/* Sprout crack glow */}
              <circle cx="0" cy="-6" r="4" fill="#86efac" />
            </g>
          )}
        </g>

        {/* ---------------- GROWING STEM & LEAVES ---------------- */}
        {stemProgress > 0 && (
          <g id="stem-layer">
            {/* Dynamic stem path with natural curve and sway */}
            {(() => {
              const startX = 350;
              const startY = 650;
              const endX = 350 + windOffsetHead;
              const endY = currentFlowerY;

              const cp1X = 350 + Math.sin(swayTime * 0.8) * 6;
              const cp1Y = startY - (startY - endY) * 0.35;
              const cp2X = 350 + windOffsetHead * 0.65;
              const cp2Y = startY - (startY - endY) * 0.75;

              return (
                <>
                  {/* Stem shadow */}
                  <path
                    d={`M ${startX + 1} ${startY} C ${cp1X + 1} ${cp1Y}, ${cp2X + 1} ${cp2Y}, ${endX + 1} ${endY}`}
                    stroke="rgba(0, 0, 0, 0.12)"
                    strokeWidth="11"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Stem body */}
                  <path
                    d={`M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`}
                    stroke="url(#stemGrad)"
                    strokeWidth="9"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Stem subtle light rib */}
                  <path
                    d={`M ${startX - 1} ${startY} C ${cp1X - 1} ${cp1Y}, ${cp2X - 1} ${cp2Y}, ${endX - 1} ${endY}`}
                    stroke="rgba(255, 255, 255, 0.4)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </>
              );
            })()}

            {/* LEAF 1: Lower Left Leaf */}
            {leaf1Progress > 0 && (
              <g
                transform={`translate(348, ${650 - currentStemHeight * 0.3}) scale(${leaf1Progress})`}
                style={{
                  transformOrigin: '0 0',
                  transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              >
                <g transform="rotate(-35)">
                  {/* Leaf shape */}
                  <path
                    d="M 0 0 C -40 -12 -75 -40 -105 -25 C -80 15 -45 25 0 0 Z"
                    fill="url(#leafGrad)"
                    filter="url(#softGlow)"
                    opacity="0.95"
                  />
                  {/* Leaf vein */}
                  <path
                    d="M 0 0 Q -50 -10 -100 -25"
                    stroke="#86efac"
                    strokeWidth="2"
                    fill="none"
                  />
                  {/* Cute glistening dew drop on leaf tip */}
                  <circle cx="-100" cy="-24" r="3.5" fill="#ffffff" opacity="0.9" />
                  <circle cx="-99" cy="-25" r="1.5" fill="#bae6fd" />
                </g>
              </g>
            )}

            {/* LEAF 2: Middle Right Leaf */}
            {leaf2Progress > 0 && (
              <g
                transform={`translate(352, ${650 - currentStemHeight * 0.58}) scale(${leaf2Progress})`}
                style={{
                  transformOrigin: '0 0',
                  transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              >
                <g transform="rotate(30)">
                  <path
                    d="M 0 0 C 35 -10 70 -35 98 -20 C 75 16 40 22 0 0 Z"
                    fill="url(#leafGrad)"
                    opacity="0.95"
                  />
                  <path
                    d="M 0 0 Q 45 -8 92 -20"
                    stroke="#86efac"
                    strokeWidth="2"
                    fill="none"
                  />
                  {/* Morning dew drop */}
                  <circle cx="92" cy="-20" r="3.2" fill="#ffffff" opacity="0.9" />
                  <circle cx="93" cy="-21" r="1.2" fill="#bae6fd" />
                </g>
              </g>
            )}

            {/* LEAF 3: Upper Left Small Leaf */}
            {leaf3Progress > 0 && (
              <g
                transform={`translate(349, ${650 - currentStemHeight * 0.8}) scale(${leaf3Progress * 0.75})`}
                style={{
                  transformOrigin: '0 0',
                  transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              >
                <g transform="rotate(-40)">
                  <path
                    d="M 0 0 C -25 -8 -50 -25 -70 -15 C -55 10 -30 15 0 0 Z"
                    fill="url(#leafGrad)"
                    opacity="0.95"
                  />
                  <path
                    d="M 0 0 Q -35 -6 -65 -15"
                    stroke="#86efac"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </g>
              </g>
            )}
          </g>
        )}

        {/* ---------------- FLOWER HEAD (SEPALS, PETALS, PHOTOS, CENTER) ---------------- */}
        {stemProgress > 0.4 && (
          <g
            id="flower-head-container"
            transform={`translate(${350 + windOffsetHead}, ${currentFlowerY}) rotate(${windSwayDeg})`}
            style={{ transformOrigin: '0 0' }}
          >
            {/* Green Sepals (Calyx) holding the base of the flower */}
            <g id="sepals">
              {[-50, -25, 0, 25, 50].map((deg, i) => {
                const openAngle = deg * (1 + (1 - bloomProgress) * 0.4);
                return (
                  <path
                    key={`sepal-${i}`}
                    d="M 0 0 C -12 18 -18 36 -6 48 C 6 36 12 18 0 0 Z"
                    transform={`rotate(${openAngle})`}
                    fill="#15803d"
                    stroke="#166534"
                    strokeWidth="1"
                    opacity="0.85"
                  />
                );
              })}
            </g>

            {/* BUD STAGE (When bloomProgress < 0.3) */}
            {bloomProgress < 0.35 && budProgress > 0 && (
              <g
                id="flower-bud"
                transform={`scale(${budProgress * (1 - bloomProgress * 0.95)})`}
                style={{ transformOrigin: '0 0' }}
              >
                {/* Bud outer glow */}
                <ellipse cx="0" cy="-28" rx="26" ry="36" fill={theme.petalBorder} opacity="0.3" filter="url(#softGlow)" />
                {/* Bud body */}
                <ellipse cx="0" cy="-28" rx="22" ry="32" fill="url(#floralPetalGrad)" />
                {/* Wrapped sepal leaves over the bud */}
                <path d="M -16 0 C -24 -20 -15 -48 0 -62 C 3 -40 2 -10 0 0 Z" fill="#22c55e" opacity="0.85" />
                <path d="M 16 0 C 24 -20 15 -48 0 -62 C -3 -40 -2 -10 0 0 Z" fill="#16a34a" opacity="0.85" />
              </g>
            )}

            {/* FULL BLOOM STAGE: INTERLEAVED PETALS & PHOTOS */}
            {bloomProgress > 0.05 && (
              <g
                id="blooming-petals-group"
                transform={`scale(${0.15 + bloomProgress * 0.85})`}
                style={{
                  transformOrigin: '0 0',
                  transition: 'transform 0.1s linear'
                }}
              >
                {/* 1. LAYER 1: OUTER FLORAL PETALS (Alternating) */}
                <g id="floral-petals-layer">
                  {Array.from({ length: count }).map((_, i) => {
                    // Angular position for floral petal
                    const angle = i * (360 / count);
                    // Radial opening distance
                    const petalSpread = 16 * bloomProgress;

                    return (
                      <g
                        key={`flower-petal-${i}`}
                        transform={`rotate(${angle}) translate(0, ${-petalSpread})`}
                      >
                        {/* Shadow */}
                        <path
                          d="M 0,0 C -42,-40 -56,-120 -20,-168 C 0,-188 0,-188 20,-168 C 56,-120 42,-40 0,0 Z"
                          fill="rgba(0,0,0,0.06)"
                          transform="translate(0, 5)"
                        />
                        {/* Petal Outer */}
                        <path
                          d="M 0,0 C -42,-40 -56,-120 -20,-168 C 0,-188 0,-188 20,-168 C 56,-120 42,-40 0,0 Z"
                          fill="url(#floralPetalGrad)"
                          stroke={theme.petalBorder}
                          strokeWidth="1.5"
                          filter="url(#petalShadowFilter)"
                        />
                        {/* Petal Inner Delicate Highlight */}
                        <path
                          d="M 0,0 C -22,-35 -30,-95 -10,-140 C 0,-155 0,-155 10,-140 C 30,-95 22,-35 0,0 Z"
                          fill="url(#innerPetalGrad)"
                          opacity="0.8"
                        />
                        {/* Petal Fine Veins */}
                        <path
                          d="M 0,-15 Q -10,-80 -14,-150"
                          stroke="rgba(255, 255, 255, 0.6)"
                          strokeWidth="1.5"
                          fill="none"
                        />
                        <path
                          d="M 0,-15 Q 10,-80 14,-150"
                          stroke="rgba(255, 255, 255, 0.6)"
                          strokeWidth="1.5"
                          fill="none"
                        />
                        <path
                          d="M 0,-20 L 0,-165"
                          stroke="rgba(255, 255, 255, 0.75)"
                          strokeWidth="2"
                          fill="none"
                        />
                      </g>
                    );
                  })}
                </g>

                {/* 2. LAYER 2: INTERLEAVED PHOTO PETALS */}
                <g id="photo-petals-layer">
                  {photoPetals.map((petal, i) => {
                    // Offset by half a slice so photo petals sit EXACTLY between floral petals!
                    const angle = i * (360 / count) + (180 / count);
                    const isHovered = hoveredPetalId === petal.id;
                    const hoverScale = isHovered ? 1.14 : 1.0;
                    const hoverTranslateY = isHovered ? -22 : 0;
                    const photoSpread = 22 * bloomProgress;

                    return (
                      <g
                        key={`photo-petal-${petal.id}`}
                        transform={`rotate(${angle}) translate(0, ${-photoSpread + hoverTranslateY}) scale(${hoverScale})`}
                        style={{
                          transformOrigin: '0 0',
                          transition: 'transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={() => {
                          setHoveredPetalId(petal.id);
                          sounds.playPetalHoverSound();
                        }}
                        onMouseLeave={() => setHoveredPetalId(null)}
                        onClick={(e) => {
                          e.stopPropagation();
                          sounds.playPetalClickSound();
                          onSelectPetal(petal);
                        }}
                      >
                        {/* Petal Backing Frame with Rose-Gold / Theme Border */}
                        <path
                          d="M 0,0 C -38,-35 -50,-115 -19,-158 C 0,-178 0,-178 19,-158 C 50,-115 38,-35 0,0 Z"
                          fill="#ffffff"
                          stroke={isHovered ? '#f59e0b' : theme.petalBorder}
                          strokeWidth={isHovered ? 4 : 2.5}
                          filter="url(#petalShadowFilter)"
                        />

                        {/* Clipped Photo inside the Petal shape */}
                        <g clipPath={`url(#petal-clip-${petal.id})`}>
                          <image
                            href={petal.image}
                            x="-85"
                            y="-178"
                            width="170"
                            height="185"
                            preserveAspectRatio="xMidYMid slice"
                            className="transition-all duration-300"
                            style={{
                              filter: isHovered
                                ? 'brightness(1.08) contrast(1.05)'
                                : 'brightness(1) contrast(1)'
                            }}
                          />
                          {/* Soft photo tint overlay */}
                          <path
                            d="M 0,0 C -38,-35 -50,-115 -19,-158 C 0,-178 0,-178 19,-158 C 50,-115 38,-35 0,0 Z"
                            fill={theme.petalGradient[0]}
                            opacity={isHovered ? 0.05 : 0.16}
                          />
                        </g>

                        {/* Decorative Gold Rim Highlight */}
                        <path
                          d="M 0,-4 C -34,-37 -46,-113 -17,-154 C 0,-172 0,-172 17,-154 C 46,-113 34,-37 0,-4"
                          fill="none"
                          stroke={isHovered ? 'rgba(255, 235, 150, 0.9)' : 'rgba(255, 255, 255, 0.7)'}
                          strokeWidth={isHovered ? 2.5 : 1.5}
                        />

                        {/* Mini Heart / Camera Pin at tip of petal */}
                        <g transform="translate(0, -158) scale(0.85)">
                          <circle cx="0" cy="0" r="11" fill="#ffffff" filter="url(#softGlow)" />
                          <circle cx="0" cy="0" r="9" fill={isHovered ? '#f43f5e' : '#fb7185'} />
                          <path
                            d="M 0 -2 C -2 -5 -6 -5 -6 -2 C -6 2 0 6 0 6 C 0 6 6 2 6 -2 C 6 -5 2 -5 0 -2 Z"
                            fill="#ffffff"
                            transform="scale(0.8) translate(0, -1)"
                          />
                        </g>

                        {/* Interactive Hover Badge label */}
                        {isHovered && (
                          <g transform="translate(0, -195) rotate(-0)">
                            <rect
                              x="-65"
                              y="-16"
                              width="130"
                              height="30"
                              rx="15"
                              fill="#ffffff"
                              stroke="#fb7185"
                              strokeWidth="1.5"
                              filter="url(#softGlow)"
                            />
                            <text
                              x="0"
                              y="3"
                              textAnchor="middle"
                              fill="#881337"
                              fontSize="11"
                              fontWeight="bold"
                              fontFamily="sans-serif"
                            >
                              {petal.title}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </g>

                {/* 3. LAYER 3: INNER PETAL ROSETTE (Delicate mini accents) */}
                <g id="inner-rosette" transform={`scale(${bloomProgress})`}>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <circle
                      key={`inner-dot-${i}`}
                      cx={Math.cos((i * Math.PI) / 4) * 36}
                      cy={Math.sin((i * Math.PI) / 4) * 36}
                      r="12"
                      fill={theme.petalSecondaryGradient[1]}
                      opacity="0.85"
                    />
                  ))}
                </g>

                {/* 4. LAYER 4: CENTER STAMEN & PISTILS */}
                <g id="stamens">
                  {Array.from({ length: 16 }).map((_, i) => {
                    const angle = (i * 360) / 16;
                    const len = 34 + (i % 2 === 0 ? 6 : 0);
                    return (
                      <g key={`stamen-${i}`} transform={`rotate(${angle})`}>
                        <line
                          x1="0"
                          y1="0"
                          x2="0"
                          y2={-len}
                          stroke="#ca8a04"
                          strokeWidth="1.5"
                          opacity="0.85"
                        />
                        {/* Pollen anther dot */}
                        <circle
                          cx="0"
                          cy={-len}
                          r={i % 2 === 0 ? 3.5 : 2.5}
                          fill={theme.pollenColor}
                          filter="url(#softGlow)"
                        />
                      </g>
                    );
                  })}
                </g>

                {/* 5. FLOWER HEART (Pulsing warm interactive core) */}
                <g
                  id="flower-heart"
                  className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
                  onClick={(e) => {
                    e.stopPropagation();
                    sounds.playBloomChimes();
                    onCenterClick();
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label="Nhấn vào nhụy hoa để tung cánh hoa và ngân vang lời chúc"
                >
                  <title>Nhấn vào nhụy hoa để tung cánh hoa và ngân vang lời chúc!</title>
                  {/* Glowing background halo */}
                  <circle cx="0" cy="0" r="38" fill="url(#centerGlow)" filter="url(#softGlow)" />
                  {/* Middle ring */}
                  <circle
                    cx="0"
                    cy="0"
                    r="28"
                    fill={theme.centerColor}
                    stroke={theme.centerRingColor}
                    strokeWidth="3"
                  />
                  {/* Textured seed pattern inside center */}
                  {Array.from({ length: 9 }).map((_, i) => (
                    <circle
                      key={`seed-${i}`}
                      cx={Math.cos((i * Math.PI * 2) / 9) * 14}
                      cy={Math.sin((i * Math.PI * 2) / 9) * 14}
                      r="2.5"
                      fill={theme.pollenColor}
                    />
                  ))}
                  {/* Center Golden Sparkle */}
                  <circle cx="0" cy="0" r="7" fill="#ffffff" opacity="0.95" />
                  <Sparkles
                    x="-8"
                    y="-8"
                    width="16"
                    height="16"
                    className="text-amber-600 animate-spin"
                    style={{ animationDuration: '8s' }}
                  />
                </g>
              </g>
            )}
          </g>
        )}
      </svg>

      {/* Floating click tip when bloomed */}
      {bloomProgress > 0.85 && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-white/80 px-3.5 py-1 text-xs font-semibold text-rose-700 shadow-sm backdrop-blur-md transition-all duration-300">
          <Eye className="h-3.5 w-3.5 text-rose-500 animate-pulse" />
          <span>Chạm vào từng cánh ảnh để mở trọn vẹn kỷ niệm</span>
        </div>
      )}
    </div>
  );
};
