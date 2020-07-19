import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild('list', {static: false}) list;
  listShowed = false;

  constructor() { }

  ngOnInit() {
  }

  afficheList() {
    if (!this.listShowed) {
      this.list.nativeElement.classList.add('show');
    } else {
      this.list.nativeElement.classList.remove('show');
    }
    this.listShowed = !this.listShowed;
  }
}
