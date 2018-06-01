/**
 * LINTER CORE
 * @author Jeff
 *
 * @description FEATURES:
 * - enforce correct capitalization of constants
 * - enforce correct spacing
 * - enforce missing symbols
 * - enforce naming conventions
 */

module.exports = {
  atomLinter: null,
  editor: null,
  filePath: "",
  fileContents: "",

  badCaseSeverity: 'warning',
  badCaseHoverText: 'Incorrect capitalization for constant. Did you mean: ',

  aseConstants: [
    'eoi', 'NullObject', 'JSONObject'
  ],

  aseSpacers: [
    [
      '(\\+)',//TODO fix matching against *
      'aseOperator'
    ]
  ],

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
    this.badCase(results);
    this.enforceSpacing(results);
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
   * Find and detect improperly cased constant
   *
   * EXAMPLE: constant eoi
   * GOOD: eoi
   * BAD: EOI, eOi, etc.
   *
   * @param {Array} results the array of results
   */
  badCase: function(results) {
    for (var i = 0; i < this.aseConstants.length; i++) {
      this.checkBadCase(results, this.aseConstants[i]);
    }
  },

  checkBadCase: function(results, goodCase) {
    this.editor.scan(new RegExp('\\b(' + goodCase + ')\\b', 'gi'), iterator => {
      if (iterator.match.input != goodCase) {
        this.addLint(results, this.badCaseSeverity, this.badCaseHoverText + goodCase, iterator.range)
      }
    });
  },

  /**
   * Find and detect improperly spaced keywords based on syntax scope
   *
   * EXAMPLE: functions
   * GOOD: itemcount( $sFilterTmp, eoi )
   * BAD: itemcount($sFilterTmp, eoi)
   *
   * @param {Array} results the array of results
   */
  enforceSpacing: function(results) {
    for (var i = 0; i < this.aseSpacers.length; i++) {
      this.checkSpacing(results, this.aseSpacers[i]);
    }
  },

  checkSpacing: function(results, spacer) {
    var spacerRegex = spacer[0];
    var spacerScope = spacer[1];

    this.editor.scan(new RegExp(spacerRegex, 'g'), iterator => {
      var position = iterator.range.start;
      var bufferPosition = [position.row, position.column];
      console.log(iterator.matchText, bufferPosition);
      var scope = this.editor.scopeDescriptorForBufferPosition(bufferPosition).scopes;

      console.log(scope);

      if (this.hasScope(scope, spacerScope)) {
        //console.log(iterator.match);
      }
    });
  },

  /****************************************************************************
   * LINTER UTILITY FUNCTIONS BELOW:
   * @author Jeff
   */

  /**
   * Adds a piece of lint to the linter
   *
   * @param {Array} results the array of results
   * @param {string} severity the level of severity (info|warning|error)
   * @param {string} hoverText the text to display on hovering over the lint
   * @param {number} indexStart the first character to draw lint on (Optional)
   * @param {number} indexEnd the last character to draw lint on (Optional)
   */
  addLint: function(results, severity, hoverText, messageLine, indexStart, indexEnd) {
    var position;

    if (indexStart !== undefined) {
      if (indexEnd !== undefined && indexEnd > 0) {
        // End the lint before the end of the line
        position = [[messageLine, indexStart], [messageLine, indexEnd]];
      } else {
        position = this.atomLinter.generateRange(this.editor, messageLine, indexStart);
      }
    } else {
      // Passed a range in the messageLine parameter
      position = [[messageLine.start.row, messageLine.start.column], [messageLine.end.row, messageLine.end.column]];
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

  hasScope: function(fullScope, subScope) {
    var scopesArray = [].concat(fullScope);
    if (fullScope[0] != "source.ase") {
      return false;
    }

    if (scopesArray.length < 2) {
      return false;
    }

    var scopes = fullScope[1].split(".");
    for (var i = 0; i < scopes.length; i++) {
      if (scopes == subScope) {
        return true;
      }
    }

    return false;
  }
}
