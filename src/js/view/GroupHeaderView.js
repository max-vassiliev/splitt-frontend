class GroupHeaderView {
  #groupHeader;

  constructor() {
    this.#groupHeader = document.querySelector('.group__header');
  }

  addHandlerClick(handler) {
    this.#groupHeader.addEventListener('click', handler);
  }

  render({ title, avatar }) {
    this.#groupHeader.querySelector('.group__img').src = avatar;
    this.#groupHeader.querySelector('.group__title').textContent = title;
  }
}

export default new GroupHeaderView();
