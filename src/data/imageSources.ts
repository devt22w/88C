import type { SlotSources } from '../types';

/**
 * SECTION 11 — the single wiring point for the database phase.
 *
 * Fill a slot name with a URL and that image appears in exactly the position,
 * size and aspect ratio the layout already reserved for it. Leave it out and
 * the neutral placeholder of the same box renders instead, so the page never
 * shifts between the two states.
 *
 * Injection rules kept by the markup, not by the data:
 *   - the cell / band / column always owns its width, height or ratio;
 *   - product masters must be square (the card reserves a 1:1 area);
 *   - the 44px two-line description clamp and the 15px colour-chip row are the
 *     guards that keep a three-up row baseline-aligned on uneven data;
 *   - everything below the hero loads lazily, the first hero slide loads eager.
 */
export const imageSources: SlotSources = {
  // logo_header: 'https://cdn.example.com/logo.png',
  // hero_slide_1: 'https://cdn.example.com/hero-1.jpg',
  // product_thumb_b1: 'https://cdn.example.com/products/b1.jpg',
};
