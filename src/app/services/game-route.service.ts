import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GameRoutes } from '../models/game-routes.inteface';
@Injectable({
  providedIn: 'root'
})

export class GameRouteService {
     constructor(private http: HttpClient) {}

     getGames(): Observable<GameRoutes[]> {
         return this.http.get<GameRoutes[]>('assets/data/game-routes.json');
       }
}