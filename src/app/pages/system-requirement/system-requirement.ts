import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CpuScores } from '../../models/cpu.interface';
import { GpuScores } from '../../models/gpu.interface';
import { GameRequirement } from '../../models/game.interface';

import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-system-requirement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './system-requirement.html',
  styleUrls: ['./system-requirement.css'],
})
export class SystemRequirement implements OnInit {

  // ===== DROPDOWN REFERENCES =====
  @ViewChild('gameDropdown') gameDropdown!: ElementRef;
  @ViewChild('cpuDropdown') cpuDropdown!: ElementRef;
  @ViewChild('gpuDropdown') gpuDropdown!: ElementRef;

  // ===== DATA =====
  gamesDetails: GameRequirement[] = [];

  cpuDetails: CpuScores = {};
  gpuDetails: GpuScores = {};

  cpuList: string[] = [];
  gpuList: string[] = [];

  filteredCpu: string[] = [];
  filteredGpu: string[] = [];

  gameList: GameRequirement[] = [];
  filteredGames: GameRequirement[] = [];

  // ===== UI STATE =====
  showGameDropdown = false;
  showCpuDropdown = false;
  showGpuDropdown = false;

  // ===== SEARCH =====
  cpuSearch = '';
  gpuSearch = '';
  gameSearch = '';

  // ===== SELECTED =====
  selectedGame: GameRequirement | null = null;
  selectedCpuScore!: number;
  selectedGpuScore!: number;
  selectedRam!: number;

  resultMessage = '';

  constructor(
    private dataService: DataService,
    private title: Title,
    private meta: Meta
  ) {}

  ngOnInit() {
    this.loadData();
  }

  // ===== LOAD DATA =====
  loadData() {

    this.dataService.getGames().subscribe(games => {
      this.gamesDetails = games;
      this.gameList = games;
      this.filteredGames = games;
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

  // ===== OUTSIDE CLICK =====
  @HostListener('document:click', ['$event'])
  handleClick(event: Event) {

    if (this.gameDropdown && !this.gameDropdown.nativeElement.contains(event.target)) {
      this.showGameDropdown = false;
    }

    if (this.cpuDropdown && !this.cpuDropdown.nativeElement.contains(event.target)) {
      this.showCpuDropdown = false;
    }

    if (this.gpuDropdown && !this.gpuDropdown.nativeElement.contains(event.target)) {
      this.showGpuDropdown = false;
    }
  }

  // ===== TOGGLE =====
  toggleGameDropdown() {
    this.showGameDropdown = !this.showGameDropdown;
    this.showCpuDropdown = false;
    this.showGpuDropdown = false;
  }

  toggleCpuDropdown() {
    this.showCpuDropdown = !this.showCpuDropdown;
    this.showGameDropdown = false;
    this.showGpuDropdown = false;
  }

  toggleGpuDropdown() {
    this.showGpuDropdown = !this.showGpuDropdown;
    this.showGameDropdown = false;
    this.showCpuDropdown = false;
  }

  // ===== FILTER =====
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

  // ===== SELECT =====
  selectGame(game: GameRequirement) {
    this.selectedGame = game;
    this.gameSearch = game.name;
    this.showGameDropdown = false;

    this.updateSEO(game);
  }

  selectCpu(cpu: string) {
    this.selectedCpuScore = this.cpuDetails[cpu];
    this.cpuSearch = cpu;
    this.showCpuDropdown = false;
  }

  selectGpu(gpu: string) {
    this.selectedGpuScore = this.gpuDetails[gpu];
    this.gpuSearch = gpu;
    this.showGpuDropdown = false;
  }

  // ===== SEO =====
  updateSEO(game: GameRequirement) {
    const title = `Can I Run ${game.name}? PC Requirements & FPS Check`;
    const description =
      `Check if your PC can run ${game.name}. ` +
      `View minimum and recommended system requirements including CPU, GPU and RAM.`;

    this.title.setTitle(title);
    this.meta.updateTag({
      name: 'description',
      content: description
    });
  }

  // ===== CHECK =====
  check() {

    if (!this.selectedGame) {
      this.resultMessage = "Please select a game";
      return;
    }

    const game = this.selectedGame as any;

    if (
      this.selectedCpuScore >= game.scores.recommended.cpuScore &&
      this.selectedGpuScore >= game.scores.recommended.gpuScore &&
      this.selectedRam >= game.scores.recommended.ram
    ) {
      this.resultMessage =
        "Your system meets the Recommended requirements for " + game.name;
    }

    else if (
      this.selectedCpuScore >= game.scores.minimum.cpuScore &&
      this.selectedGpuScore >= game.scores.minimum.gpuScore &&
      this.selectedRam >= game.scores.minimum.ram
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
