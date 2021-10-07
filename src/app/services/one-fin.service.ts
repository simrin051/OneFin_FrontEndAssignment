import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, Observer } from "rxjs";
import { Signupmodel } from "../model/signupmodel.model";
import { ToastrService } from "ngx-toastr";
import { Movie } from "../model/movie.model";

@Injectable({
  providedIn: "root",
})
export class OneFinService {
  model: Signupmodel = new Signupmodel();
  constructor(private http: HttpClient, private toastr: ToastrService) {}
  loginURL: string = "https://demo.credy.in/api/v1/usermodule/login/";

  login(username: string, password: string): Observable<any> {
    const headers = { "content-type": "application/json" };
    this.model.password = password;
    this.model.username = username;
    return this.http.post<Signupmodel>(
      this.loginURL,
      JSON.stringify(this.model),
      {
        headers: headers,
      }
    );
  }

  getMovies(moviesURL): Observable<any> {
    const headerDict = {
      Authorization: "Token " + localStorage.getItem("access_token"),
    };

    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };

    var token = localStorage.getItem("access_token");
    console.log("Token " + token);
    return this.http.get(moviesURL, requestOptions);
  }

  showError(message, title) {
    this.toastr.error(message, title);
  }

  getSearchTerm(term: string) {
    let header = new HttpHeaders().set(
      "Authorization",
      "Token " + localStorage.getItem("access_token")
    );
    return this.http.get<Movie[]>("https://demo.credy.in/api/v1/maya/movies/", {
      params: { searchItem: term },
    });
  }
}
