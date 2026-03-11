import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import games from '../../data/games.json';
import cpu from '../../data/cpu.json';
import gpu from '../../data/gpu.json';

export interface SystemRequirementModel {
  ram: number;
  gpuScore: number;
  cpuScore: number;
}

export interface IGame {
  name: string;
  minimum: SystemRequirementModel;
  recommended: SystemRequirementModel;
}

export interface CpuScores {
  [cpuName: string]: number;
}

export interface GpuScores {
  [gpuName: string]: number;
}


@Component({
  selector: 'app-system-requirement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './system-requirement.html',
  styleUrls: ['./system-requirement.css'],
})
export class SystemRequirement {
  gamesDetails: IGame[] = games as IGame[];
  cpuDetails: CpuScores = cpu as CpuScores;
  gpuDetails: GpuScores = gpu as GpuScores;
  selectedGame!: IGame;
  selectedCpuScore!: number;
  selectedGpuScore!: number;
  selectedRam!: number;

  loading = false;

  check() {
    if (
      this.selectedCpuScore >= this.selectedGame.recommended.cpuScore &&
      this.selectedGpuScore >= this.selectedGame.recommended.gpuScore &&
      this.selectedRam >= this.selectedGame.recommended.ram
    ) {
      alert("Your system meets the Maximum requirements for " + this.selectedGame.name);
    }

    else if (
      this.selectedCpuScore >= this.selectedGame.minimum.cpuScore &&
      this.selectedGpuScore >= this.selectedGame.minimum.gpuScore &&
      this.selectedRam >= this.selectedGame.minimum.ram
    ) {
      alert("Your system meets the Minimum requirements for " + this.selectedGame.name);
    }

    else {
      alert("Your system does not meet the minimum requirements for " + this.selectedGame.name);
    }

  }
}
