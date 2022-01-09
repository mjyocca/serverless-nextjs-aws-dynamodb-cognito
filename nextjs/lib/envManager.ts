import getEnvVariables from './ssm';

const stage = process.env.STAGE ?? 'dev';

export type Env = {
  env: string;
  ssm: string;
};

class ParamMap {
  secrets: Env[];
  params: string[] = [];
  constructor(secrets: any[]) {
    this.secrets = secrets;
  }

  hasEnvVariables() {
    for (const s of this.secrets) {
      if (!process.env[s.env]) {
        this.params.push(s.ssm);
      }
    }
    return this.params.length === 0;
  }
}

export class EnvManager {
  static ssmParamsMap: Record<string, ParamMap> = {};

  static set(key: string, cb: (stage: string) => Env[]) {
    const variables = cb(stage);
    this.ssmParamsMap[key] = new ParamMap(variables);
  }

  static has(key: string): boolean {
    const currentParam = this.ssmParamsMap[key];
    return currentParam.hasEnvVariables();
  }

  static async fetchVars(key: string) {
    const current = this.ssmParamsMap[key];
    const currentMap = current.secrets.reduce((acc: Record<string, string>, cur) => {
      acc[cur.ssm] = cur.env;
      return acc;
    }, {});
    const result = await getEnvVariables(current.params);
    if (result) {
      for (const { Name, Value } of result) {
        const envName = currentMap[Name as string];
        process.env[envName] = Value;
      }
    }
  }
}
