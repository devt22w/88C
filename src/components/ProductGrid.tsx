import { ProductCard } from './ProductCard';
import { useReveal } from '../hooks/useReveal';
import type { ProductStructure } from '../data/site';

interface Props {
  products: ProductStructure[];
  showRank?: boolean;
}

/**
 * SECTION 6.2 — three-up hairline grid.
 *
 * Each li is exactly 33.33% with a 1px #f0f0f0 border and -1px top/left margins,
 * so adjacent borders collapse into single shared hairlines and the outer edge
 * stays ruled too. Never substitute a gap grid: the shared-border look is lost.
 */
export function ProductGrid({ products, showRank = false }: Props) {
  const ref = useReveal<HTMLUListElement>();

  return (
    <ul ref={ref} data-reveal>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} showRank={showRank} />
      ))}
    </ul>
  );
}
