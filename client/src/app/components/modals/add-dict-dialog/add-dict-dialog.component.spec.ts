import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDictDialogComponent } from './add-dict-dialog.component';

describe('AddDictDialogComponent', () => {
  let component: AddDictDialogComponent;
  let fixture: ComponentFixture<AddDictDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDictDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDictDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
