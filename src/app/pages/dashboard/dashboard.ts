import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { SystemRequirement } from "../system-requirement/system-requirement";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GameRoutes } from '../../models/game-routes.inteface';
import { GameRouteService } from '../../services/game-route.service';
import { Observable, catchError, of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SystemRequirement, CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit {

  popularGames$: Observable<GameRoutes[]>;

  constructor(
    private title: Title,
    private meta: Meta,
    private gameRouteService: GameRouteService,
  ) {
    this.popularGames$ = this.gameRouteService.getGames().pipe(
      catchError(() => of([]))
    );
  }

  ngOnInit(): void {
    this.title.setTitle('PC Game Requirement Checker - Can Your PC Run Any Game?');
    this.meta.updateTag({
      name: 'description',
      content: 'Check if your PC can run any game instantly. Compare system requirements, performance, and compatibility easily.'
    });
  }

  trackByName(index: number, item: { name: string }) {
    return item.name;
  }
}