import { createMatchPath } from 'tsconfig-paths';
import { defineConfig } from 'tsup';
import tsconfig from './tsconfig.json' assert { type: 'json' };

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/gateways/BigCommerce/index.ts',
    'src/use-cases/install/index.ts',
    'src/use-cases/load/index.ts',
    'src/use-cases/uninstall/index.ts',
    'src/use-cases/remove-user/index.ts',
    'src/use-cases/shared/index.ts',
    'src/use-cases/value-objects/index.ts',
  ],
  bundle: false,
  dts: true,
  sourcemap: true,
  clean: true,
  format: ['esm', 'cjs'],
  outDir: 'dist',
  target: 'node18',
  treeshake: true,
  minify: false,
  esbuildPlugins: [
    {
      name: 'tsconfig-paths',
      setup(build) {
        const { paths, baseUrl } = tsconfig.compilerOptions;

        // createMatchPath is typed, so no-unsafe-assignment won't complain
        const matchPath = createMatchPath(baseUrl, paths);

        build.onResolve({ filter: /.*/ }, (args) => {
          const result = matchPath(args.path, undefined, undefined, ['.ts', '.js']);
          if (result) return { path: result };
        });
      },
    },
  ],
});
