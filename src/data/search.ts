import { catalogue } from './site';
import type { ProductStructure } from './site';
import type { Messages } from '../i18n/types';

/**
 * Product search, run in the browser.
 *
 * The whole catalogue is 39 products, so an index sits in memory and every
 * keystroke re-ranks it. That is what makes the box feel live: no request, no
 * debounce, no spinner — one letter already narrows the list, and by the time
 * the word is specific enough only its product is left.
 *
 * What is matched, in order of how much it counts:
 *   1. the product name in the language on screen
 *   2. extra keywords loaded from the database (products.keywords)
 *   3. the two description lines
 *   4. the category, so "lip" finds the lip shelf
 *
 * A match at the start of a word outranks one in the middle, so typing "li"
 * surfaces LIPSTICK before "PEEL-OFF", which is what a shopper expects.
 */

export interface SearchEntry {
  product: ProductStructure;
  name: string;
  /** everything searchable, lowercased, with the weights baked in */
  fields: { text: string; weight: number }[];
}

export interface SearchHit {
  product: ProductStructure;
  name: string;
  score: number;
}

/**
 * Only the shelf's own name, never the product words that live on it: putting
 * "gloss" here would make every lip product answer to "gl", which is the
 * opposite of narrowing. Product words belong in the name or in `keywords`.
 */
const CATEGORY_WORDS: Record<string, string> = {
  eye: 'eye eyes mata',
  lip: 'lip lips bibir',
  face: 'face wajah',
  accTool: 'acc tool accessory alat'
};

/** strip the accents and the punctuation a shopper will not type */
export function normalise(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function buildIndex(
  copy: Messages['product']['copy'],
  keywords: Record<string, string[]> = {}
): SearchEntry[] {
  return catalogue.map((product) => {
    const text = copy[product.id];
    return {
      product,
      name: text.name,
      fields: [
        { text: normalise(text.name), weight: 100 },
        { text: normalise((keywords[product.id] ?? []).join(' ')), weight: 60 },
        { text: normalise(text.desc.join(' ')), weight: 30 },
        { text: normalise(CATEGORY_WORDS[product.category] ?? ''), weight: 20 },
        { text: normalise(product.id), weight: 10 }
      ].filter((field) => field.text.length > 0)
    };
  });
}

function scoreField(field: { text: string; weight: number }, term: string): number {
  const at = field.text.indexOf(term);
  if (at < 0) return 0;
  // start of the field beats start of a later word, which beats mid-word
  const atStart = at === 0;
  const atWordStart = atStart || field.text[at - 1] === ' ';
  const position = atStart ? 2 : atWordStart ? 1.4 : 0.6;
  // a term that is most of the field is a better match than one buried in it
  const coverage = term.length / field.text.length;
  return field.weight * position * (1 + coverage);
}

/**
 * Every term has to appear somewhere, so each extra word narrows the list
 * instead of widening it — which is how "lip" → "lip tint" → "lip tint water"
 * walks down to a single card.
 */
export function searchProducts(index: SearchEntry[], query: string, limit = 8): SearchHit[] {
  const terms = normalise(query).split(' ').filter(Boolean);
  if (terms.length === 0) return [];

  const hits: SearchHit[] = [];
  for (const entry of index) {
    let total = 0;
    let matchedEveryTerm = true;

    for (const term of terms) {
      let best = 0;
      for (const field of entry.fields) best = Math.max(best, scoreField(field, term));
      if (best === 0) {
        matchedEveryTerm = false;
        break;
      }
      total += best;
    }

    if (matchedEveryTerm) hits.push({ product: entry.product, name: entry.name, score: total });
  }

  return hits.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name)).slice(0, limit);
}
