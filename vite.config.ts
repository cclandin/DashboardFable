import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

const src = path.resolve(__dirname, './src')


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    // Resolve Frame imports before the Figma Make plugin can block them.
    // enforce:'pre' guarantees this runs first in the plugin chain.
    {
      name: 'resolve-figma-frame-imports',
      enforce: 'pre',
      resolveId(id: string) {
        const map: Record<string, string> = {
          '../../imports/Frame/Frame':   path.join(src, 'imports/Frame/Frame.tsx'),
          '../imports/Frame/Frame':      path.join(src, 'imports/Frame/Frame.tsx'),
          '../../imports/Frame2/Frame2': path.join(src, 'imports/Frame2/Frame2.tsx'),
          '../imports/Frame2/Frame2':    path.join(src, 'imports/Frame2/Frame2.tsx'),
          '../../imports/Frame3/Frame3': path.join(src, 'imports/Frame3/Frame3.tsx'),
          '../imports/Frame3/Frame3':    path.join(src, 'imports/Frame3/Frame3.tsx'),
        }
        if (id in map) return map[id]
      },
    },
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': src,
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
