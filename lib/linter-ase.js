'use babel';

import * as helpers from 'atom-linter'
import Path from 'path';
import { CompositeDisposable } from 'atom';
import type { TextEditor } from 'atom';

let atomlinter;

function loadDeps() {
  if (!atomlinter) {
    atomlinter = require('atom-linter');
    console.log("Atom linter", atomlinter);
  }
}

export default {
  subscriptions: null,

  activate(state) {
    console.log("ASE Linter activated");
    this.idleCallbacks = new Set();
    let depsCallbackID;
    const installLinterASELintDeps = () => {
      this.idleCallbacks.delete(depsCallbackID);
      if (!atom.inSpecMode()) {
        require("atom-package-deps").install("linter-ase");
      }

      loadDeps();
    }

    depsCallbackID = window.requestIdleCallback(installLinterASELintDeps);
    this.idleCallbacks.add(depsCallbackID);

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();
  },

  deactivate() {
    this.idleCallbacks.forEach(callbackID => window.cancelIdleCallback(callbackID));
    this.idleCallbacks.clear();
    this.subscriptions.dispose();
  },

  toggle() {
    console.log('LinterAse was toggled!');
  },

  provideLinter() {
    console.log("Linter Provider was requested");
    return {
      name: "ASELinter",
      grammarScopes: ["source.ase"],
      scope: "file",
      lintsOnChange: true,
      lintsOnOpen: true,
      lint: async (editor) => {
        console.log("Attemping to lint", editor);

        loadDeps();
        const results = [];

        const filePath = editor.getPath();

        const msgLine = 1;

        let severity = 'info';

        const position = atomlinter.generateRange(editor, msgLine, 0);

        results.push({
          severity,
          excerpt: 'test',
          location: {
            file: filePath,
            position
          }
        });

        return results;
      }
    };
  }

};
