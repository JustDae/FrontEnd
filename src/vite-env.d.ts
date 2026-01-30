/// <reference types="vite/client" />

declare module 'swiper/css';
declare module 'swiper/css/pagination';
declare module 'swiper/css/effect-fade';

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
