class WindowView {
  addHandlerResize = handler => {
    window.addEventListener('resize', handler);
  };
}

export default new WindowView();
