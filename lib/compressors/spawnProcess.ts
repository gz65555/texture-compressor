// Native
import { spawn, spawnSync } from 'child_process';
import { join } from 'path';

// Arguments
import { ICLIArgs } from '../argsHandler';

// Utilities
import { createFlagsForTool, getBinaryDirectory, splitFlagAndValue } from '../utilities';

/**
 * Spawn a child process of a texture compression tool (e.g. PVRTexTool, Crunch)
 *
 * @param args Command line arguments
 * @param flagMapping Flags to pass to the texture compression tool
 * @param binaryName Name of the texture compression tool
 */
export const spawnProcess = (
  args: ICLIArgs,
  flagMapping: string[],
  binaryName: string
): Promise<void> => {
  const toolPath = join(getBinaryDirectory(), binaryName);
  const toolFlags = args.flags ? splitFlagAndValue(createFlagsForTool(args.flags)) : [];
  const combinedFlags = [...flagMapping, ...toolFlags];

  return new Promise((resolve, reject): void => {
    if (args.verbose) {
      console.log(`Using flags: ${combinedFlags}`);
    }

    const child = spawn(toolPath, combinedFlags);

    if (args.verbose) {
      console.log(child.stdout.toString());
      console.log(child.stderr.toString());
    }

    child.once('exit', (code: number) => {
      if (code !== 0) {
        reject(new Error(`Compression tool exited with error code ${code}`));
      } else {
        resolve();
      }
    });
  });
};
