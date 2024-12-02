class AlignmentHelper {
  alignTransactionForm = formElements => {
    const { mainForm, hiddenForms } = formElements;
    this.#alignTransactionFormElements(mainForm, hiddenForms);
  };

  calculateEmojiTopMargin = emojiRow => {
    const emojiRowRect = emojiRow.getBoundingClientRect();
    const emojiRowHeight = emojiRow.offsetHeight;

    const emojiContainerTopMargin = Math.round(
      emojiRowRect.top - emojiRowHeight * 3.8
    );

    return `${emojiContainerTopMargin}px`;
  };

  #alignTransactionFormElements = (mainForm, hiddenForms) => {
    const topMargin = this.#calculateTransactionFormTopMargin(mainForm);
    const mainFormRightMargin =
      this.#calculateTransactionFormHorizontalMargin();
    const hiddenFormLeftMargin =
      this.#calculateTransactionHiddenFormLeftMargin();

    mainForm.style.top = topMargin;
    mainForm.style.right = mainFormRightMargin;

    hiddenForms.forEach(hiddenForm => {
      hiddenForm.style.top = topMargin;
      hiddenForm.style.left = hiddenFormLeftMargin;
    });
  };

  #calculateTransactionFormTopMargin = form => {
    const viewportHeight = window.innerHeight;
    let heightRatio =
      this.#calculateTransactionFormTopMarginHeightRatio(viewportHeight);
    const formHeight = form.offsetHeight;
    const topMargin = Math.round((viewportHeight - formHeight) / heightRatio);

    return `${topMargin}px`;
  };

  #calculateTransactionFormHorizontalMargin = () => {
    const viewportWidth = window.innerWidth;
    const rightMargin = Math.round(viewportWidth * (11 / 20));

    return `${rightMargin}px`;
  };

  #calculateTransactionHiddenFormLeftMargin = () => {
    const leftMargin = window.innerWidth / 2;
    return `${leftMargin}px`;
  };

  #calculateTransactionFormTopMarginHeightRatio = viewportHeight => {
    if (viewportHeight < 1050) {
      return 2;
    }
    if (viewportHeight < 1500) {
      return 3;
    }
    return 4;
  };
}

export default new AlignmentHelper();
