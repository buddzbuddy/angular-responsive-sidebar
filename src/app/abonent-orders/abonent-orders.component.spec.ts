import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbonentOrdersComponent } from './abonent-orders.component';

describe('AbonentOrdersComponent', () => {
  let component: AbonentOrdersComponent;
  let fixture: ComponentFixture<AbonentOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbonentOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbonentOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
