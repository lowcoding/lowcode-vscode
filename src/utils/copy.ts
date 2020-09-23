import * as path from 'path';
import * as util from 'util';
import * as fs from 'fs-extra';
import * as isObject from 'is-plain-object';
import * as globby from 'globby';

type Rename = (name: string, extension: string) => string;

function stringify(value: any) {
  return util.inspect(value, { breakLength: Infinity });
}

async function isFile(filePath: string) {
  const fileStats = await fs.stat(filePath);
  return fileStats.isFile();
}

function renameTarget(target: string, rename: string | Rename) {
  const parsedPath = path.parse(target);
  return typeof rename === 'string'
    ? rename
    : rename(parsedPath.name, parsedPath.ext.replace('.', ''));
}

async function generateCopyTarget(
  src: string,
  dest: string,
  {
    flatten,
    rename,
    transform,
  }: {
    flatten?: boolean;
    rename?: string | Rename;
    transform?: (content: Buffer) => void;
  },
) {
  if (transform && !(await isFile(src))) {
    throw new Error(
      `"transform" option works only on files: '${src}' must be a file`,
    );
  }

  const { base, dir } = path.parse(src);
  const destinationFolder =
    flatten || (!flatten && !dir) ? dest : dir.replace(dir.split('/')[0], dest);

  return {
    src,
    dest: path.join(
      destinationFolder,
      rename ? renameTarget(base, rename) : base,
    ),
    ...(transform && { contents: await transform(await fs.readFile(src)) }),
    renamed: rename,
    transformed: transform,
  };
}

export default async function copy(options: {
  flatten?: boolean;
  targets: {
    src: string | string[];
    dest: string | string[];
    rename?: string | Rename;
    transform?: (content: Buffer) => void;
  }[];
}) {
  const { flatten = true, targets = [] } = options;

  const copyTargets = [];

  if (Array.isArray(targets) && targets.length) {
    for (const target of targets) {
      if (!isObject(target)) {
        throw new Error(`${stringify(target)} target must be an object`);
      }

      const { dest, rename, src, transform } = target;

      if (!src || !dest) {
        throw new Error(
          `${stringify(target)} target must have "src" and "dest" properties`,
        );
      }

      if (
        rename &&
        typeof rename !== 'string' &&
        typeof rename !== 'function'
      ) {
        throw new Error(
          `${stringify(
            target,
          )} target's "rename" property must be a string or a function`,
        );
      }

      const matchedPaths = await globby(src, {
        expandDirectories: false,
        onlyFiles: false,
      });

      if (matchedPaths.length) {
        for (const matchedPath of matchedPaths) {
          const generatedCopyTargets = Array.isArray(dest)
            ? await Promise.all(
                dest.map((destination) =>
                  generateCopyTarget(matchedPath, destination, {
                    flatten,
                    rename,
                    transform,
                  }),
                ),
              )
            : [
                await generateCopyTarget(matchedPath, dest, {
                  flatten,
                  rename,
                  transform,
                }),
              ];

          copyTargets.push(...generatedCopyTargets);
        }
      }
    }
  }

  if (copyTargets.length) {
    for (const copyTarget of copyTargets) {
      const { contents, dest, src, transformed } = copyTarget;

      if (transformed) {
        await fs.outputFile(dest, contents);
      } else {
        await fs.copy(src, dest);
      }
    }
  }
}
