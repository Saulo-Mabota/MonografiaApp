import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { pessoalPage } from './pessoal.page';

describe('pessoalPage', () => {
  let component: pessoalPage;
  let fixture: ComponentFixture<pessoalPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [pessoalPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(pessoalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
