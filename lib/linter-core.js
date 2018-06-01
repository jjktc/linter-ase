module.exports = {
  atomLinter: null,
  editor: null,
  filePath: "",
  fileContents: "",

  lintCore: function(atomLinter, editor, results) {
    console.log("Running linter core");

    this.filePath = editor.getPath();
    this.fileContents = editor.getText();

    console.log("Linting for file: ", [this.filePath]);
    console.log("With content: ", [this.fileContents]);

    this.atomLinter = atomLinter;
    this.editor = editor;

    this.badCase_eoi(results);
  },

  badCase_eoi: function(results) {
    const msgLine = 1;

    let severity = 'info';

    const position = this.atomLinter.generateRange(this.editor, msgLine, 0);

    results.push({
      severity,
      excerpt: 'test',
      location: {
        file: this.filePath,
        position
      }
    });
  }
}
