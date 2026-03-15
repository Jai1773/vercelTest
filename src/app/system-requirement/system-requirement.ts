import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CpuScores } from '../models/cpu.interface';
import { GpuScores } from '../models/gpu.interface';
import { GameRequirement } from '../models/game.interface';

import { DataService } from '../services/data.service';

@Component({
  selector: 'app-system-requirement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './system-requirement.html',
  styleUrls: ['./system-requirement.css'],
})
export class SystemRequirement implements OnInit {

  gamesDetails: GameRequirement[] = [];

  cpuDetails: CpuScores = {};
  gpuDetails: GpuScores = {};

  cpuList: string[] = [];
  gpuList: string[] = [];

  filteredCpu: string[] = [];
  filteredGpu: string[] = [];

  gameList: GameRequirement[] = [];
  filteredGames: GameRequirement[] = [];

  showGameDropdown = false;
  showCpuDropdown = false;
  showGpuDropdown = false;



  cpuSearch = '';
  gpuSearch = '';
  gameSearch = '';

  selectedGame!: GameRequirement;
  selectedCpuScore!: number;
  selectedGpuScore!: number;
  selectedRam!: number;

  resultMessage = '';

  constructor(private dataService: DataService) {}

  ngOnInit() {

    this.dataService.getGames().subscribe(data => {
      this.gamesDetails = data;
      this.gameList = data;
      this.filteredGames = data;
    });

    this.dataService.getCpus().subscribe(data => {
      this.cpuDetails = data;
      this.cpuList = Object.keys(data);
      this.filteredCpu = this.cpuList;
    });

    this.dataService.getGpus().subscribe(data => {
      this.gpuDetails = data;
      this.gpuList = Object.keys(data);
      this.filteredGpu = this.gpuList;
    });

  }

  toggleGameDropdown() {
  this.showGameDropdown = !this.showGameDropdown;
}

toggleCpuDropdown() {
  this.showCpuDropdown = !this.showCpuDropdown;
}

toggleGpuDropdown() {
  this.showGpuDropdown = !this.showGpuDropdown;
}



  filterGames() {
    const search = this.gameSearch.toLowerCase();
    this.filteredGames = this.gameList.filter(game =>
      game.name.toLowerCase().includes(search)
    );
  }

  filterCpu() {
    const search = this.cpuSearch.toLowerCase();
    this.filteredCpu = this.cpuList.filter(cpu =>
      cpu.toLowerCase().includes(search)
    );
  }

  filterGpu() {
    const search = this.gpuSearch.toLowerCase();
    this.filteredGpu = this.gpuList.filter(gpu =>
      gpu.toLowerCase().includes(search)
    );
  }

  // selectGame(game: GameRequirement) {
  //   this.selectedGame = game;
  //   this.gameSearch = game.name;
  //   this.filteredGames = [];
  // }


  selectGame(game: GameRequirement) {
  this.selectedGame = game;
  this.gameSearch = game.name;
  this.filteredGames = [];
  this.showGameDropdown = false;
}

  // selectCpu(cpu: string) {
  //   this.selectedCpuScore = this.cpuDetails[cpu];
  //   this.cpuSearch = cpu;
  //   this.filteredCpu = [];
  // }

  // selectGpu(gpu: string) {
  //   this.selectedGpuScore = this.gpuDetails[gpu];
  //   this.gpuSearch = gpu;
  //   this.filteredGpu = [];
  // }

  selectCpu(cpu: string) {
  this.selectedCpuScore = this.cpuDetails[cpu];
  this.cpuSearch = cpu;
  this.filteredCpu = [];
  this.showCpuDropdown = false;
}

selectGpu(gpu: string) {
  this.selectedGpuScore = this.gpuDetails[gpu];
  this.gpuSearch = gpu;
  this.filteredGpu = [];
  this.showGpuDropdown = false;
}


  check() {

    if (!this.selectedGame) {
      this.resultMessage = "Please select a game";
      return;
    }

    const game = this.selectedGame;

    if (
      this.selectedCpuScore >= game.recommended.cpuScore &&
      this.selectedGpuScore >= game.recommended.gpuScore &&
      this.selectedRam >= game.recommended.ram
    ) {
      this.resultMessage =
        "Your system meets the Recommended requirements for " + game.name;
    }

    else if (
      this.selectedCpuScore >= game.minimum.cpuScore &&
      this.selectedGpuScore >= game.minimum.gpuScore &&
      this.selectedRam >= game.minimum.ram
    ) {
      this.resultMessage =
        "Your system meets the Minimum requirements for " + game.name;
    }

    else {
      this.resultMessage =
        "Your system does NOT meet the minimum requirements for " + game.name;
    }

  }

}
