import React, { useState, useEffect } from 'react';
import { FlowerTheme, PhotoPetal, FlowerStemConfig } from '../types/flower';
import { DEFAULT_BOUQUET_STEMS } from '../data/flowerPresets';
import { sounds } from '../utils/audio';
import { Heart, Sparkles, ZoomIn } from 'lucide-react';

interface BloomingFlowerBouquetProps {
  progress: number; // 0.0 to 1.0
  theme: FlowerTheme;
  photoPetals: PhotoPetal[];
  onSelectPhoto: (photo: PhotoPetal) => void;
  onFlowerClick: (stemId: string) => void;
}

export const BloomingFlowerBouquet: React.FC<BloomingFlowerBouquetProps> = ({
  progress,
  theme,
  photoPetals,
  onSelectPhoto,
  onFlowerClick
}) => {
  const [swayTime, setSwayTime] = useState(0);
  const [hoveredStemId, setHoveredStemId] = useState<string | null>(null);

  // Smooth continuous organic wind sway loop
  useEffect(() => {
    let animId: number;
    let t = 0;
    const animate = () => {
      t += 0.022;
      setSwayTime(t);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Growth stages calculation based on progress (0 to 1)
  // 1. Sprout & Ground crack: 0.0 -> 0.15
  const groundSprout = Math.min(1, Math.max(0, progress / 0.18));
  // 2. Stems rising: 0.10 -> 0.65
  const stemGrowth = Math.min(1, Math.max(0, (progress - 0.1) / 0.55));
  // 3. Leaves unfurling: 0.22 -> 0.68
  const leafGrowth = Math.min(1, Math.max(0, (progress - 0.22) / 0.46));
  // 4. Bud formation: 0.50 -> 0.75
  const budGrowth = Math.min(1, Math.max(0, (progress - 0.50) / 0.25));
  // 5. Flowers blooming: 0.68 -> 1.0
  const bloomProgress = Math.min(1, Math.max(0, (progress - 0.68) / 0.32));

  // Ground base coordinates
  const groundX = 400;
  const groundY = 700;

  // Stems configuration
  const stems = DEFAULT_BOUQUET_STEMS;

  return (
    <div className="relative mx-auto flex h-full max-h-[58vh] min-h-[260px] w-full max-w-[720px] select-none items-center justify-center">
      <svg
        viewBox="0 0 800 800"
        className="h-full w-full overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Flower Petal Gradients */}
          <linearGradient id="bouquetPetalGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={theme.petalGradient[0]} stopOpacity="0.95" />
            <stop offset="45%" stopColor={theme.petalGradient[1]} stopOpacity="0.98" />
            <stop offset="85%" stopColor={theme.petalGradient[2]} stopOpacity="1" />
            <stop offset="100%" stopColor={theme.petalGradient[3]} stopOpacity="1" />
          </linearGradient>

          <linearGradient id="bouquetSecondaryGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={theme.petalSecondaryGradient[0]} />
            <stop offset="50%" stopColor={theme.petalSecondaryGradient[1]} />
            <stop offset="100%" stopColor={theme.petalSecondaryGradient[2]} />
          </linearGradient>

          <linearGradient id="bouquetStemGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#15803d" />
            <stop offset="30%" stopColor={theme.stemColor} />
            <stop offset="100%" stopColor={theme.stemLightColor} />
          </linearGradient>

          <linearGradient id="bouquetLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.stemLightColor} />
            <stop offset="50%" stopColor={theme.leafColor} />
            <stop offset="100%" stopColor="#14532d" />
          </linearGradient>

          <radialGradient id="bouquetCenterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="35%" stopColor={theme.pollenColor} stopOpacity="1" />
            <stop offset="75%" stopColor={theme.centerRingColor} stopOpacity="1" />
            <stop offset="100%" stopColor={theme.centerColor} stopOpacity="1" />
          </radialGradient>

          {/* Soft bloom filters */}
          <filter id="bouquetGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="bouquetShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="5"
              stdDeviation="6"
              floodColor={theme.petalShadow}
              floodOpacity="0.5"
            />
          </filter>

          {/* Scalloped Flower Frame Clip Paths for the photo flowers */}
          {photoPetals.map((photo) => (
            <clipPath id={`flower-frame-clip-${photo.id}`} key={`photo-clip-${photo.id}`}>
              <circle cx="0" cy="0" r="46" />
            </clipPath>
          ))}
        </defs>

        {/* ---------------- 1. BACKGROUND GLOW & FIREFLIES ---------------- */}
        <g id="fairy-lights">
          {stemGrowth > 0.2 &&
            [
              { x: 380, y: 560, r: 3, delay: 0 },
              { x: 290, y: 440, r: 2.5, delay: 1.2 },
              { x: 480, y: 420, r: 3.5, delay: 2.1 },
              { x: 240, y: 520, r: 2, delay: 0.8 },
              { x: 550, y: 500, r: 2.5, delay: 1.7 },
              { x: 340, y: 350, r: 3, delay: 2.8 },
              { x: 460, y: 310, r: 2.8, delay: 1.5 }
            ].map((light, idx) => {
              const pulse = (Math.sin(swayTime * 2 + light.delay) + 1) / 2;
              const yFloat = light.y - (swayTime * 8 + idx * 25) % 180;
              return (
                <g key={`light-${idx}`} transform={`translate(${light.x}, ${yFloat})`} opacity={0.6 + pulse * 0.4}>
                  <circle cx="0" cy="0" r={light.r * 2.8} fill={theme.pollenColor} opacity="0.35" filter="url(#bouquetGlow)" />
                  <circle cx="0" cy="0" r={light.r} fill="#ffffff" />
                </g>
              );
            })}
        </g>

        {/* ---------------- 2. GROUND & SOIL BASE ---------------- */}
        <g id="ground-base">
          {/* Deep back earth curve */}
          <path
            d="M -50 820 Q 250 670 400 675 T 850 820 Z"
            fill="url(#soilBackGrad)"
            opacity="0.8"
          />
          <linearGradient id="soilBackGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="40%" stopColor="#15803d" />
            <stop offset="100%" stopColor="#713f12" />
          </linearGradient>

          {/* Lush mossy mound */}
          <path
            d="M -30 820 C 180 665, 320 650, 400 655 C 480 650, 620 665, 830 820 Z"
            fill="url(#soilMainGrad)"
          />
          <linearGradient id="soilMainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="25%" stopColor={theme.stemColor} />
            <stop offset="55%" stopColor="#166534" />
            <stop offset="85%" stopColor="#78350f" />
            <stop offset="100%" stopColor="#3d1a04" />
          </linearGradient>

          {/* Grass blades and ferns surrounding the base */}
          <g id="grass-tufts" opacity="0.95">
            <path d="M 280 685 Q 260 620 230 610 Q 260 640 285 685 Z" fill={theme.stemLightColor} />
            <path d="M 310 680 Q 285 605 255 595 Q 290 630 315 680 Z" fill={theme.leafColor} />
            <path d="M 330 675 Q 315 615 290 610 Q 325 640 335 675 Z" fill="#86efac" />

            <path d="M 520 685 Q 545 620 575 610 Q 545 640 515 685 Z" fill={theme.stemLightColor} />
            <path d="M 490 680 Q 515 605 545 595 Q 510 630 485 680 Z" fill={theme.leafColor} />
            <path d="M 470 675 Q 485 615 510 610 Q 475 640 465 675 Z" fill="#86efac" />

            {/* Center sprout hole */}
            <ellipse cx="400" cy="662" rx="36" ry="10" fill="#291202" opacity="0.85" />
            <ellipse cx="400" cy="662" rx="26" ry="6" fill="#140801" opacity="0.95" />
          </g>
        </g>

        {/* ---------------- 3. FLOWER STEMS & LEAVES ---------------- */}
        {stemGrowth > 0 && (
          <g id="stems-and-leaves">
            {stems.map((stem) => {
              const currentH = stem.stemHeight * stemGrowth;
              const swayOffset = Math.sin(swayTime * 1.3 + stem.swayDelay) * (14 + Math.abs(stem.leanAngle) * 0.4) * stemGrowth;
              const endX = groundX + stem.curveX + swayOffset;
              const endY = groundY - currentH;

              const cp1X = groundX + stem.curveX * 0.25;
              const cp1Y = groundY - currentH * 0.45;
              const cp2X = groundX + stem.curveX * 0.85 + swayOffset * 0.6;
              const cp2Y = groundY - currentH * 0.8;

              const stemLeafProgress = Math.min(1, Math.max(0, (progress - 0.2 - stem.swayDelay * 0.08) / 0.4));

              return (
                <g key={`stem-group-${stem.id}`}>
                  {/* Stem shadow */}
                  <path
                    d={`M ${groundX + 1} ${groundY} C ${cp1X + 1} ${cp1Y}, ${cp2X + 1} ${cp2Y}, ${endX + 1} ${endY}`}
                    stroke="rgba(0,0,0,0.14)"
                    strokeWidth="9"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Stem body */}
                  <path
                    d={`M ${groundX} ${groundY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`}
                    stroke="url(#bouquetStemGrad)"
                    strokeWidth="7"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Stem highlight rim */}
                  <path
                    d={`M ${groundX - 1} ${groundY} C ${cp1X - 1} ${cp1Y}, ${cp2X - 1} ${cp2Y}, ${endX - 1} ${endY}`}
                    stroke="rgba(255, 255, 255, 0.45)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                  />

                  {/* STEM LEAVES */}
                  {stemLeafProgress > 0 && (
                    <>
                      {/* Leaf 1 (Lower) */}
                      <g
                        transform={`translate(${groundX + stem.curveX * 0.35}, ${groundY - currentH * 0.4}) scale(${stemLeafProgress})`}
                        style={{ transformOrigin: '0 0' }}
                      >
                        <g transform={`rotate(${stem.leanAngle < 0 ? -40 : 38})`}>
                          <path
                            d={
                              stem.leanAngle < 0
                                ? 'M 0 0 C -35 -12 -65 -35 -90 -20 C -68 15 -35 20 0 0 Z'
                                : 'M 0 0 C 35 -12 65 -35 90 -20 C 68 15 35 20 0 0 Z'
                            }
                            fill="url(#bouquetLeafGrad)"
                            opacity="0.95"
                          />
                          <circle
                            cx={stem.leanAngle < 0 ? -86 : 86}
                            cy="-20"
                            r="2.8"
                            fill="#ffffff"
                            opacity="0.9"
                          />
                        </g>
                      </g>

                      {/* Leaf 2 (Upper) */}
                      {stemLeafProgress > 0.4 && (
                        <g
                          transform={`translate(${groundX + stem.curveX * 0.7}, ${groundY - currentH * 0.72}) scale(${stemLeafProgress * 0.85})`}
                          style={{ transformOrigin: '0 0' }}
                        >
                          <g transform={`rotate(${stem.leanAngle < 0 ? 30 : -34})`}>
                            <path
                              d={
                                stem.leanAngle < 0
                                  ? 'M 0 0 C 28 -10 52 -28 72 -16 C 54 12 28 16 0 0 Z'
                                  : 'M 0 0 C -28 -10 -52 -28 -72 -16 C -54 12 -28 16 0 0 Z'
                              }
                              fill="url(#bouquetLeafGrad)"
                              opacity="0.95"
                            />
                            <circle
                              cx={stem.leanAngle < 0 ? 68 : -68}
                              cy="-16"
                              r="2.4"
                              fill="#ffffff"
                              opacity="0.9"
                            />
                          </g>
                        </g>
                      )}
                    </>
                  )}
                </g>
              );
            })}
          </g>
        )}

        {/* ---------------- 4. FLOWER HEADS (BUDS -> FULL BLOOM) ---------------- */}
        {stemGrowth > 0.4 && (
          <g id="flower-heads">
            {stems.map((stem) => {
              const currentH = stem.stemHeight * stemGrowth;
              const swayOffset = Math.sin(swayTime * 1.3 + stem.swayDelay) * (14 + Math.abs(stem.leanAngle) * 0.4) * stemGrowth;
              const headX = groundX + stem.curveX + swayOffset;
              const headY = groundY - currentH;

              const isHovered = hoveredStemId === stem.id;
              const associatedPhoto =
                stem.photoIndex !== undefined ? photoPetals[stem.photoIndex % photoPetals.length] : null;

              const headScale = (0.2 + bloomProgress * 0.8) * stem.scale * (isHovered ? 1.12 : 1.0);
              const headRotation = stem.leanAngle + Math.sin(swayTime * 1.3 + stem.swayDelay) * 4;

              return (
                <g
                  key={`head-container-${stem.id}`}
                  transform={`translate(${headX}, ${headY}) rotate(${headRotation})`}
                  style={{
                    cursor: associatedPhoto && bloomProgress > 0.7 ? 'pointer' : 'default',
                    transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                  onMouseEnter={() => {
                    setHoveredStemId(stem.id);
                    if (associatedPhoto && bloomProgress > 0.7) sounds.playPetalHoverSound();
                  }}
                  onMouseLeave={() => setHoveredStemId(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (associatedPhoto && bloomProgress > 0.7) {
                      sounds.playPetalClickSound();
                      onSelectPhoto(associatedPhoto);
                    } else {
                      sounds.playBloomChimes();
                      onFlowerClick(stem.id);
                    }
                  }}
                >
                  {/* Calyx / Sepals below flower */}
                  <g id="calyx">
                    {[-35, 0, 35].map((ang, sIdx) => (
                      <path
                        key={`sepal-${sIdx}`}
                        d="M 0 0 C -8 16 -12 28 -4 38 C 4 28 8 16 0 0 Z"
                        transform={`rotate(${ang})`}
                        fill="#15803d"
                        stroke="#166534"
                        strokeWidth="1"
                        opacity="0.9"
                      />
                    ))}
                  </g>

                  {/* BUD PHASE (When bloomProgress is low) */}
                  {bloomProgress < 0.35 && budGrowth > 0 && (
                    <g
                      transform={`scale(${budGrowth * (1 - bloomProgress * 0.85)})`}
                      style={{ transformOrigin: '0 0' }}
                    >
                      <ellipse cx="0" cy="-22" rx="18" ry="26" fill={theme.petalBorder} opacity="0.3" filter="url(#bouquetGlow)" />
                      <ellipse cx="0" cy="-22" rx="16" ry="24" fill="url(#bouquetPetalGrad)" />
                      {/* Wrapped green calyx leaves over bud */}
                      <path d="M -12 0 C -18 -15 -12 -36 0 -46 C 2 -30 2 -10 0 0 Z" fill="#22c55e" opacity="0.85" />
                      <path d="M 12 0 C 18 -15 12 -36 0 -46 C -2 -30 -2 -10 0 0 Z" fill="#16a34a" opacity="0.85" />
                    </g>
                  )}

                  {/* BLOOMED PHASE: PHOTO FLOWER */}
                  {stem.type === 'photo' && associatedPhoto && bloomProgress > 0.1 && (
                    <g
                      id={`photo-flower-${stem.id}`}
                      transform={`scale(${headScale})`}
                      style={{
                        transformOrigin: '0 0',
                        opacity: Math.min(1, bloomProgress * 1.5)
                      }}
                    >
                      {/* Outer Flower Petal Frame: 10 petals fanning out around the photo */}
                      <g id="flower-frame-petals">
                        {Array.from({ length: 10 }).map((_, pIdx) => {
                          const angle = (pIdx * 360) / 10;
                          return (
                            <g key={`frame-petal-${pIdx}`} transform={`rotate(${angle}) translate(0, -42)`}>
                              <path
                                d="M 0 0 C -20 -15 -25 -42 -10 -58 C 0 -66 0 -66 10 -58 C 25 -42 20 -15 0 0 Z"
                                fill="url(#bouquetPetalGrad)"
                                stroke={theme.petalBorder}
                                strokeWidth="1.6"
                                filter="url(#bouquetShadow)"
                              />
                              <path
                                d="M 0 -5 C -10 -16 -12 -34 -5 -46 C 0 -52 0 -52 5 -46 C 12 -34 10 -16 0 -5 Z"
                                fill="url(#bouquetSecondaryGrad)"
                                opacity="0.85"
                              />
                              <line
                                x1="0"
                                y1="-8"
                                x2="0"
                                y2="-52"
                                stroke="rgba(255, 255, 255, 0.75)"
                                strokeWidth="1.5"
                              />
                            </g>
                          );
                        })}
                      </g>

                      {/* Golden / Rose-Gold Frame Rim */}
                      <circle
                        cx="0"
                        cy="0"
                        r="52"
                        fill="#ffffff"
                        stroke={isHovered ? '#f59e0b' : theme.petalBorder}
                        strokeWidth={isHovered ? 4.5 : 3.5}
                        filter="url(#bouquetShadow)"
                      />

                      {/* Clipped Image inside Flower Frame */}
                      <g clipPath={`url(#flower-frame-clip-${associatedPhoto.id})`}>
                        <image
                          href={associatedPhoto.image}
                          x="-50"
                          y="-50"
                          width="100"
                          height="100"
                          preserveAspectRatio="xMidYMid slice"
                          className="transition-all duration-300"
                          style={{
                            filter: isHovered
                              ? 'brightness(1.1) contrast(1.05)'
                              : 'brightness(1) contrast(1)'
                          }}
                        />
                        {/* Soft subtle photo tint overlay */}
                        <circle
                          cx="0"
                          cy="0"
                          r="46"
                          fill={theme.petalGradient[0]}
                          opacity={isHovered ? 0.05 : 0.14}
                        />
                      </g>

                      {/* Decorative Golden Scallop Beads around photo rim */}
                      {Array.from({ length: 16 }).map((_, bIdx) => (
                        <circle
                          key={`bead-${bIdx}`}
                          cx={Math.cos((bIdx * Math.PI * 2) / 16) * 49}
                          cy={Math.sin((bIdx * Math.PI * 2) / 16) * 49}
                          r="2.2"
                          fill={isHovered ? '#fbbf24' : '#ffffff'}
                          stroke={theme.petalBorder}
                          strokeWidth="0.8"
                        />
                      ))}

                      {/* Cute Pearl / Heart Sticker at top corner */}
                      <g transform="translate(32, -32) scale(0.85)">
                        <circle cx="0" cy="0" r="11" fill="#ffffff" filter="url(#bouquetGlow)" />
                        <circle cx="0" cy="0" r="9" fill={isHovered ? '#f43f5e' : '#fb7185'} />
                        <Heart
                          x="-6"
                          y="-6"
                          width="12"
                          height="12"
                          className="fill-white text-white"
                        />
                      </g>

                      {/* Hover Zoom Icon hint */}
                      {isHovered && (
                        <g transform="translate(0, 0)">
                          <circle cx="0" cy="0" r="16" fill="rgba(255,255,255,0.85)" />
                          <ZoomIn x="-8" y="-8" width="16" height="16" className="text-rose-600" />
                        </g>
                      )}
                    </g>
                  )}

                  {/* BLOOMED PHASE: NATURAL FLORAL BLOSSOM */}
                  {stem.type === 'floral' && bloomProgress > 0.1 && (
                    <g
                      id={`natural-flower-${stem.id}`}
                      transform={`scale(${headScale})`}
                      style={{
                        transformOrigin: '0 0',
                        opacity: Math.min(1, bloomProgress * 1.5)
                      }}
                    >
                      {/* Outer blooming petals */}
                      {Array.from({ length: 8 }).map((_, pIdx) => {
                        const angle = (pIdx * 360) / 8;
                        return (
                          <g key={`nat-petal-${pIdx}`} transform={`rotate(${angle})`}>
                            <path
                              d="M 0 0 C -24 -20 -30 -60 -12 -80 C 0 -90 0 -90 12 -80 C 30 -60 24 -20 0 0 Z"
                              fill="url(#bouquetPetalGrad)"
                              stroke={theme.petalBorder}
                              strokeWidth="1.5"
                              filter="url(#bouquetShadow)"
                            />
                            <path
                              d="M 0 -5 C -14 -18 -18 -48 -8 -65 C 0 -72 0 -72 8 -65 C 18 -48 14 -18 0 -5 Z"
                              fill="url(#bouquetSecondaryGrad)"
                              opacity="0.85"
                            />
                            <line
                              x1="0"
                              y1="-10"
                              x2="0"
                              y2="-75"
                              stroke="rgba(255, 255, 255, 0.7)"
                              strokeWidth="1.5"
                            />
                          </g>
                        );
                      })}

                      {/* Inner rosette petals */}
                      {Array.from({ length: 6 }).map((_, rIdx) => {
                        const angle = (rIdx * 360) / 6 + 30;
                        return (
                          <g key={`nat-inner-${rIdx}`} transform={`rotate(${angle})`}>
                            <ellipse
                              cx="0"
                              cy="-28"
                              rx="14"
                              ry="22"
                              fill={theme.petalSecondaryGradient[1]}
                              opacity="0.9"
                            />
                          </g>
                        );
                      })}

                      {/* Golden pollen stamens */}
                      {Array.from({ length: 12 }).map((_, sIdx) => {
                        const angle = (sIdx * 360) / 12;
                        return (
                          <g key={`nat-stamen-${sIdx}`} transform={`rotate(${angle})`}>
                            <line x1="0" y1="0" x2="0" y2="-24" stroke="#ca8a04" strokeWidth="1.5" />
                            <circle cx="0" cy="-24" r="2.8" fill={theme.pollenColor} filter="url(#bouquetGlow)" />
                          </g>
                        );
                      })}

                      {/* Glowing center button */}
                      <circle cx="0" cy="0" r="18" fill="url(#bouquetCenterGlow)" filter="url(#bouquetGlow)" />
                      <circle cx="0" cy="0" r="12" fill={theme.centerColor} stroke={theme.centerRingColor} strokeWidth="2" />
                      <circle cx="0" cy="0" r="4.5" fill="#ffffff" />
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        )}
      </svg>
    </div>
  );
};
