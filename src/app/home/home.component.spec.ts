import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { HomeModule } from './home.module';
import { HomeComponent } from './home.component';
import { FakeGoogleDriveService } from '../utils/testing/fake-google-drive.service';
import { MetadataFileService } from '../service/metadata-file.service';

describe('Home', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HomeModule,
        RouterTestingModule
      ],
      providers: [
        { provide: MetadataFileService, useClass: FakeGoogleDriveService },
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  }));

  it('should have a log in button if user is not logged in', () => {
    component.userLoggedIn = false;
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button.auth-button'));
    expect(button).toBeTruthy();
    expect((button.nativeElement as HTMLElement).innerText.toLowerCase())
        .toContain('log in');
  });

});
