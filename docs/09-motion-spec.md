# Motion Specification

## Principles
1. **Purposeful** — Every animation communicates spatial relationships or state changes
2. **Subtle** — Motion supports the UI, never dominates it
3. **Fast** — Most animations complete in 150-250ms
4. **Consistent** — Same type of motion for same type of action
5. **60 FPS** — Only animate transform and opacity (composite-only properties)

---

## Sidebar

### Open
- Property: translateX(-100% → 0)
- Duration: 250ms
- Easing: cubic-bezier(0.32, 0.72, 0, 1) (spring-out)
- Body margin-left animates in sync

### Close
- Property: translateX(0 → -100%)
- Duration: 200ms
- Easing: cubic-bezier(0.4, 0, 1, 1) (ease-in)
- Body margin-left animates in sync

### Resize
- Property: width (no transition, follows cursor directly)
- Body margin-left follows in real-time
- On release: snap to nearest 10px grid with 100ms spring

---

## Folder Expand/Collapse

### Expand
- Children container: height 0 → auto (use max-height or Framer layout animation)
- Duration: 200ms
- Easing: ease-out
- Chevron rotates: 0deg → 90deg, 150ms
- Children items stagger fade-in: 30ms per item, max 5 items animated

### Collapse
- Children container: auto → 0
- Duration: 150ms
- Easing: ease-in
- Chevron rotates: 90deg → 0deg, 150ms
- Children fade-out simultaneously (no stagger)

---

## Items

### Appear (after add/import)
- Property: opacity 0→1, translateY(4px→0)
- Duration: 150ms
- Easing: ease-out

### Remove (after delete)
- Property: opacity 1→0, height auto→0, translateX(0→-8px)
- Duration: 150ms
- Easing: ease-in
- Subsequent items slide up with 200ms spring

### Reorder (after drag drop)
- Property: translateY (spring to new position)
- Spring: stiffness 300, damping 25
- Layout animation via Framer Motion

### Selection
- Background color transition: 120ms ease
- No position change

### Hover
- Background: 0ms delay, 120ms transition
- Dots menu: opacity 0→1, 80ms

---

## Search

### Input Focus
- Search box background: transition 150ms
- If expanding to full width: 200ms ease-out

### Results Appear
- Crossfade from tree to results: 150ms
- Results stagger in: 20ms per item, first 10 items
- Total time under 350ms

### Results Clear (Escape)
- Crossfade from results to tree: 120ms
- Tree appears instantly (already rendered underneath)

### Highlight Pulse
- Match text background: fade to yellow/accent, 200ms
- Subtle — not distracting

---

## Context Menu

### Open
- Property: opacity 0→1, scale(0.96→1)
- Transform-origin: top-left (or contextual based on position)
- Duration: 100ms
- Easing: ease-out

### Close
- Property: opacity 1→0
- Duration: 80ms
- Easing: ease-in
- No scale on close (instant feeling)

### Item Hover
- Background: 80ms transition
- No delay

---

## Dialogs

### Open
- Overlay: opacity 0→1, 120ms
- Dialog: opacity 0→1, translateY(6px→0)
- Duration: 180ms
- Easing: cubic-bezier(0.32, 0.72, 0, 1)

### Close
- Overlay: opacity 1→0, 100ms
- Dialog: opacity 1→0, translateY(0→4px)
- Duration: 120ms
- Easing: ease-in

---

## Toast Notifications

### Enter
- Property: opacity 0→1, translateY(8px→0)
- Duration: 150ms
- Easing: spring (stiffness 200, damping 20)

### Exit
- Property: opacity 1→0, translateY(0→-4px)
- Duration: 100ms
- Easing: ease-in

### Stack
- Existing toasts shift up with 150ms spring when new toast enters

---

## Drag & Drop

### Pick Up
- Source item: opacity 1→0.4, 100ms
- Ghost appears at cursor: opacity 0→1, scale(1→1.02), 80ms
- Shadow appears on ghost: 100ms

### During Drag
- Ghost follows cursor: No transition (direct follow)
- Drop indicator: height 0→2px, 80ms ease-out
- Folder auto-expand timer: 500ms (visual indicator fills)

### Drop
- Ghost: opacity 1→0, 80ms
- Item springs to new position: stiffness 300, damping 25
- Displaced items spring to new positions simultaneously

### Cancel (Escape)
- Ghost snaps back to source: 200ms spring
- Source item: opacity 0.4→1, 100ms

---

## Theme Transition

### Switch
- All color properties: 200ms ease
- No layout shift
- Background, text, border, shadow all transition together

---

## Reduced Motion

When `prefers-reduced-motion: reduce`:
- All durations → 0ms (instant)
- No spring animations
- No stagger effects
- Opacity transitions only (no transforms)
- Functional state changes still occur
- Focus indicators still visible

---

## Performance Budget
- Only animate `transform` and `opacity` in hot paths
- Height animations use `will-change: height` sparingly
- Virtualized list items: no animation on scroll, only on user-triggered changes
- Context menu: use CSS animations (lighter than JS springs)
- Dialogs: Framer Motion (need spring physics)
- Drag: requestAnimationFrame loop, no React re-renders during drag
