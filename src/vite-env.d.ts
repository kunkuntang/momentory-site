/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ALBUM_PASSWORD?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}
