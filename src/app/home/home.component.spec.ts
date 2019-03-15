import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser'
import { HomeModule } from './home.module';
import { HomeComponent } from './home.component';
import { GoogleDriveService } from '../service/google-drive.service';
import { FakeGoogleDriveService } from '../../testing/fake/fake-google-drive.service'

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
        { provide: GoogleDriveService, useClass: FakeGoogleDriveService },
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
    expect((<HTMLElement>button.nativeElement).innerText.toLowerCase())
        .toContain('log in');
  });

});
