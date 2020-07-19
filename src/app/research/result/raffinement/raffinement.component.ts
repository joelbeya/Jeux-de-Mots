import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-raffinement',
  templateUrl: './raffinement.component.html',
  styleUrls: ['./raffinement.component.css']
})
export class RaffinementComponent implements OnInit {

  @Input() array: [];
  arrayDef: string []  = [];

  constructor() {
  }

  ngOnInit() {
  }

  isArray(obj: any ) {
    return Array.isArray(obj);
  }
}
