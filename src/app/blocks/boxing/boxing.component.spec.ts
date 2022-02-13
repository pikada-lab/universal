import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxingComponent } from './boxing.component';

describe('BoxingComponent', () => {
  let component: BoxingComponent;
  let fixture: ComponentFixture<BoxingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoxingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
