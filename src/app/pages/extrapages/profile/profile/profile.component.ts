import { Component, OnInit } from '@angular/core';
import { projectList, document } from './data';
import { projectListModel, documentModel } from './profile.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

/**
 * Profile Component
 */
export class ProfileComponent implements OnInit {

  projectList!: projectListModel[];
  document!: documentModel[];
  userData:any;

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Fetches the data
   */
   private fetchData() {
    this.projectList = projectList;
    this.document = document;
  }

  /**
   * Swiper setting
   */
   config = {
    slidesPerView: 1,
    initialSlide: 0,
    spaceBetween: 25,
    breakpoints:{
      768:{
        slidesPerView: 2, 
      },
      1200:{
        slidesPerView: 3, 
      }
    }
  };

}
