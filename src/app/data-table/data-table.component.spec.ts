import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from './data-table.component';
import { Column } from './column/column.model';
import { Component, TrackByFunction } from '@angular/core';
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
      [data]="data$ | async"
      [rowTracker]="rowTracker$ | async"
      (selectionChanged)="onSelectionChanged($event)"
      (selectedDataChanged)="onDataChanged($event)"
      >
    </table>`
})
class TestHostComponent {
  columns$ = new BehaviorSubject<Column[]>([]);
  data$ = new BehaviorSubject<any[]>([]);
  rowTracker$ = new BehaviorSubject<TrackByFunction<any[]>>((index: number, row: any)=>row);

  selection: boolean[] = [];
  data: any[] = [];

  onSelectionChangedCalled = 0;
  onDataChangedCalled = 0;

  onSelectionChanged(selection: boolean[]) {
    this.selection = selection;
    this.onSelectionChangedCalled++;
  }

  onDataChanged(data: any[]) {
    this.data = data;
    this.onDataChangedCalled++;
  }
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
    expect(component.data instanceof Array && component.data.length === 0).toBeTruthy();    
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
    expect(areColumnsEqual(component.columns, testColumns)).toBeTruthy();    
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

  it('can set row tracker', ()=>{
    
    let customRowTrackerCalled = 0;
    hostComponent.rowTracker$.next((idx,item)=>{ 
      customRowTrackerCalled++;
      console.log('row tracker');
      return item; 
    });
    hostComponent.data$.next(testData);
    hostComponent.columns$.next(testColumns);
    hostFixture.detectChanges();

    expect(customRowTrackerCalled).toBeGreaterThan(0);
  });

  it('will select a row on click callback and output the events',()=>{
    hostComponent.columns$.next(testColumns);
    hostComponent.data$.next(testData);
    hostFixture.detectChanges();

    expect(hostComponent.selection.length).toBe(0);
    expect(hostComponent.onSelectionChangedCalled).toBe(1);
    expect(hostComponent.data.length).toBe(0);
    expect(hostComponent.onDataChangedCalled).toBe(1);

    const hostElement: HTMLDivElement = hostFixture.nativeElement;
    const tableElement: HTMLTableElement = hostElement.querySelector('table');
    const tbodyElement: HTMLTableSectionElement = tableElement.querySelector('tbody');
    const trResults = tbodyElement.querySelectorAll('tr');
    trResults.item(0).click();
    hostFixture.detectChanges();

    expect(JSON.stringify(hostComponent.selection)).toMatch(JSON.stringify([true]));
    expect(hostComponent.onSelectionChangedCalled).toBe(2);
    expect(JSON.stringify(hostComponent.data)).toMatch(JSON.stringify([{ age: 1}]));
    expect(hostComponent.onDataChangedCalled).toBe(2);

    const ctrlClickEvent = new MouseEvent('click',{
      ctrlKey: true
    });
    trResults.item(1).dispatchEvent(ctrlClickEvent);
    hostFixture.detectChanges();

    expect(JSON.stringify(hostComponent.selection)).toMatch(JSON.stringify([true, true]));
    expect(hostComponent.onSelectionChangedCalled).toBe(3);
    expect(JSON.stringify(hostComponent.data)).toMatch(JSON.stringify([{ age: 1}, { age: 2}]));
    expect(hostComponent.onDataChangedCalled).toBe(3);

    const clickEvent = new MouseEvent('click',{
      ctrlKey: false
    });
    trResults.item(0).dispatchEvent(clickEvent);
    hostFixture.detectChanges();

    expect(JSON.stringify(hostComponent.selection)).toMatch(JSON.stringify([false, true]));
    expect(hostComponent.onSelectionChangedCalled).toBe(4);
    expect(JSON.stringify(hostComponent.data)).toMatch(JSON.stringify([{ age: 2}]));
    expect(hostComponent.onDataChangedCalled).toBe(4);

  });


  /**
   * Set the datatable to a known set of columns and data.
   * Verify that the table was rendered correctly.
   */
  it('should render the table correctly',fakeAsync(()=>{
    hostComponent.columns$.next(testColumns);
    hostComponent.data$.next(testData);
    hostFixture.detectChanges();
    
    const hostElement: HTMLDivElement = hostFixture.nativeElement;
    const tableElement: HTMLTableElement = hostElement.querySelector('table');
    const tdResults = tableElement.querySelectorAll('td');
    const thResults = tableElement.querySelectorAll('th');

    console.log(tdResults);
    expect(tableElement.toString()).toBe('[object HTMLTableElement]');
    expect(tdResults.length).toBe(2);
    expect(thResults.length).toBe(1);
    expect(thResults[0].textContent.trim()).toBe('Age');
    expect(tdResults[0].textContent.trim()).toBe('1');
    expect(tdResults[1].textContent.trim()).toBe('2');
  }));

});

export function areColumnsEqual(c1: Column[], c2: Column[]) {
  if(c1.length !== c2.length) { 
    return false;
  }

  for(let i = 0; i < c1.length; i++) {
    if(c1[i].title !== c2[i].title || c1[i].path !== c2[i].path) { 
      return false; 
    }
  }

  return true;
}