/**
 * A Button Set driven by a Layer.UI.messages.ChocieMessageModel.
 *
 * The main input is the {@link #model}, and any events are delivered to and handled by that model
 *
 * @class Layer.UI.components.ChoiceButton
 * @extends Layer.UI.Component
 * @mixin Layer.UI.mixins.Clickable
 */
import { registerComponent } from '../component';
import Clickable from '../../mixins/clickable';

registerComponent('layer-choice-button', {
  mixins: [Clickable],
  style: `layer-choice-button {
    display: flex;
    flex-direction: row;
    align-content: stretch;
  }
  layer-choice-button layer-action-button {
    cursor: pointer;
    flex-grow: 1;
    width: 50px; // flexbox bug
  }
  .layer-button-content > * {
    max-width: 100%;
    width: 100%;
  }
  `,
  // Note that there is also a message property managed by the MessageHandler mixin
  properties: {
    /**
     * Set all choices enabled or disabled
     *
     * @property {Boolean} [disabled=false]
     */
    disabled: {
      type: Boolean,
      set(value) {
        for (let i = 0; i < this.childNodes.length; i++) this.childNodes[i].disabled = value;
      },
    },
    model: {},
  },

  methods: {
    /**
     * Each choice in the model is represented by a Layer.UI.components.ActionButton; generate those buttons and add them to the DOM.
     *
     * If any of the action buttons is clicked, it will trigger this widget's _onClick method.
     *
     * @method onAfterCreate
     */
    onAfterCreate() {
      this.model.on('message-type-model:change', this.onRerender, this);
      this.properties.buttons = [];
      this.model.choices.forEach((choice, index) => {
        const widget = this.createElement('layer-action-button', {
          text: this.model.getText(index),
          tooltip: this.model.getTooltip(index),
          parentNode: this,
          data: { id: choice.id },
          icon: choice.icon,
        });

        const def = { widget, choice };
        this.properties.buttons.push(def);
        this.addClickHandler('button-click', widget, this._onClick.bind(this, def));

      });
    },

    onRender() {
      this.onRerender();
    },

    /**
     * Whenever the model changes, update the selection state of all buttons.
     *
     * Also update any text/tooltip whenever the model changes.
     *
     * @method onRerender
     */
    onRerender() {
      if (!this.model.allowReselect) {
        this.toggleClass('layer-choice-message-view-complete', this.model.selectedAnswer);
      }

      for (let i = 0; i < this.childNodes.length; i++) {
        const child = this.childNodes[i];
        const isSelected = this.model.isSelectedIndex(i);
        child.disabled = !this.model.isSelectionEnabled() ||
          isSelected && !this.model.allowDeselect;
        child.selected = isSelected;

        this.childNodes[i].text = this.model.getText(i);
        this.childNodes[i].tooltip = this.model.getTooltip(i);
      }
    },


    /**
     * When clicked, find the associated Layer.UI.messages.MessageViewer and call its `_runAction` method.
     *
     * @param {Object} boundData
     * @param {Object} choice   The choice represented by this button
     * @param {Event} evt
     */
    _onClick({ choice }, evt) {
      evt.preventDefault();
      evt.stopPropagation();

      // Select the answer
      this.model.selectAnswer(choice);

      // Trigger any other customized events as though this were an action button
      let node = this;
      while (!node.isMessageTypeView && node.parentComponent) {
        node = node.parentComponent;
      }
      if (node.messageViewer) {
        node.messageViewer._runAction({ event: this.model.responseName, data: this.model });
      }
      if (evt) evt.target.blur();
    },
  },
});
