import { Page } from './../models/page.model';
import { environment } from './../../../environments/environment';
import { Injector } from '@angular/core';
import { BaseResourceModel } from './../models/base-resource.model';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError  } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export abstract class BaseResourceService<T extends BaseResourceModel> {

  protected http: HttpClient

  constructor(
    protected apiPath: string,
    protected injector: Injector
  ) { 
    this.http = injector.get(HttpClient);
  }
  
  public getAll(): Observable<T[]> {
    return this.http.get(`${environment.apiUrl}${this.apiPath}`)
      .pipe(
        map(this.jsonDataToResources),
        catchError(this.handlerError)
      );
  }

  public paginate(page: number, rows: number, sortField: string, sortOrder: string): Observable<Page> {
    return this.http.get(`${environment.apiUrl}${this.apiPath}/paginate?page=${page}&linesPerPage=${rows}&orderBy=${sortField}&direction=${sortOrder}`)
      .pipe(
        map(this.jsonToPage),
        catchError(this.handlerError)
      );
  }

  public getById(id: number): Observable<T> {
    return this.http.get(`${environment.apiUrl}${this.apiPath}/${id}`)
    .pipe(
      map(this.jsonDataToResource),
      catchError(this.handlerError)
    );
  }

  public create(resource: T): Observable<T> {
    return this.http.post(`${environment.apiUrl}${this.apiPath}`, resource)
    .pipe(
      map(this.jsonDataToResources),
      catchError(this.handlerError)
    );
  }

  public update(resource: T, id: number): Observable<T> {
    return this.http.put(`${environment.apiUrl}${this.apiPath}/${id}`, resource)
    .pipe(
      map(() => null),
      catchError(this.handlerError)
    );
  }

  public delete(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}${this.apiPath}/${id}`)
    .pipe(
      catchError(this.handlerError),
      map(() => null)
    );
  }

  protected jsonDataToResources(jsonData: any[]): T[] {
    const resources: T[] = [];
    jsonData.forEach(el => resources.push(el as T));
    return resources;
  }

  protected jsonToPage(jsonData: any): Page {
    return Page.fromPage(jsonData);
  }

  protected jsonDataToResource(jsonData: any): T {
    return jsonData as T;
  }

  protected handlerError(error: any): Observable<any> {
    return throwError(error);
  }
}
