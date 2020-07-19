import { Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {InfoWordModel} from './shared/infoWord.model';

@Injectable({
  providedIn: 'root'
})
export class ResearchService {
  resultat: string;

  constructor(private http: HttpClient) { }

  askServer(mot: string): Observable<any>  {
    const url = 'https://jeux-de-mots-aigle.herokuapp.com/';
    //const url = 'http://localhost:3333/';
    const obs: Observable<any> = this.http.post(
      url,
      mot,
      {responseType: 'text'}).pipe(
      map((response) => this.reponseFormat(response))
    );
    return obs;
  }

  reponseFormat(res: string) {
    if (res === '404') {
      return new InfoWordModel(['', 'Ce mot ne se trouve pas dans notre base de données', [], -1], []);
    } else {
      const json = JSON.parse(res);
      return new InfoWordModel(json.def, json.relations);
    }
  }
}
