import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AurkituFileSelectorComponent } from './aurkitu-file-selector.component';

describe('AurkituFileSelectorComponent', () => {
  let component: AurkituFileSelectorComponent;
  let fixture: ComponentFixture<AurkituFileSelectorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AurkituFileSelectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AurkituFileSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
