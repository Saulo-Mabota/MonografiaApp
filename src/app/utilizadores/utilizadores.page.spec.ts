import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { utilizadoresPage } from './utilizadores.page';

describe('Tab1Page', () => {
  let component: utilizadoresPage;
  let fixture: ComponentFixture<utilizadoresPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [utilizadoresPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(utilizadoresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
