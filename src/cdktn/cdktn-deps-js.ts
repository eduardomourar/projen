import type { CdktnPackageNames } from "./cdktn-deps";
import { CdktnDeps } from "./cdktn-deps";

/**
 * Manages dependencies on CDK Terrain (CDKTN) for Node.js projects.
 */
export class CdktnDepsJs extends CdktnDeps {
  protected packageNames(): CdktnPackageNames {
    return {
      core: "cdktn",
      constructs: "constructs",
    };
  }
}
