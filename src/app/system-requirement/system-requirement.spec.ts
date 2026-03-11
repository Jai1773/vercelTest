import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemRequirement } from './system-requirement';

describe('SystemRequirement', () => {
  let component: SystemRequirement;
  let fixture: ComponentFixture<SystemRequirement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemRequirement],
    }).compileComponents();

    fixture = TestBed.createComponent(SystemRequirement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
