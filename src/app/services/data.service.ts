import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GameRequirement } from '../models/game.interface';
import { CpuScores } from '../models/cpu.interface';
import { GpuScores } from '../models/gpu.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) {}

  getGames(): Observable<GameRequirement[]> {
    return this.http.get<GameRequirement[]>('assets/data/games.json');
  }

  getCpus(): Observable<CpuScores> {
    return this.http.get<CpuScores>('assets/data/cpu.json');
  }

  getGpus(): Observable<GpuScores> {
    return this.http.get<GpuScores>('assets/data/gpu.json');
  }

}
