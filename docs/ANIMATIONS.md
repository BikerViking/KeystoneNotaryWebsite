# Animation & Motion Guidelines

This project favors clear, premium-feeling motion while protecting accessibility and performance.

## Principles

- 60fps where possible: only `transform` and `opacity` animate.
- Respect `prefers-reduced-motion`: provide calm fades / static layouts.
- Use easing with intention (`cubic-bezier(.22,.61,.36,1)` for micro, sine/cubic for scroll scrub).
- Avoid heavy work in scroll handlers; prefer `requestAnimationFrame`.

## Implementation Notes

### Hero
- Parallax on background (stronger) and content (softer) tied to window scroll.
- Headline words reveal with stagger using `useOnScreen`.

### Services
- Pinned window (`h-[320vh]`) scrubs the toss-in sequence.
- Each card has a unique window and arc path; dynamic shadow clarifies layering.
- Progress rail reports scrub progress and is accessible.

### About
- Perspective container + `translate3d` glides.
- Image moves from left and depth; headline/copy from right; small blur->sharp as they approach.
- A tiny smoothing loop (lerp) provides inertia; gated by visibility.

### FAQ
- Accessible accordion with measured height expansion to avoid clipping.

## Reduced Motion

Guard code paths check `matchMedia('(prefers-reduced-motion: reduce)')` to minimize animation.

## Tuning

Key parameters live near the top of each component:
- Distances (px, vh), depth (translateZ), and timing windows (normalized progress spans).
- Use small increments (5–10px or 0.02 progress) to keep changes controlled.

## Animation Catalog (Reference)

- Parallax (Hero): background translateY + subtle scale, content translateY; vignette + gradient overlays.
- Word-by-word reveal (Hero): staggered fade/slide-up per word using IntersectionObserver.
- Sticky scrub (Services): section is pinned; animation progress scrubs with scroll.
- Toss-in arcs (Services): each card animates along a bezier-like arc (sinusoidal Y) with rotation, staggered windows.
- Depth layering (Services): dynamic drop-shadow scales with progress to clarify z-order.
- Progress rail (Services): accessible progressbar indicating scrub progress.
- Glide-to-meet with depth (About): image from left/depth; text from right/depth; translate3d + scale + blur→sharp.
- On-view fade/slide (FAQ, Contact): `AnimatedOnView` handles IntersectionObserver-driven reveal with delay.
- Accordion height fade/slide (FAQ): expands to measured height; fades and slides.
- Shimmer sweep (Recent Jobs): ::after gradient sweeping across “Today” cards; reduced-motion safe; clipped to card.
- Live pulse (Recent Jobs): small green dot pulsing with easing; reduced-motion safe.

