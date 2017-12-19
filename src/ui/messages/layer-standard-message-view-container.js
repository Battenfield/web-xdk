/**
 * This container wraps simpler Layer.UI.messages.MessageViewMixin and adds a metadata section below the UI.
 *
 * @class Layer.UI.messages.StandardMessageViewContainer
 * @extends Layer.UI.Component
 */
import { registerComponent } from '../components/component';
import Base from '../base';

registerComponent('layer-standard-message-view-container', {
  style: `
    layer-standard-message-view-container {
      display: flex;
      flex-direction: column;
      align-items: stretch;
    }
    layer-standard-message-view-container.layer-card-no-metadata .layer-card-body {
      display: none;
    }
    layer-standard-message-view-container .layer-card-top {
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    layer-standard-message-view-container .layer-card-body-outer {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    layer-standard-message-view-container .layer-card-body-outer .layer-card-body {
      flex-grow: 1;
      width: 100%;
    }
  `,
  template: `
  <div layer-id='UIContainer' class='layer-card-top'></div>
  <div class="layer-card-body-outer">
    <div class="layer-card-body">
      <div layer-id="title" class="layer-card-title"></div>
      <div layer-id="description" class="layer-card-description"></div>
      <div layer-id="footer" class="layer-card-footer"></div>
    </div>
    <span class="layer-next-icon" ></span>
  </div>`,

   // Note that there is also a message property managed by the MessageHandler mixin
  properties: {
    /**
     * The Layer.Core.MessageTypeModel whose data is rendered here.
     *
     * @type {Layer.Core.MessageTypeModel} model
     */
    model: {
      set(newModel, oldModel) {
        if (oldModel) oldModel.off(null, null, this);
        if (newModel) this.model.on('message-type-model:change', this.onRerender, this);
      },
    },

    /**
     * The Layer.UI.messages.MessageViewMixin that is wrapped by this UI Component.
     *
     * @type {Layer.UI.messages.MessageViewMixin} ui
     */
    ui: {
      set() {
        while (this.nodes.UIContainer.firstChild) {
          this.nodes.UIContainer.removeChild(this.nodes.UIContainer.firstChild);
        }
        if (this.properties.ui) this.nodes.UIContainer.appendChild(this.properties.ui);
      },
    },

    /**
     * The title to render in the metadata section of the UI
     *
     * @type {String} title
     */
    title: {
      set(title) {
        this.nodes.title.innerHTML = Base.processText(title);
        this.toggleClass('layer-has-title', title);
      },
    },

    /**
     * The description to render in the metadata section of the UI
     *
     * @type {String} description
     */
    description: {
      set(description) {
        this.nodes.description.innerHTML = Base.processText(description);
        this.toggleClass('layer-has-description', description);
      },
    },

    /**
     * The footer to render in the metadata section of the UI
     *
     * @type {String} footer
     */
    footer: {
      set(footer) {
        this.nodes.footer.innerHTML = Base.processText(footer);
        this.toggleClass('layer-has-footer', footer);
      },
    },

    /**
     * If true, show the metadata section, else hide it.
     *
     * The presence/absence of the metadata section can also affect how a Message is sized and styled.
     *
     * @readonly
     * @type {Boolean} isShowingMetadata
     */
    isShowingMetadata: {
      get() {
        const model = this.properties.model;
        return Boolean(model.getTitle() || model.getFooter() || model.getDescription());
      },
    },

    /**
     * Typically a Message Type Display Container does not need to influence the
     * Layer.UI.handlers.message.MessageViewer border style.
     *
     * However, some of them may need this ability, so the MessageViewer will ask it,
     * and it can forward the request on to its UI if it doesn't care.
     *
     * @type {String} cardBorderStyle
     */
    cardBorderStyle: {
      noGetterFromSetter: true,
      get() {
        return this.properties.cardBorderStyle || this.properties.ui.cardBorderStyle || '';
      },
    },
  },
  methods: {

    /**
     * There is no rendering other than the rendering of metadata which can dynamically be changed
     * via message editing; Calls `onRerender` for dynamic rendering.
     *
     * @method
     */
    onRender() {
      this.onRerender();
    },

    /**
     * Render all changeable properties, hide unused DOM.
     *
     * Metadata properties aren't typically changable.  The Link Integration Service
     * adds metadata to Link Messages after they are sent. So the principle of them being editable
     * now exists and must be handled by this component.
     *
     * @method onRerender
     */
    onRerender() {
      const model = this.properties.model;

      // Update the title/description/footer properties and rendering
      this.title = model.getTitle();
      this.description = model.getDescription();
      this.footer = model.getFooter();

      if (this.ui.parentComponent === this) this.ui._setupContainerClasses();
      this.toggleClass('layer-card-no-metadata', !this.isShowingMetadata);
    },

    /**
     * For Message Types like Image that can easily resize to fill as much space as available,
     * how much space/how little space should they _really_ be using?
     *
     * TODO: This should be replaced with something that examines the available width and width rules
     * and returns a value derived from it.
     *
     * @method getPreferredMinWidth
     * @returns {Number}
     * @protected until we get this cleaned up
     */
    getPreferredMinWidth() {
      return this.isShowingMetadata ? 350 : 192;
    },

    /**
     * For Message Types like Image that can easily resize to fill as much space as available,
     * how much space/how little space should they _really_ be using?
     *
     * TODO: This should be replaced with something that examines the available width and width rules
     * and returns a value derived from it.
     *
     * @method getPreferredMaxWidth
     * @returns {Number}
     * @protected until we get this cleaned up
     */
    getPreferredMaxWidth() {
      return 350;
    },

    /**
     * For Message Types like Image that can easily resize to fill as much space as available,
     * how much space/how little space should they _really_ be using?
     *
     * TODO: This should be replaced with something that examines the available width and width rules
     * and returns a value derived from it.
     *
     * @method getPreferredMaxHeight
     * @returns {Number}
     * @protected until we get this cleaned up
     */
    getPreferredMaxHeight() {
      return 400;
    },

    /**
     * For Message Types like Image that can easily resize to fill as much space as available,
     * how much space/how little space should they _really_ be using?
     *
     * TODO: This should be replaced with something that examines the available width and width rules
     * and returns a value derived from it.
     *
     * @method getPreferredMinHeight
     * @returns {Number}
     * @protected until we get this cleaned up
     */
    getPreferredMinHeight() {
      return 192;
    },
  },
});
