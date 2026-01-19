import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestTemplatesComponent } from './test-templates.component';

describe('TestTemplatesComponent', () => {
  let component: TestTemplatesComponent;
  let fixture: ComponentFixture<TestTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestTemplatesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
