class Model {
  #data;
  #onChange;

  constructor() {
    this.#data = localStorage.getItem(LOCAL_STORAGE_KEY)
      ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
      : [];
    this.#onChange = () => {};
  }

  addItem(item) {
    this.#data.push({
      id: uuidv4(),
      ...item,
    });
    this.#onChange(this.#data);
  }

  deleteItem(id) {
    const index = this.#data.findIndex(item => item.id === id);
    if (index === -1) {
      return;
    }
    this.#data.splice(index, 1);
    this.#onChange(this.#data);
  }

  toggleItem(id) {
    const index = this.#data.findIndex(item => item.id === id);
    if (index === -1) {
      return;
    }
    this.#data[index].completed = !this.#data[index].completed;
    this.#onChange(this.#data);
  }

  save() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.#data));
  }

  bindOnChange(handler) {
    this.#onChange = handler;
  }

  initialize() {
    this.#onChange(this.#data);
  }
}

class View {
  #textInput;
  #list;
  #emptyState;
  #onToggle;
  #onDelete;

  constructor() {
    this.#textInput = View.getElement('#text-input');
    this.#list = View.getElement('#list');
    this.#emptyState = View.getElement('#empty-state');
    this.#onToggle = () => {};
    this.#onDelete = () => {};
  }

  static getElement(selector) {
    const elem = document.querySelector(selector);
    return elem;
  }

  bindAddItem(handler) {
    this.#textInput.addEventListener('keypress', event => {
      if (event.key === 'Enter' || event.keyCode === 12 || event.which === 12) {
        const value = this.#textInput.value;
        handler(value);
        this.#textInput.value = '';
      }
    });
  }

  bindToggleItem(handler) {
    this.#onToggle = handler;
  }

  bindDeleteItem(handler) {
    this.#onDelete = handler;
  }

  updateList(items) {
    this.#list.innerHTML = '';

    if (!items.length) {
      this.#emptyState.style.display = 'block';
      return;
    }

    this.#emptyState.style.display = 'none';

    for (const item of items) {
      const li = document.createElement('li');
      li.setAttribute('class', 'item');

      const checkbox = document.createElement('input');
      checkbox.setAttribute('class', 'item-checkbox');
      checkbox.setAttribute('type', 'checkbox');
      checkbox.checked = item.completed;
      checkbox.addEventListener('click', () => {
        if (this.#onToggle) {
          this.#onToggle(item.id);
        }
      });

      const text = document.createElement('div');
      text.setAttribute('class', 'item-text');
      text.textContent = item.text;
      if (item.completed) {
        text.style.textDecoration = 'line-through';
      }

      const deleteButton = document.createElement('span');
      deleteButton.setAttribute('class', 'item-delete');
      deleteButton.setAttribute('uk-icon', 'trash');
      deleteButton.addEventListener('click', () => {
        if (this.#onDelete) {
          this.#onDelete(item.id);
        }
      });

      li.append(checkbox, text, deleteButton);
      this.#list.append(li);
    }
  }
}

class Controller {
  #model;
  #view;

  constructor(model, view) {
    this.#model = model;
    this.#view = view;

    this.#view.bindAddItem(this.onAddItem);
    this.#view.bindToggleItem(this.onToggleItem);
    this.#view.bindDeleteItem(this.onDeleteItem);

    this.#model.bindOnChange(this.onItemsChange);

    this.#model.initialize();
  }

  onAddItem = value => {
    if (!value) {
      return;
    }

    const item = {
      text: value,
      completed: false,
    };
    this.#model.addItem(item);
  };

  onToggleItem = id => this.#model.toggleItem(id);

  onDeleteItem = id => this.#model.deleteItem(id);

  onItemsChange = items => {
    this.#view.updateList(items);
    this.#model.save();
  }
}

const LOCAL_STORAGE_KEY = 'TodoListProject';

const app = new Controller(new Model(), new View());
