import * as esbuild from "esbuild-wasm";

export const unpkgPathPlugin = () => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      // handle root entry file
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        return { path: "index.js", namespace: "a" };
      });

      // handle relative paths in module
      build.onResolve({ filter: /^\.+\// }, (args: any) => {
        const path = new URL(
          args.path,
          "https://unpkg.com" + args.resolveDir + "/"
        );
        return {
          namespace: "a",
          path: path.href,
        };
      });

      // handle packages
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        return {
          namespace: "a",
          path: `https://unpkg.com/${args.path}`,
        };
      });
    },
  };
};