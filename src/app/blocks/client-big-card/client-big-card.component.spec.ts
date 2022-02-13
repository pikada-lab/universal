import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientBigCardComponent } from './client-big-card.component';

describe('ClientBigCardComponent', () => {
  let component: ClientBigCardComponent;
  let fixture: ComponentFixture<ClientBigCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientBigCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientBigCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
