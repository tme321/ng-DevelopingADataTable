import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from './data-table.component';
import { Column } from './column/column.model';
import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const testData = [{ age: 1}, { age: 2 }];
const testColumns: Column[] = [{ title: 'Age', path: 'age'}];

/**
 * Necessary because the datatable uses onPush change detection
 * and a host testing component is the recommended way .
 * [issue #12313](https://github.com/angular/angular/issues/12313).
 */
@Component({
  template: `
    <table app-datatable 
      [columns]="columns$ | async"
      [data]="data$ | async">
    </table>`
})
class TestHostComponent {
  columns$ = new BehaviorSubject<Column[]>([]);
  data$ = new BehaviorSubject<any[]>([]);
}

describe('DataTableComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let component: DataTableComponent<any>;
  let fixture: ComponentFixture<DataTableComponent<any>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [ DataTableComponent, TestHostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance; 
    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('starts with no data', () => {
    expect(component.data === undefined).toBeTruthy();    
  });

  it('starts with no columns', () => {
    expect(component.columns === undefined).toBeTruthy();    
  });

  it('can have data set', ()=>{
    component.data = testData;
    expect(component.data === testData).toBeTruthy();    
  });

  it('can have columns set', ()=>{
    component.columns = testColumns;
    expect(component.columns === testColumns).toBeTruthy();    
  });

  it('should have no <td>s or <th>s with no data',()=>{
    const hostElement: HTMLDivElement = hostFixture.nativeElement;
    const results = hostElement.querySelectorAll('td,th');
    expect(results.length).toBe(0);
  });

  it('can resolve a basic path from a row', ()=>{
    expect(component.getData('age',{ age: 42 })).toBe(42);
  });

  it('can resolve a basic path from a row', ()=>{
    expect(component.getData('age',{ age: 42 })).toBe(42);
  });

  it('can resolve a \'.\' separated path from a row', ()=>{
    expect(
      component.getData('name.first', { name: { first: 'bob' } })
    ).toBe('bob');
  });

  it('can resolve a basic missing path as \'\'', ()=>{
    expect(
      component.getData('age', { foo: 'bar' })
    ).toBe('');
  });

  it('can resolve a fully missing separated path as \'\'', ()=>{
    expect(
      component.getData('foo.bar', { name: { first: 'bob' } })
    ).toBe('');
  });

  it('can resolve a partial missing separated path as \'\'', ()=>{
    expect(
      component.getData('name.last', { name: { first: 'bob' } })
    ).toBe('');
  });

  /**
   * Set the datatable to a known set of columns and data.
   * Verify that the table was rendered correctly.
   */
  it('should render the table correctly',fakeAsync(()=>{
    hostComponent.columns$.next(testColumns);
    hostComponent.data$.next(testData);
    hostFixture.detectChanges();
    hostFixture.detectChanges();
    
    const hostElement: HTMLDivElement = hostFixture.nativeElement;
    const tableElement: HTMLTableElement = hostElement.querySelector('table');
    const tdResults = tableElement.querySelectorAll('td');
    const thResults = tableElement.querySelectorAll('th');

    expect(tableElement.toString()).toBe('[object HTMLTableElement]');
    expect(tdResults.length).toBe(2);
    expect(thResults.length).toBe(1);
    expect(thResults[0].textContent).toBe('Age');
    expect(tdResults[0].textContent).toBe('1');
    expect(tdResults[1].textContent).toBe('2');
  }));

});
