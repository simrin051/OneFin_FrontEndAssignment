import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { OneFinService } from '../services/one-fin.service';
import { Movie } from '../model/movie.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import {
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
} from 'rxjs/operators';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  moviesLoaded: false;
  displayerror = false;
  movies: any = [];
  pageNo = 0;
  movieModalTitle;
  movieModalDescription;
  movieGenres;
  modalVisible = false;
  modalRef: BsModalRef;
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private onefinservice: OneFinService,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService
  ) {
    console.log('Inside constructor ');
    this.loadInitPost(onefinservice);
  }

  notScrolly = true;
  notEmptyPost = true;
  modalShow = false;
  page = 1;
  subjectKeyUpSearch = new Subject();
  ngOnInit(): void {
    console.log('Inside ngOnInit');
    //this.subjectKeyUpSearch.pipe(debounceTime(250)).subscribe((d) => {
    // console.log('Inside ngOnInit' + d);
    //});
  }

  loadInitPost(onefinservice: OneFinService) {
    const url = 'https://demo.credy.in/api/v1/maya/movies?page=1';
    this.onefinservice.getMovies(url).subscribe(
      (data) => {
        console.log(data);
        this.movies = data.results;
      },
      (error) => {
        this.displayerror = true;
        onefinservice.showError('Something is wrong', 'Please refresh');
      }
    );
  }

  openModalWithClass(template: TemplateRef<any>, movie: Movie) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
    this.movieModalTitle = movie.title;
    this.movieModalDescription = movie.description;
    console.log('Movie Modal Description ' + this.movieModalDescription);
    this.movieGenres = movie.genres;
    this.modalVisible = true;
    this.modalShow = true;
  }

  onSearch(textEnteredByUser: string) {
    var moviesSearchList: Movie[] = [];
    var moviesURL = 'https://demo.credy.in/api/v1/maya/movies/';
    var moviesLength = 0;
    //this.subjectKeyUpSearch.next(textEnteredByUser); ///will append values from Search
    this.onefinservice
      .getMovies(moviesURL)
      .pipe(
        debounceTime(250),
        filter((_) => textEnteredByUser.length >= 3),
        distinctUntilChanged()
      )
      .subscribe(
        (data) => {
          console.log('Inside search subscribe');
          moviesLength = data.results.length;
          this.movies = data.results;
          for (var movie of this.movies) {
            if (movie.title.includes(textEnteredByUser)) {
              moviesSearchList.push(movie);
            }
            this.spinner.show();
          }
          this.spinner.hide();
          this.movies = moviesSearchList;
          console.log('Movie Search List ' + moviesSearchList.length);
        },
        (error) => {
          this.displayerror = true;
          this.onefinservice.showError('Something is wrong', 'Please refresh');
        }
      );
  }

  //load next movies
  loadNextMovies(pageNo: number) {
    console.log('Load next Movies ' + pageNo);
    const url = 'https://demo.credy.in/api/v1/maya/movies?page=' + this.pageNo;
    this.onefinservice.getMovies(url).subscribe((data) => {
      if (data.results) {
        this.movies = this.movies.concat(data.results);
      } else {
        this.spinner.hide();
      }
      //add newly fetched post to existing posts
    });
  }

  onScroll() {
    console.log('Inside onScroll');
    this.spinner.show();
    this.loadNextMovies(++this.pageNo);

    /**
    if (this.notScrolly && this.notEmptyPost) {
      console.log('inside on Scroll inside if');
      this.spinner.show();
      //this.notScrolly = false;
      this.loadNextMovies(++this.pageNo);
    }
     */
  }
}
