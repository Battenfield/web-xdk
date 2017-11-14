/**
 * UI for a Choice Message
 *
 * @class Layer.UI.messages.ChoiceView
 * @mixin Layer.UI.messages.MessageViewMixin
 * @extends Layer.UI.components.Component
 */

import { registerComponent } from '../../components/component';

import MessageViewMixin from '../message-view-mixin';
import '../../components/layer-action-button/layer-action-button';

registerComponent('layer-choice-view', {
  mixins: [MessageViewMixin],
  template: `
    <div layer-id='question' class='layer-choice-view-question'></div>
    <div layer-id='answers' class='layer-choice-view-answers'></div>
  `,
  style: `
  layer-choice-view .layer-choice-view-answers {
    display: flex;
    flex-direction: column;
  }

  `,
  properties: {

    /**
     * Use a Titled Display Container to render this UI.
     *
     * @property {String} [messageViewContainerTagName=layer-titled-display-container]
     */
    messageViewContainerTagName: {
      noGetterFromSetter: true,
      value: 'layer-titled-display-container',
    },

    // See parent definition
    widthType: {
      value: 'flex-width',
    },
  },
  methods: {
    /**
     * Provide a CSS clas to the <layer-titled-display-container />.
     *
     * @method _getIconClass
     * @protected
     */
    _getIconClass() {
      return 'layer-poll-view-icon';
    },
    _getTitle() {
      return this.model.title;
    },

    onAfterCreate() {
      this.nodes.question.innerText = this.model.question;
      this.model.choices.forEach((choice) => {
        this.createElement('layer-action-button', {
          text: choice.text,
          tooltip: choice.tooltip,
          event: 'layer-choice-select',
          data: { id: choice.id },
          icon: choice.icon,
          parentNode: this.nodes.answers,
        });
      });
    },

    onRerender() {
      this.toggleClass('layer-choice-view-complete', this.model.selectedAnswer);

      this.model.choices.forEach((choice, index) => {
        const button = this.nodes.answers.childNodes[index];
        button.text = this.model.getText(index);
        button.tooltip = this.model.getTooltip(index);
        button.selected = this.model.isSelectedIndex(index);
        button.disabled = !this.model.isSelectionEnabledFor(index);
      });
    },

    onChoiceSelect(data) {
      this.model.selectAnswer(data);
    },

    runAction({ event, data }) {
      if (event === 'layer-choice-select') {
        if (!this.model.isSelectionEnabled()) return;
        this.onChoiceSelect(data);

        const rootPart = this.model.message.getPartsMatchingAttribute({ role: 'root' })[0];
        const rootModel = this.client.getMessageTypeModel(rootPart.id);
        this.trigger(this.model.responseName, {
          model: this.model,
          data: this.model,
          rootModel,
        });
      }
    },
  },
});

