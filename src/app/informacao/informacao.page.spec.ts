import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { informacaoPage } from './informacao.page';

describe('informacaoPage', () => {
  let component: informacaoPage;
  let fixture: ComponentFixture<informacaoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [informacaoPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(informacaoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
