import {Component, Input, OnChanges, OnInit} from '@angular/core';

@Component({
  selector: 'app-relation',
  templateUrl: './relation.component.html',
  styleUrls: ['./relation.component.css']
})
export class RelationComponent implements OnInit, OnChanges {
  p1: any;
  p2: any;

  itemsPerPageV = 20;
  toggled = true;

  @Input() rel: ['', '', [], []];
  entrantes =  [];
  sortantes = [];

  constructor() { }

  ngOnInit() {
    try {
      document.querySelector('#' + 'relation').scrollIntoView();
    } catch (e) { }
  }

  ngOnChanges(changes: any) {
    this.entrantes = [];
    this.sortantes = [];
    // On ne prend pas les mots ave un underscore ex : "_COM"
    this.rel[2].forEach((element) => {
      if (element[0][0] !== '_') {
        this.entrantes.push(element);
      }
    });

    this.rel[3].forEach((element) => {
      if (element[0][0] !== '_') {
        this.sortantes.push(element);
      }
    });
  }


  ordrePoids() {
    this.entrantes.sort((a, b) => {
      return b[1] - a[1];
    });
    this.sortantes.sort((a, b) => {
      return b[1] - a[1];
    });
  }

  ordreAlphabetique() {
    this.entrantes.sort((a, b) => {
      const mot1 = b[0].normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const mot2 = a[0].normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      return mot2.localeCompare(mot1);
    });
    this.sortantes.sort((a, b) => {
      const mot1 = b[0].normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const mot2 = a[0].normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      return mot2.localeCompare(mot1);
    });
  }

}
