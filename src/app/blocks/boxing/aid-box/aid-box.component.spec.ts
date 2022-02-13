import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AidBoxComponent } from './aid-box.component';

describe('AidBoxComponent', () => {
  let component: AidBoxComponent;
  let fixture: ComponentFixture<AidBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AidBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AidBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
