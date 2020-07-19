import {Component, OnInit} from '@angular/core';
import {ResearchService} from '../../research.service';
import {InfoWordModel, relationNames} from '../../shared/infoWord.model';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  resultat: InfoWordModel;
  show = true;
  relShow = [];

  wait = false;
  word: any = '';

  fragment = 'relation';
  constructor(private researchService: ResearchService, private route: ActivatedRoute) { }
  relationshipNames = relationNames;

  ngOnInit() {
    this.route.params.subscribe(
        (params: Params) => {
          this.wait = !this.wait;
          const key = 'wordAsked';
          this.word = params[key];
          this.researchService.askServer(this.word).subscribe(res => {
            this.resultat = res;
            console.log(this.resultat);
            this.wait = !this.wait;
          });
          this.relShow = [];
        }
    );
  }

  isArray(obj: any ) {
    return Array.isArray(obj);
  }

  onSelectedRelation(id: any) {
    const taille = this.resultat.relations.length;
    for (let i = 0; i < taille; i++) {
      if (this.resultat.relations[i][0] === id) {
        this.relShow = this.resultat.relations[i];
      }
    }
    try {
      document.querySelector('#' + this.fragment).scrollIntoView();
    } catch (e) { }
  }

}
