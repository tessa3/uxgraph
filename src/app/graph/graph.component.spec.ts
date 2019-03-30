import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { GraphModule } from './graph.module';
import { GraphComponent } from './graph.component';
import { GoogleDriveService } from '../service/google-drive.service';
import { FakeGoogleDriveService } from '../utils/testing/fake-google-drive.service';

describe('Graph', () => {
  let fixture: ComponentFixture<GraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        GraphModule,
        RouterTestingModule
      ],
      providers: [
        { provide: GoogleDriveService, useClass: FakeGoogleDriveService },
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(GraphComponent);
  }));

  it('should have a side panel', () => {
    const sidePanel = fixture.debugElement.query(By.css('uxg-side-panel'));
    expect(sidePanel).toBeTruthy();
  });

});
