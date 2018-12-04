import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoListTimerComponent } from './todo-list-timer.component';

describe('TodoListTimerComponent', () => {
  let component: TodoListTimerComponent;
  let fixture: ComponentFixture<TodoListTimerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodoListTimerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoListTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
