import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DataService } from './data/data.service';
import { Column } from './data-table/column/column.model';
import { Data, Entry } from './data/data.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush  
})
export class AppComponent {
  title = 'ng-DevelopingADataTable';

  get data$() {
    return this.dataService.data$;
  }

  get columns(): Column[] {
    return columns;
  }

  idTracker = (index: number, row: Entry)=>row._id;

  constructor(private dataService: DataService) {
    /*
    dataService.data$.subscribe(data=>{
      console.log("Data:",data);
    })
    */
  }
  
  getData() {
    this.dataService.getData();
  }

  getData2() {
    this.dataService.getData2();
  }

  getDataLarge() {
    this.dataService.getDataLarge();
  }

  
}

const columns: Column[] = [
  { 
    title: 'ID',
    path:'_id'
  },
  {
    title: 'Index',
    path: 'index'
  },
  {
    title: 'GUID',
    path: 'guid'
  },
  {
    title: 'Is Active?',
    path: 'isActive'
  },
  {
    title: 'Balance',
    path: 'balance'
  },
  {
    title: 'Picture URL',
    path: 'picture'
  },
  {
    title: 'Age',
    path: 'age'
  },
  {
    title: 'Eye Color',
    path: 'eyeColor'
  },
  {
    title: 'First Name',
    path: 'name.first'
  },
  {
    title: 'Last Name',
    path: 'name.last'
  },
  {
    title: 'Company',
    path: 'company'
  },
  {
    title: 'Email',
    path: 'email'
  },
  {
    title: 'Phone #',
    path: 'phone'
  },
  {
    title: 'Address',
    path: 'address'
  }
];
