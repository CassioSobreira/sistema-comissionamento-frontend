import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableFilterBasicDemo } from './table';

describe('TableFilterBasicDemo', () => {
  let component: TableFilterBasicDemo;
  let fixture: ComponentFixture<TableFilterBasicDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableFilterBasicDemo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableFilterBasicDemo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
