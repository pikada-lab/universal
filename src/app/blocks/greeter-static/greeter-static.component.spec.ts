import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GreeterStaticComponent } from './greeter-static.component';

describe('GreeterStaticComponent', () => {
  let component: GreeterStaticComponent;
  let fixture: ComponentFixture<GreeterStaticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GreeterStaticComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GreeterStaticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
