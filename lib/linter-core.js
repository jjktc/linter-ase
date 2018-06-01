module.exports = {
  atomLinter: null,
  editor: null,
  filePath: "",
  fileContents: "",

  /**
   * Runs the core functionality of the ASE Linter
   *
   * @param {Object} atomLinter the atom linter module
   * @param {TextEditor} editor the current active text editor to lint
   * @param {Array} results the array of results
   */
  lintCore: function(atomLinter, editor, results) {
    this.filePath = editor.getPath();
    this.fileContents = editor.getText();

    console.log("Running linter CORE: ", [this.filePath, this.fileContents]);

    this.atomLinter = atomLinter;
    this.editor = editor;

    this.displayInfo(results);
    this.badCase_eoi(results);
  },

  /**
   * Adds a piece of lint to the linter
   *
   * @param {Array} results the array of results
   * @param {string} severity the level of severity (info|warning|error)
   * @param {string} hoverText the text to display on hovering over the lint
   * @param {number} indexStart the first character to draw lint on
   * @param {number} indexEnd the last character to draw lint on (Optional)
   */
  addLint: function(results, severity, hoverText, messageLine, indexStart, indexEnd) {
    var position = this.atomLinter.generateRange(this.editor, messageLine, indexStart);

    if (indexEnd) {
      // End the lint before the end of the line
      position = [[messageLine, indexStart], [messageLine, indexEnd]];
    }

    const lint = {
      severity,
      excerpt: hoverText,
      location: {
        file: this.filePath,
        position: position
      }
    };

    console.log("Adding lint", lint);
    results.push(lint);
  },

  /**
   * Display the fact that the ASE Linter is active
   *
   * @param {Array} results the array of results
   */
  displayInfo: function(results) {
    this.addLint(results, 'info', 'ASE Linter is enabled', 0, 0, 1);
  },

  /**
   * Find and detect improperly cased constant: eoi
   *
   * GOOD: eoi
   * BAD: EOI, eOi, etc.
   *
   * @param {Array} results the array of results
   */
  badCase_eoi: function(results) {
    
  }
}
