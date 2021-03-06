import { BaseResourceService } from 'src/app/shared/services/base-resource.service';
import { Component, OnInit, Injector } from '@angular/core';
import { BaseResourceModel } from '../../models/base-resource.model';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';

export abstract class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {

  protected resources: T[] = [];
  protected page = 0;
  protected rows = 10;
  protected sortField = 'name';
  protected sortOrder = 'ASC';
  protected totalElements = 0;
  protected lazyLoadEvent: LazyLoadEvent;
  protected isLoading: boolean;

  constructor(
    protected injector: Injector,
    protected resource: T,
    protected resourceService: BaseResourceService<T>
  ) { }

  ngOnInit() {
  }

  protected getAll(): void {
    this.resourceService.getAll()
      .subscribe(
        resp => this.resources = resp.sort((a, b) => b.id - a.id),
        error => console.log(error)
      );
  }

  protected paginate(page: number, rows: number, sortField: string, sortOrder: string): void {
    this.resourceService.paginate(page, rows, sortField, sortOrder)
      .subscribe(resp => {
        this.resources = resp.content;
        this.totalElements = resp.totalElements;
      });
  }

  protected loadData(event: LazyLoadEvent): void {
    this.lazyLoadEvent = event;
    this.isLoading = true;
    this.sortField = event.sortField;
    this.sortOrder = this.getDirection(event.sortOrder);
    const currentPage = this.getCurrentPage(event.first, event.rows);
    this.paginate(currentPage, event.rows, this.sortField, this.sortOrder);
  }

  protected delete(resource: T): void {
    this.resourceService.delete(resource.id)
    .subscribe(
      () => this.resources = this.resources.filter(element => element !== resource), 
      error => console.log(error)
    );
  }

  private getCurrentPage(first: number, rows: number): number {
    return first/rows + 1
  }

  private getDirection(sortOrder: number) {
    return sortOrder === 1 ? 'ASC' : 'DESC';
  }

}
