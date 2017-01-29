import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';

@Component({
  moduleId: module.id,
  selector: 'home-header',
  templateUrl: 'home-header.component.html',
  styleUrls: ['home-header.component.css']
})
export class HomeHeaderComponent implements OnInit {

  constructor(private titleService: Title) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('uxgraph');
  }
}
