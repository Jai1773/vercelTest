export interface GameRequirement {
  name: string;

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
