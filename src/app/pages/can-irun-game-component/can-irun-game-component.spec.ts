import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanIRunGameComponent } from './can-irun-game-component';

describe('CanIRunGameComponent', () => {
  let component: CanIRunGameComponent;
  let fixture: ComponentFixture<CanIRunGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanIRunGameComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CanIRunGameComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
