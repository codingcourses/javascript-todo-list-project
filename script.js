/**
 * @class Model
 *
 * Manages the data of the application.
 */
class Model {
  constructor() {
    this.items = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];
  }

  addItem(item) {
    this.items.push(item);
    this.onChange(this.items);
  }

  deleteItem(id) {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) {
      return;
    }
    this.items.splice(index, 1);
    this.onChange(this.items);
  }

  toggleItem(id) {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) {
      return;
    }
    this.items[index].completed = !this.items[index].completed;
    this.onChange(this.items);
  }

  saveItems() {
    localStorage.setItem('todos', JSON.stringify(this.items));
  }

  bindOnChange(onChange) {
    this.onChange = onChange;
  }
}

/**
 * @class View
 *
 * Visual representation of the model.
 */
class View {
  constructor() {
    this.textInput = this.getElement('#text-input');
    this.addButton = this.getElement('#add-button');
    this.itemsList = this.getElement('#items-list');
    this.emptyState = this.getElement('#empty-state');
  }

  getElement(selector) {
    const element = document.querySelector(selector);
    return element;
  }

  bindAddItem(handler) {
    this.addButton.addEventListener('click', event => {
      if (!this.textInput.value) {
        return;
      }

      handler(this.textInput.value);

      this.textInput.value = '';
    });
  }

  bindOnDelete(onDelete) {
    this.onDelete = onDelete;
  }

  bindOnToggle(onToggle) {
    this.onToggle = onToggle;
  }

  updateItemsList(items) {
    if (!items.length) {
      this.itemsList.style.display = 'none';
      this.emptyState.style.display = 'block';
      return;
    }

    this.itemsList.innerHTML = '';
    this.itemsList.style.display = 'block';
    this.emptyState.style.display = 'none';

    for (const item of items) {
      const li = document.createElement('li');
      li.setAttribute('class', 'uk-card uk-card-default uk-card-body uk-card-small uk-flex');

      const divCheckbox = document.createElement('div');
      divCheckbox.setAttribute('class', 'uk-margin-small-right');

      const checkbox = document.createElement('input');
      checkbox.setAttribute('class', 'uk-checkbox');
      checkbox.setAttribute('type', 'checkbox');
      checkbox.addEventListener('click', event => {
        if (this.onToggle) {
          this.onToggle(item.id);
        }
      });

      const divText = document.createElement('div');
      divText.setAttribute('class', 'uk-width-expand');
      divText.textContent = item.text;
      if (item.completed) {
        divText.style.textDecoration = 'line-through';
      }

      const divDeleteButton = document.createElement('div');
      const deleteButton = document.createElement('a');
      deleteButton.setAttribute('uk-icon', 'trash');
      deleteButton.addEventListener('click', event => {
        if (this.onDelete) {
          this.onDelete(item.id);
        }
      });

      divCheckbox.appendChild(checkbox);
      divDeleteButton.appendChild(deleteButton);
      li.appendChild(divCheckbox);
      li.appendChild(divText);
      li.appendChild(divDeleteButton);
      this.itemsList.appendChild(li);
    }
  }
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
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.model.bindOnChange(this.onChange);
    this.view.bindAddItem(this.onAddItem);
    this.view.bindOnDelete(this.onDeleteItem);
    this.view.bindOnToggle(this.onToggleItem);

    this.onChange(this.model.items);
  }

  onChange = items => {
    this.view.updateItemsList(items);
    this.model.saveItems();
  };

  onAddItem = text => {
    this.model.addItem({
      id: generateID(),
      completed: false,
      text,
    });
  }

  onDeleteItem = id => {
    this.model.deleteItem(id);
  };

  onToggleItem = id => {
    this.model.toggleItem(id);
  };
}

const app = new Controller(new Model(), new View());

function generateID() {
  return Math.random().toString(36).substr(2, 9);
}
