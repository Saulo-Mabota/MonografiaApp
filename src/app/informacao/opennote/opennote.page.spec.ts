import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OpennotePage } from './opennote.page';

describe('OpennotePage', () => {
  let component: OpennotePage;
  let fixture: ComponentFixture<OpennotePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OpennotePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
