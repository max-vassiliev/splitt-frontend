class Group {
  #id;
  #title;
  #avatar;

  constructor({ id, title, avatar }) {
    this.#id = id;
    this.#title = title;
    this.#avatar = avatar;
  }

  get id() {
    return this.#id;
  }

  set id(value) {
    this.#id = value;
  }

  get title() {
    return this.#title;
  }

  set title(value) {
    this.#title = value;
  }

  get avatar() {
    return this.#avatar;
  }

  set avatar(value) {
    this.#avatar = value;
  }
}

export default Group;
