import { Component } from "../component";
import { JsonFile } from "../json";
import type { Project } from "../project";

/**
 * Common options for `cdktf.json`.
 */
export interface CdktnConfigCommonOptions {
  /**
   * Terraform providers to build.
   *
   * @default []
   */
  readonly terraformProviders?: string[];

  /**
   * Terraform modules to build.
   *
   * @default []
   */
  readonly terraformModules?: string[];

  /**
   * Additional context to include in `cdktf.json`.
   *
   * @default - no additional context
   */
  readonly context?: { [key: string]: any };

  /**
   * CDKTN output directory.
   *
   * @default "cdktf.out"
   */
  readonly cdktnOut?: string;

  /**
   * CDK project identifier
   *
   * @default - Automatically generated
   */
  readonly projectId?: string;

  /**
   * Whether report crashing to a remote server
   *
   * @default true
   */
  readonly sendCrashReports?: boolean;
}

/**
 * Options for `CdktnConfig`.
 */
export interface CdktnConfigOptions extends CdktnConfigCommonOptions {
  /**
   * The command line to execute in order to synthesize the CDKTN application
   * (language specific).
   */
  readonly app: string;
}

/**
 * Represents cdktf.json file.
 *
 * CDKTN (CDK Terrain) continues to use the `cdktf.json` filename for
 * backwards compatibility with its CDKTF origins.
 */
export class CdktnConfig extends Component {
  /**
   * Represents the JSON file.
   */
  public readonly json: JsonFile;

  /**
   * Name of the cdktn.out directory.
   */
  public readonly cdktnOut: string;

  /**
   * List of Terraform providers to build.
   */
  private readonly _terraformProviders: string[];

  /**
   * List of Terraform modules to build.
   */
  private readonly _terraformModules: string[];

  constructor(project: Project, options: CdktnConfigOptions) {
    super(project);

    this.cdktnOut = options.cdktnOut ?? "cdktf.out";
    this._terraformProviders = options.terraformProviders ?? [];
    this._terraformModules = options.terraformModules ?? [];

    this.json = new JsonFile(project, "cdktf.json", {
      omitEmpty: true,
      // `cdktn get` and `cdktn provider add` write generated provider/module
      // entries back into this file, so it can't be read-only.
      readonly: false,
      obj: {
        language: "typescript",
        app: options.app,
        output: this.cdktnOut,
        terraformProviders: () => this._terraformProviders,
        terraformModules: () => this._terraformModules,
        context: options.context,
        projectId: options.projectId,
        sendCrashReports: options.sendCrashReports,
      },
    });

    project.gitignore.exclude(`/${this.cdktnOut}/`);
    project.gitignore.exclude(".gen/");
  }

  /**
   * Add Terraform providers to `cdktf.json`.
   * @param providers The providers to add.
   */
  public addTerraformProviders(...providers: string[]) {
    this._terraformProviders.push(...providers);
  }

  /**
   * Add Terraform modules to `cdktf.json`.
   * @param modules The modules to add.
   */
  public addTerraformModules(...modules: string[]) {
    this._terraformModules.push(...modules);
  }
}
