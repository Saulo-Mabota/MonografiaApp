import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddnotePage } from './addnote.page';

describe('AddnotePage', () => {
  let component: AddnotePage;
  let fixture: ComponentFixture<AddnotePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddnotePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
