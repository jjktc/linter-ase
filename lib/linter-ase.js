'use babel';

import LinterAseView from './linter-ase-view';
import { CompositeDisposable } from 'atom';

export default {

  linterAseView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.linterAseView = new LinterAseView(state.linterAseViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.linterAseView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'linter-ase:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.linterAseView.destroy();
  },

  serialize() {
    return {
      linterAseViewState: this.linterAseView.serialize()
    };
  },

  toggle() {
    console.log('LinterAse was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
