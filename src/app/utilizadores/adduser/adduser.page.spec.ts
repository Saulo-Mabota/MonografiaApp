import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdduserPage } from './adduser.page';

describe('AdduserPage', () => {
  let component: AdduserPage;
  let fixture: ComponentFixture<AdduserPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AdduserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
