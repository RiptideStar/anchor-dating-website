"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { LandingWaitlistInput } from "@/components/LandingFooter";

// need to convert into a button with link
function AppStoreBadge() {
  return (
    <a
      href="#"
      className="inline-flex items-center gap-2 bg-black text-white rounded-xl px-5 py-2.5 hover:bg-neutral-800 transition-colors"
    >
      <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
        <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 21.99 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 21.99C7.79 22.03 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
      </svg>
      <div className="flex flex-col leading-none">
        <span className="text-[10px]">Download on the</span>
        <span className="text-xl font-semibold">App Store</span>
      </div>
    </a>
  );
}

export default function Page3() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Per-screen progress: each goes 0→1 over its quarter of the scroll
  const s1 = useTransform(scrollYProgress, [0, 1 / 4], [0, 1]);
  const s2 = useTransform(scrollYProgress, [1 / 4, 2 / 4], [0, 1]);
  const s3 = useTransform(scrollYProgress, [2 / 4, 3 / 4], [0, 1]);
  const s4 = useTransform(scrollYProgress, [3 / 4, 1], [0, 1]);

  // ===================== SCREEN 1 =====================
  const phoneOpacity = useTransform(s1, [0, 0.4], [1, 0]);
  const badgeOpacity = useTransform(s1, [0.05, 0.3], [1, 0]);
  const inputOpacity = useTransform(s1, [0.3, 0.55], [0, 1]);

  const clubTop = useTransform(s1, [0, 0.7], ["17%", "-17%"]);
  const clubLeft = useTransform(s1, [0, 0.7], ["32%", "-12%"]);
  const clubWidth = useTransform(s1, [0, 0.7], ["36%", "60%"]);

  const museumTop = useTransform(s1, [0, 0.7], ["39%", "25%"]);
  const museumLeft = useTransform(s1, [0, 0.7], ["32%", "7%"]);
  const museumWidth = useTransform(s1, [0, 0.7], ["36%", "87%"]);

  const cafeTop = useTransform(s1, [0, 0.7], ["61%", "84%"]);
  const cafeLeft = useTransform(s1, [0, 0.7], ["32%", "60%"]);
  const cafeWidth = useTransform(s1, [0, 0.7], ["36%", "44%"]);

  // ============ SCREEN 1 → 2 TRANSITION ============
  // Screen 1 images: page-turn left (slide out)
  const screen1ImagesOpacity = useTransform(s2, [0, 0.2], [1, 0]);
  const screen1TranslateX = useTransform(s2, [0, 0.2], ["0%", "-100%"]);

  const text1Opacity = useTransform(s2, [0, 0.2], [1, 0]);
  const text2Opacity = useTransform(s2, [0.15, 0.3], [0, 1]);

  // Bar image: page-turn in from right, then page-turn out to left
  const barTranslateX = useTransform(
    s2,
    [0.15, 0.3, 0.75, 0.9],
    ["100%", "0%", "0%", "-100%"],
  );
  const barOpacity = useTransform(s2, [0.15, 0.3, 0.75, 0.9], [0, 1, 1, 0]);

  // Height icon: walks in from right, walks out to left
  const heightIconTranslateX = useTransform(
    s2,
    [0.25, 0.45, 0.65, 0.8],
    ["150%", "0%", "0%", "-150%"],
  );
  const heightIconOpacity = useTransform(
    s2,
    [0.25, 0.45, 0.65, 0.8],
    [0, 1, 1, 0],
  );

  // ============ SCREEN 2 → 3 TRANSITION ============
  // Theatre image: page-turn in from right, page-turn out to left for S4
  const theatreTranslateX = useTransform(
    scrollYProgress,
    [0.47, 0.54, 0.6, 0.67],
    ["100%", "0%", "0%", "-100%"],
  );
  const theatreOpacity = useTransform(
    scrollYProgress,
    [0.47, 0.54, 0.6, 0.67],
    [0, 1, 1, 0],
  );

  // Notification icon (S3): walks in from left, walks out during S4 transition
  const notifIconTranslateX = useTransform(
    scrollYProgress,
    [0.47, 0.54, 0.6, 0.67],
    ["-150%", "0%", "0%", "-150%"],
  );
  const notifIconOpacity = useTransform(
    scrollYProgress,
    [0.47, 0.54, 0.6, 0.67],
    [0, 1, 1, 0],
  );

  // ============ SCREEN 3 → 4 TRANSITION ============
  // Brunch image: page-turn in from right in lower region
  const brunchTranslateX = useTransform(
    scrollYProgress,
    [0.6, 0.67],
    ["100%", "0%"],
  );
  const brunchOpacity = useTransform(scrollYProgress, [0.6, 0.67], [0, 1]);

  // Notification icon (S4): walks in from left at top-left corner
  const notifIcon4TranslateX = useTransform(
    scrollYProgress,
    [0.6, 0.67],
    ["-150%", "0%"],
  );
  const notifIcon4Opacity = useTransform(scrollYProgress, [0.6, 0.67], [0, 1]);

  // Left text: "Post" → "Find" transition (synced with brunch image fade-in)
  const postOpacity = useTransform(scrollYProgress, [0.6, 0.67], [1, 0]);
  const postY = useTransform(scrollYProgress, [0.6, 0.67], [0, -30]);
  const findOpacity = useTransform(scrollYProgress, [0.6, 0.67], [0, 1]);
  const findY = useTransform(scrollYProgress, [0.6, 0.67], [30, 0]);

  // ============ ANCHOR (spans all screens) ============
  // All raw scrollYProgress values ×0.75 (3 screens → 4 screens conversion)
  // S4: anchor walks up right edge from bottom=30% to bottom=85%
  const anchorBottom = useTransform(
    scrollYProgress,
    [0, 0.17, 0.28, 0.375, 0.435, 0.48, 0.49, 0.615, 0.63, 0.92],
    ["7%", "-14%", "-14%", "-5%", "-5%", "-5%", "30%", "30%", "30%", "85%"],
  );
  const anchorLeft = useTransform(
    scrollYProgress,
    [0, 0.17, 0.28, 0.375, 0.435, 0.48, 0.49, 0.92],
    ["29%", "-8%", "-8%", "38%", "38%", "55%", "75%", "75%"],
  );
  const anchorWidth = useTransform(
    scrollYProgress,
    [0, 0.17, 0.28, 0.375, 0.435, 0.48, 0.49, 0.92],
    ["18%", "40%", "40%", "28%", "28%", "28%", "25%", "25%"],
  );

  // Rotation: snaps to -90 while invisible (already rotated when fading in on right edge)
  const anchorRotate = useTransform(scrollYProgress, [0.48, 0.49], [0, -90]);

  // Outer group fades out while traveling along bottom, fades in rotated on right edge
  const outerGroupTransitionOpacity = useTransform(
    scrollYProgress,
    [0.435, 0.48, 0.5, 0.54],
    [1, 0, 0, 1],
  );

  // Inner/outer anchor crossfade at mid Screen 2
  const innerAnchorOpacity = useTransform(
    scrollYProgress,
    [0.35, 0.375],
    [1, 0],
  );
  const outerAnchorOpacity = useTransform(
    scrollYProgress,
    [0.35, 0.375],
    [0, 1],
  );

  // Text box opacity (text box is a child of outer anchor group)
  const textBoxOpacity = useTransform(s2, [0.1, 0.2], [0, 1]);

  // Text content crossfade
  const textContent2Opacity = useTransform(
    scrollYProgress,
    [0.36, 0.39, 0.45, 0.5],
    [0, 1, 1, 0],
  );
  const textContent3Opacity = useTransform(
    scrollYProgress,
    [0.49, 0.54, 0.6, 0.67],
    [0, 1, 1, 0],
  );
  const textContent4Opacity = useTransform(
    scrollYProgress,
    [0.65, 0.71],
    [0, 1],
  );

  return (
    <div ref={containerRef} className="relative" style={{ height: "800vh" }}>
      <div className="sticky top-0 w-full h-screen pt-20 lg:pt-12 px-6 lg:px-14 flex items-center">
        <div className="flex flex-col-reverse lg:flex-row w-full max-w-[1400px] mx-auto gap-6 lg:gap-0 items-center">
          {/* ===== LEFT SECTION ===== */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center lg:pr-16">
            <div className="relative">
              {/* Screen 1 text */}
              <motion.div style={{ opacity: text1Opacity }}>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.25rem] leading-[1.15] font-bold text-black">
                  Match on the <em className="italic">experience</em>,
                  <br />
                  not just a face.
                </h1>
                <div className="mt-6 lg:mt-8 relative h-14">
                  <motion.div
                    className="absolute top-0 left-0"
                    style={{ opacity: badgeOpacity }}
                  >
                    <AppStoreBadge />
                  </motion.div>
                  <motion.div
                    className="absolute top-0 left-0 w-full max-w-md"
                    style={{ opacity: inputOpacity }}
                  >
                    <LandingWaitlistInput />
                  </motion.div>
                </div>
              </motion.div>

              {/* Screen 2/3/4 text — "Post" swaps to "Find" during S4 */}
              <motion.div
                className="absolute top-0 left-0"
                style={{ opacity: text2Opacity }}
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.25rem] leading-[1.15] font-bold text-black">
                  <span className="relative inline-block overflow-hidden align-top">
                    <motion.span
                      className="inline-block"
                      style={{ y: postY, opacity: postOpacity }}
                    >
                      Post
                    </motion.span>
                    <motion.span
                      className="absolute left-0 top-0 inline-block"
                      style={{ y: findY, opacity: findOpacity }}
                    >
                      Find
                    </motion.span>
                  </span>{" "}
                  your <em className="italic">perfect</em> date.
                </h1>
              </motion.div>
            </div>
          </div>

          {/* ===== RIGHT SECTION (Gradient box) ===== */}
          <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-end">
            <div className="relative w-[75vw] max-w-[280px] sm:max-w-[360px] lg:w-full lg:max-w-[560px] aspect-square">
              {/* Outer gradient border */}
              <div
                className="w-full h-full rounded-3xl p-[6px] overflow-hidden"
                style={{
                  background:
                    "linear-gradient(160deg, rgba(200,210,230,0.4), rgba(190,205,230,0.3))",
                }}
              >
                {/* Inner gradient fill */}
                <div
                  className="relative w-full h-full rounded-[20px] overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(230,235,245,0.6), rgba(195,210,235,0.5))",
                  }}
                >
                  {/* Phone mockup (Screen 1) */}
                  <motion.div
                    className="absolute top-[8%] left-[29%] w-[42%] h-[84%] z-10"
                    style={{ opacity: phoneOpacity }}
                  >
                    <Image
                      src="/iphone.png"
                      alt="iPhone mockup"
                      fill
                      className="object-contain"
                    />
                  </motion.div>

                  {/* Screen 1 images (page-turn left on exit) */}
                  <motion.div
                    className="absolute inset-0 z-20"
                    style={{
                      opacity: screen1ImagesOpacity,
                      x: screen1TranslateX,
                    }}
                  >
                    {/* Club */}
                    <motion.div
                      className="absolute overflow-hidden rounded-xl"
                      style={{
                        top: clubTop,
                        left: clubLeft,
                        width: clubWidth,
                        aspectRatio: "940/555",
                      }}
                    >
                      <Image
                        src="/places-pics/Club Image 940x555.png"
                        alt="Club"
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                    {/* Museum */}
                    <motion.div
                      className="absolute overflow-hidden rounded-xl"
                      style={{
                        top: museumTop,
                        left: museumLeft,
                        width: museumWidth,
                        aspectRatio: "940/555",
                      }}
                    >
                      <Image
                        src="/places-pics/Museum 940x555.png"
                        alt="Museum"
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                    {/* Cafe */}
                    <motion.div
                      className="absolute overflow-hidden rounded-xl"
                      style={{
                        top: cafeTop,
                        left: cafeLeft,
                        width: cafeWidth,
                        aspectRatio: "940/555",
                      }}
                    >
                      <Image
                        src="/places-pics/Cafe 940x555.png"
                        alt="Cafe"
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  </motion.div>

                  {/* Bar image (Screen 2) */}
                  <motion.div
                    className="absolute z-20 top-[25%] left-[10%] w-[80%] overflow-hidden rounded-xl"
                    style={{
                      opacity: barOpacity,
                      x: barTranslateX,
                      aspectRatio: "940/555",
                    }}
                  >
                    <Image
                      src="/bar.png"
                      alt="Bar"
                      fill
                      className="object-cover"
                    />
                  </motion.div>

                  {/* Height verification icon (Screen 2) - on top of bar image */}
                  <motion.div
                    className="absolute z-20 top-[-3%] right-[5%] w-[30%]"
                    style={{
                      opacity: heightIconOpacity,
                      x: heightIconTranslateX,
                    }}
                  >
                    <Image
                      src="/anchor-icons/height_verification.png"
                      alt="Height verification"
                      width={300}
                      height={300}
                      className="w-full h-auto"
                    />
                  </motion.div>

                  {/* Theatre image (Screen 3) */}
                  <motion.div
                    className="absolute z-20 top-[25%] left-[10%] w-[80%] overflow-hidden rounded-xl"
                    style={{
                      opacity: theatreOpacity,
                      x: theatreTranslateX,
                      aspectRatio: "940/555",
                    }}
                  >
                    <Image
                      src="/places-pics/Theatre 940x555.png"
                      alt="Theatre"
                      fill
                      className="object-cover"
                    />
                  </motion.div>

                  {/* Notification icon (Screen 3) - walks in from left */}
                  <motion.div
                    className="absolute z-20 bottom-[0%] left-[5%] w-[30%]"
                    style={{
                      opacity: notifIconOpacity,
                      x: notifIconTranslateX,
                    }}
                  >
                    <Image
                      src="/anchor-icons/notification.png"
                      alt="Notification"
                      width={300}
                      height={300}
                      className="w-full h-auto"
                    />
                  </motion.div>

                  {/* Brunch image (Screen 4) - lower region, same width as theatre */}
                  <motion.div
                    className="absolute z-20 top-[45%] left-[10%] w-[80%] overflow-hidden rounded-xl"
                    style={{
                      opacity: brunchOpacity,
                      x: brunchTranslateX,
                      aspectRatio: "940/555",
                    }}
                  >
                    <Image
                      src="/places-pics/Brunch Breakfast.png"
                      alt="Brunch"
                      fill
                      className="object-cover"
                    />
                  </motion.div>

                  {/* Notification icon (Screen 4) - walks in from left at top-left corner */}
                  <motion.div
                    className="absolute z-20 top-[2%] left-[5%] w-[25%]"
                    style={{
                      opacity: notifIcon4Opacity,
                      x: notifIcon4TranslateX,
                      rotate: -15,
                    }}
                  >
                    <Image
                      src="/anchor-icons/notification.png"
                      alt="Notification"
                      width={300}
                      height={300}
                      className="w-full h-auto"
                    />
                  </motion.div>

                  {/* Inner anchor — clipped by overflow-hidden, visible during Screens 1-2 */}
                  <motion.div
                    className="absolute z-30"
                    style={{
                      bottom: anchorBottom,
                      left: anchorLeft,
                      width: anchorWidth,
                      opacity: innerAnchorOpacity,
                    }}
                  >
                    <Image
                      src="/anchor-icons/anchor.png"
                      alt="Anchor mascot"
                      width={200}
                      height={200}
                      className="w-full h-auto"
                    />
                  </motion.div>
                </div>
              </div>

              {/* Outer anchor + Text Box group — fades out/in during S2→S3 transition */}
              <motion.div
                className="absolute z-30"
                style={{
                  bottom: anchorBottom,
                  left: anchorLeft,
                  width: anchorWidth,
                  opacity: outerGroupTransitionOpacity,
                  rotate: anchorRotate,
                  transformOrigin: "100% 100%",
                }}
              >
                {/* Outer anchor image — fades in at mid Screen 2, determines wrapper size */}
                <motion.div style={{ opacity: outerAnchorOpacity }}>
                  <Image
                    src="/anchor-icons/anchor.png"
                    alt="Anchor mascot"
                    width={200}
                    height={200}
                    className="w-full h-auto"
                  />
                </motion.div>
                {/* Text box — below anchor */}
                <motion.div
                  className="absolute top-full left-0 w-full"
                  style={{ opacity: textBoxOpacity }}
                >
                  <div className="flex justify-center -mt-10">
                    <div className="relative bg-white rounded-xl shadow-lg px-4 py-2 whitespace-nowrap min-h-11 flex flex-col justify-center">
                      {/* Screen 2 text */}
                      <motion.div style={{ opacity: textContent2Opacity }}>
                        <p className="text-[10px] text-gray-400 leading-tight">
                          What?
                        </p>
                        <p className="text-sm font-bold text-black">
                          Drinks after sunset?
                        </p>
                      </motion.div>
                      {/* Screen 3 text */}
                      <motion.div
                        className="absolute inset-0 px-4 py-2 flex flex-col justify-center"
                        style={{ opacity: textContent3Opacity }}
                      >
                        <p className="text-[10px] text-gray-400 leading-tight">
                          What?
                        </p>
                        <p className="text-sm font-bold text-black">
                          Late-night theatre scenes
                        </p>
                      </motion.div>
                      {/* Screen 4 text */}
                      <motion.div
                        className="absolute inset-0 px-4 py-2 flex flex-col justify-center"
                        style={{ opacity: textContent4Opacity }}
                      >
                        <p className="text-[10px] text-gray-400 leading-tight">
                          What?
                        </p>
                        <p className="text-sm font-bold text-black">
                          Brunch after a hike?
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
