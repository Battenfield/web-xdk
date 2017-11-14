/**
 * UI for a Product Message representing a Product Model
 *
 * The Product Message may also be combined with a Button Model to allow the user to perform
 * actions upon the Message. Some UIs may provide a full screen view that enables additional interactions.
 *
 * @class Layer.UI.messages.ProductView
 * @mixin Layer.UI.messages.MessageViewMixin
 * @extends Layer.UI.components.Component
 */
import { registerComponent } from '../../components/component';
import MessageViewMixin from '../message-view-mixin';
import Base from '../../base';

registerComponent('layer-product-view', {
  style: `
  layer-product-view {
    display: block;
  }
  layer-message-viewer.layer-product-view {
    cursor: pointer;
  }
  layer-product-view.layer-no-image .layer-card-top {
    display: none;
  }
  `,
  template: `
    <div layer-id='UIContainer' class='layer-card-top'>
      <img layer-id="image" />
    </div>
    <div class="layer-card-body-outer">
        <div class="layer-card-product-header">
          <div layer-id="brand" class="layer-card-product-brand"></div>
          <div layer-id="model" class="layer-card-product-model"></div>
        </div>
        <div layer-id="name" class="layer-card-product-name"></div>

        <div layer-id="price" class="layer-card-product-price"></div>
        <div layer-id="choices" class="layer-card-product-choices"></div>
        <div layer-id="description" class="layer-card-product-description"></div>
    </div>
  `,
  mixins: [MessageViewMixin],

  properties: {
    widthType: {
      value: 'full-width',
    },

    // Carousels of these things should not fill _any_ sized screen; put a max.
    preferredMaxWidth: {
      value: 500,
    },
  },
  methods: {

    /**
     * Assume that any property of the Product Model can change, and that any Model change should rerender
     * the entire Product View.
     *
     * @method onRerender
     */
    onRerender() {

      // Render the basic info fields
      this.nodes.name.innerHTML = Base.processText(this.model.name);
      this.nodes.brand.innerHTML = Base.processText(this.model.brand);
      this.nodes.price.innerHTML = Base.processText(this.model.getFormattedPrice());
      this.nodes.description.innerHTML = Base.processText(this.model.description);

      // Render the image (at some point we may want a way to see multiple images)
      // If no images, hide the image area
      this.nodes.image.src = this.model.imageUrls[0];
      this.toggleClass('layer-no-image', this.model.imageUrls.length === 0);

      const optionsParentNode = this.nodes.choices;

      // This currently only renders once, so changes to the options list will NOT render.
      // We will eventually need identify what needs to be added, what needs to be updated, etc...
      if (!optionsParentNode.firstChild) {
        this.model.options.forEach((optionsModel) => {
          optionsModel.action = { event: this.model.actionEvent, data: this.model.data || { url: this.model.url } };
          this.createElement('layer-message-viewer', {
            model: optionsModel,
            messageViewContainerTagName: false,
            cardBorderStyle: 'none',
            parentNode: this.nodes.choices,
          });
        });
      }
    },
  },
});
