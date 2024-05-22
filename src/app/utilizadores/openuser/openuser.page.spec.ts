import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OpenuserPage } from './openuser.page';

describe('OpenuserPage', () => {
  let component: OpenuserPage;
  let fixture: ComponentFixture<OpenuserPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OpenuserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
