export interface GameRequirement {
  name: string;
  route?: string;
  slug?: string;

  minimum: {
    ram: number;
    gpuScore: number;
    cpuScore: number;
  };

  recommended: {
    ram: number;
    gpuScore: number;
    cpuScore: number;
  };
}
