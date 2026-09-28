import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ImageSlotProvider } from './components/ImageSlot';
import { LocaleProvider } from './i18n/LocaleProvider';
import { RouterProvider } from './router';
import { CartProvider } from './cart/CartProvider';
import { useImageSources } from './data/useImageSources';
import { CatalogueMetaProvider } from './data/useCatalogueMeta';
import './styles/index.css';

/**
 * Feeds every image slot from Supabase when credentials are present, and from
 * the static map in `data/imageSources.ts` when they are not. The page renders
 * the same either way — only the pictures differ.
 */
function ImageSlotGateway({ children }: { children: React.ReactNode }) {
  const sources = useImageSources();
  return <ImageSlotProvider value={sources}>{children}</ImageSlotProvider>;
}

const container = document.getElementById('root');
if (!container) throw new Error('#root not found');

createRoot(container).render(
  <StrictMode>
    {/* LocaleProvider sits outside, because image slots resolve per language too */}
    <LocaleProvider>
      <ImageSlotGateway>
        <CatalogueMetaProvider>
          <CartProvider>
            <RouterProvider>
              <App />
            </RouterProvider>
          </CartProvider>
        </CatalogueMetaProvider>
      </ImageSlotGateway>
    </LocaleProvider>
  </StrictMode>
);
