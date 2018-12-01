import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtlPageComponent } from './etl-page.component';

describe('EtlPageComponent', () => {
  let component: EtlPageComponent;
  let fixture: ComponentFixture<EtlPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtlPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtlPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
