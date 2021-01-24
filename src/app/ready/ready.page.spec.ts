import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReadyPage } from './ready.page';

describe('ReadyPage', () => {
  let component: ReadyPage;
  let fixture: ComponentFixture<ReadyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadyPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReadyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
