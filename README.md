# Playbill Wedding Site

## Development

- `npm run dev` starts the local Vite server.
- `npm run build` creates a production build.
- `npm run preview` serves the built output.

## Image Optimization Workflow

- Original high-resolution source images are stored in `assets-originals/`.
- Optimized delivery assets are generated into `public/optimized/`.
- Run `npm run optimize-images` any time source images change.

The site uses AVIF and WebP `picture` sources with responsive `srcset` so mobile and desktop both download smaller images.
