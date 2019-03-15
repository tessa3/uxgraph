import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'home-header',
  templateUrl: 'home-header.component.html',
  styleUrls: ['home-header.component.css']
})
export class HomeHeaderComponent implements OnInit {

  constructor(private titleService: Title) {
  }

  ngOnInit(): void {
    // TODO(eyuelt): this probably shouldn't be here
    this.titleService.setTitle('uxgraph');
  }
}
