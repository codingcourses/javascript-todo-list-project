/**
 * @class Model
 *
 * Manages the data of the application.
 */
class Model {
  constructor() {
    this.todos = [];
  }

  addTodo(item) {
    this.todos.push(item);
  }

  deleteTodo(id) {
    const index = this.todos.findIndex(item => item.id === id);
    this.todos.splice(index, 1);
  }
}

/**
 * @class View
 *
 * Visual representation of the model.
 */
class View {
  constructor() {}
}

/**
 * @class Controller
 *
 * Links the model and the view.
 *
 * @param model
 * @param view
 */
class Controller {
  constructor(model, view) {}
}

const app = new Controller(new Model(), new View());
