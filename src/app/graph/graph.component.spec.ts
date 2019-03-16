import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser'
import { GraphModule } from './graph.module';
import { GraphComponent } from './graph.component';
import { GoogleRealtimeService } from '../service/google-realtime.service';
import { FakeGoogleRealtimeService } from 'src/testing/fake/fake-google-realtime.service';
import { GoogleDriveService } from '../service/google-drive.service';
import { FakeGoogleDriveService } from 'src/testing/fake/fake-google-drive.service';

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
        { provide: GoogleRealtimeService, useClass: FakeGoogleRealtimeService },
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(GraphComponent);
  }));

  it('should have a side panel', () => {
    const sidePanel = fixture.debugElement.query(By.css('side-panel'));
    expect(sidePanel).toBeTruthy();
  });

});
