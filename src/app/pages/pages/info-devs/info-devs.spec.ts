import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoDevs } from './info-devs';

describe('InfoDevs', () => {
  let component: InfoDevs;
  let fixture: ComponentFixture<InfoDevs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoDevs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoDevs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
