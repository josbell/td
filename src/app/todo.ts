export class Todo {
  id: number;
  title = '';
  complete = false;
  timeSpent = 0;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
