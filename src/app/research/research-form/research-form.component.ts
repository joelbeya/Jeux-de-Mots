import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { words } from './words';
import {Router} from '@angular/router';

@Component({
  selector: 'app-research-form',
  templateUrl: './research-form.component.html',
  styleUrls: ['./research-form.component.css']
})
export class ResearchFormComponent implements OnInit {

  constructor(private router: Router) { }
  public word: string[] = words;

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    this.router.navigate(['research', form.value.word]);
    console.log(form.value.word);
  }
}
