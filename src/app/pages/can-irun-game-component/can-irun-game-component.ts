import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import { CommonModule, Location } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

import { DataService } from '../../services/data.service';
import { SystemRequirement } from "../system-requirement/system-requirement";

@Component({
  selector: 'app-can-i-run-game',
  standalone: true,
  imports: [CommonModule, SystemRequirement, RouterLink],
  templateUrl: './can-irun-game-component.html',
  styleUrls: ['./can-irun-game-component.css']
})
export class CanIRunGameComponent implements OnInit {

  game: any;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private location: Location,
    private title: Title,
    private meta: Meta
    ,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.route.paramMap.pipe(
      switchMap(params => {
        const slug = params.get('slug');
        return this.dataService.getGames().pipe(map(games => ({ slug, games })));
      })
    ).subscribe(({ slug, games }) => {
      const found = games.find((g: any) => g.slug === slug);
      this.game = found ? this.normalizeGame(found) : null;
      if (this.game) this.updateSEO();
      this.cdr.detectChanges();
    });
  }

  updateSEO() {
    const seo = this.game?.seo;
    if (!seo) {
      return;
    }
    this.title.setTitle(seo.title);
    this.meta.updateTag({
      name: 'description',
      content: seo.description
    });
  }

  goBack() {
    this.location.back();
  }

  private normalizeGame(raw: any) {
    const name = raw?.name ?? 'Game';
    const seo = raw?.seo ?? {
      title: `Can I Run ${name}?`,
      description: `Check PC compatibility and system requirements for ${name}.`
    };

    const minimum = raw?.requirements?.minimum ?? {
      cpu: raw?.minimum?.cpuScore ? `CPU score ${raw.minimum.cpuScore}` : 'N/A',
      ram: raw?.minimum?.ram ? `${raw.minimum.ram} GB` : 'N/A',
      gpu: raw?.minimum?.gpuScore ? `GPU score ${raw.minimum.gpuScore}` : 'N/A',
      storage: raw?.minimum?.storage ?? 'N/A'
    };

    const recommended = raw?.requirements?.recommended ?? {
      cpu: raw?.recommended?.cpuScore ? `CPU score ${raw.recommended.cpuScore}` : 'N/A',
      ram: raw?.recommended?.ram ? `${raw.recommended.ram} GB` : 'N/A',
      gpu: raw?.recommended?.gpuScore ? `GPU score ${raw.recommended.gpuScore}` : 'N/A',
      storage: raw?.recommended?.storage ?? 'N/A'
    };

    const intro = raw?.intro ?? `See if your PC can handle ${name}, plus the minimum and recommended requirements.`;
    const results = raw?.results ?? {
      low: 'If your PC is below the minimum, you may struggle to run the game.',
      medium: 'If you meet the minimum, you should run the game at lower settings.',
      high: 'If you meet the recommended, you can expect smooth gameplay at higher settings.'
    };
    const faqs = Array.isArray(raw?.faqs) ? raw.faqs : [];

    return {
      ...raw,
      name,
      seo,
      intro,
      requirements: {
        minimum,
        recommended
      },
      results,
      faqs
    };
  }
}
