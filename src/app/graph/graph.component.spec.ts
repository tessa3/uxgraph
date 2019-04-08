import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { GraphModule } from './graph.module';
import { GraphComponent } from './graph.component';
import { FakeGoogleDriveService } from '../utils/testing/fake-google-drive.service';
import { MetadataFileService } from '../service/metadata-file.service';

describe('Graph', () => {
  let fixture: ComponentFixture<GraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        GraphModule,
        RouterTestingModule
      ],
      providers: [
        { provide: MetadataFileService, useClass: FakeGoogleDriveService },
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(GraphComponent);
  }));

  it('should have a side panel', () => {
    const sidePanel = fixture.debugElement.query(By.css('uxg-side-panel'));
    expect(sidePanel).toBeTruthy();
  });

});
