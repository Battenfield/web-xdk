# Web XDK Change Log

## 1.0.0-pre2.5

* React Adapter now respects `className` and `style` properties
* Fixes typo in 1.0.0-pre2.4
* Button Message `action.event` and `action.data` are propagated to child models

## 1.0.0-pre2.4

* Error publishing 1.0.0-pre2.3; have republished as 1.0.0-pre2.4.

## 1.0.0-pre2.3

*breaking changes*

* `getMenuOptions` has been renamed to `getMenuItems` in all places it occurs

Additional Changes:

* Automated tests setup with travis + saucelabs
* Removes SystemBus from `root.js`; uses `Layer.Utils.defer` instead
* Memory leaks removed from unit tests
* Upgrade to jasmine 3.0.0
* Refactored tests and CI with Saucelabs
* WEB-1680: `messageStatusRenderer` and `dateRenderer` properties now used on initial load as well as new messages
* WEB-1685: Improves quality and size of Preview Images, and adds static properties to let developers customize preview sizing and quality
* WEB-1648: Replace `MessageTypeModel.responses` object with `MessageTypeModel.responses` a `MessageTypeResponseSummaryModel` instance (i.e. added the `MessageTypeResponseSummaryModel` class)
    * Adds `model.responses.getResponse(responseName, identityId)`
    * Adds `model.responses.getResponses(responseName, identityIds)`
* Redefines the `layer-widget-destroyed` event; it now triggers on `document.body` for each removed component; access `evt.detail.target` not `evt.target` to determine what UI Component has been removed and is about to be destroyed.
* Fixes build script that strips HTML Comments out of templates
* ReplaceableContent subproperties now accept `null` values as a way to prevent anything from being rendered in an area.
* Adds the 'layer-groups.css' theme
* Flexbox workarounds added to the CSS
* Now supports setting `model.action.event = null;` to prevent a model's action from triggering

## 1.0.0-pre2.2

* NPM repo now contains missing theme source files, and not just theme build files
* Removes redundant `messages:change` and `messageparts:change` events on loading external content

## 1.0.0-pre2.1

* Marks npm repo as public rather than private
* Restructures npm repo for more direct access to components and themes

## 1.0.0-pre2.0

### Important Changes

* The MIME Type Attribute `node-id` is no longer used in Message parts. As a result, all Message Response Integrations will need to be redeployed/updated.
* Mixin Names for customizing `<layer-message-item-sent />` `<layer-message-item-received />` and `<layer-message-item-status />` have changed:
    * `messageRowHeader` has been replaced with
        * `messageSentHeader`: Header for messages sent by the current user
        * `messageReceivedHeader`: Header for messages received by the current user
        * `messageStatusHeader`: Header for status messages
    * `messageRowFooter` has been replaced with
        * `messageSentFooter`: Footer for messages sent by the current user
        * `messageReceivedFooter`: Footer for messages received by the current user
        * `messageStatusFooter`: Header for status messages
    * `messageRowRight` has been replaced with
        * `messageSentRight`: Customize area to the right of the messages sent by the current user
        * `messageReceivedRight`: Customize area to the right of the messages received by the current user
        * `messageStatusRight`: Customize area to the right of the status messages
    * `messageRowLeft` has been replaced with
        * `messageSentLeft`: Customize area to the left of the messages sent by the current user
        * `messageReceivedLeft`: Customize area to the left of the messages received by the current user
        * `messageStatusLeft`: Customize area to the left of the status messages
    * Furthermore, Layer.UI.UIUtils.ReplacableSnippets has been added with simple strings that can be used as standard values for the above Replaceable Content fields
* API Reference is now published at https://preview-docs.layer.com/xdk/webxdk/introduction
* `<layer-status-message />` can now be configured with properties without having to completely rewrite the `onRender` method for each customization
* UI Component Lifecycle Changes:
    * `onRerender()` is *always* called after `onRender()`, any calls you make to it from `onRender()` methods are now redundant
    * Root implementations of UI Component lifecycle methods are no longer blocked via `registerComponent.MODES.OVERWRITE`
* `message.parts` is now represented as Set rather than an Array. To simplify working with the javascript Set object, `Layer.Core.Message` provides the following methods:
    * `filterParts`: Standard filter returns an array of matching parts
    * `mapParts`: Standard map returns an array from the set
    * `findPart`: Finds a single part matching the callback
    * `getRootPart`: Returns the Root Message Part (main part)
    * `getPartsMatchingAttribute`: Searches parts for one with the specified MIME Type attributes
* Response Messages now contain only a Status Message Type Model, and no longer can contain a Text Message Type Model
* Image Message sizing is tweaked
* Image Messages now use `<img />` not `<canvas />`

### Build Breaking Changes

* Using `npm` to `import` no longer imports all Message Type Models, nor all UI Components. Import only those UI Components you require (they will import their dependencies).  Example:
    * `import '@layerhq/web-xdk/ui/adapters/react';`
    * `import '@layerhq/web-xdk/ui/messages/status/layer-status-message-view';`
    * `import '@layerhq/web-xdk/ui/messages/receipt/layer-receipt-message-view';`
    * `import '@layerhq/web-xdk/ui/components/layer-avatar';`
* Using Persistence requires you to import the db-manager: `import '@layerhq/web-xdk/core/db-manager';`

### New Features and utilities

* Adds `multiple` property to FileUploadWidget
* Message Type Model now has a `getParticipantResponse()` method for extracting participant responses to a Model.
* Adds `message.createModel()` to get the Message Type Model representing the `Layer.Core.Message` instance
* Adds `part.createModel()` to get the Message Type Model representing the `Layer.Core.MessagePart` instance
* Adds `message.getRootPart()` to get the root MessagePart for the Message
* Adds `model.getParentModel()` to get the Parent Model of the current Model (or `null` if its already the root model)

### Misc Changes (some may be breaking)

* Fixes bug in rendering of a carousel of images when generated by FileUploadWidget
* `Layer.Core.Query.ConversationQuery`  renamed to `Layer.Core.Query.ConversationsQuery`
* `Layer.Core.Query.ConversationQuery` and other queries can now be explicitly accessed to modify the `MaxPageSize` static property
* Renamed ReceiptModel property  `shippingAddressModel` => `shippingAddress` and `billingAddressModel` => `billingAddress`
* Renamed:
    * `<layer-standard-display-container />` to `<layer-standard-message-view-container />`
    * `<layer-titled-display-container />` to `<layer-titled-message-view-container />`
    * All Message Types are renamed with the following pattern: `<layer-xxx-view />` to `<layer-xxx-message-view />`
    * Removed support for putting a `selectedAnswer` in the constructor for a Choice Model.  Instead use the `preselectedChoice` property.
* Registered Message Action handlers are no longer called with `<layer-message-viewer />` as context, and instead receive inputs of `({data, model, rootModel, messageViewer})` where model and rootModel represent the model the event was triggered upon and any root Message Model (Carousel for example) that contains the model.
* Triggering an action now first triggers a DOM level event with the name of the action. A call to `evt.preventDefault()` will prevent the Registered Message Action Handler from being called, and will let your event handler alone handle it.
* `layer-send-message` event now passes a Layer.Core.MessageTypeModel instead of an array of Layer.Core.MessagePart objects
* `<layer-compose-bar />` has updated its public API around creating/sending messages. Most apps should not be using this, but handy for custom widgets being embedded into the Compose Bar.
* `<layer-file-upload-button />` events have all been redefined
* `<layer-conversation-view />`
    * `onSendMessage` and `layer-send-message` event properties have changed, Message is no longer a property of this event, instead `model` is provided, and `model.message` can be used if Message access is required.
    * `autoFocusConversation` now takes Contstants rather than Strings as inputs
* `layer-composer-change-value` and `onComposerChangeValue` events are now `layer-compose-bar-change-event` and `onComposeBarChangeValue`; `evt.detail.value` is now `evt.detail.newValue`
* `deleteConversationEnabled` has been removed from `<layer-conversation-list />` and `<layer-conversation-item />`
* `<layer-conversation-list />` `sortBy` property now requires values of `Layer.UI.Constants.CONVERSATIONS_SORT.LAST_MESSAGE` or `Layer.UI.Constants.CONVERSATIONS_SORT.CREATED_AT`; prior values are no longer valid
* `<layer-identity-item />` property `selected` renamed to `isSelected`
* Choice Model now has a `selectedChoice` property (Readonly, single-select only) to get the Choice object that is currently selected
* Message Type Models no longer emit a `change` event, and now intsead emit a `message-type-model:change` event.
* Message Type Models now emit a `message-type-model:customization` event to allow for customization of behaviors
* Layer.Core.LayerEvent (i.e. any event triggered by non-UI-components) now supports
  * `evt.preventDefault()`: Can be called on any event where `evt.cancelable` is `true` to prevent a default behavior (very few uses of this at the moment)
  * `evt.returnValue()`: Can be called on any event that is providing an opportunity for you to provide an alternate value for it to use.  Currently used by some `message-type-model:customization` events
* Layer.UI.Menu `options` property is now an `items` property
* CSS Class `layer-root-card` renamed to `layer-root-viewer`
* Twemoji emojis can be disabled using `Layer.init({useEmojiImages: false})`
* List Item no longer provide an `addClass` `removeClass` and `toggleClass` method (`toggleClass` is now a part of all UI Components)
* `Layer.UI.registerMessageComponent` is removed, use `Layer.UI.registerComponent` followed by `Layer.UI.handlers.message.register` instead. Note that use of this technique is deprecated.
* `Layer.UI.registerMessageHandlers` moved to `Layer.UI.handlers.message.register`
* `Layer.UI.registerTextHandler` moved to `Layer.UI.handlers.text.register`
* `Layer.UI.isInBackground` moved to `Layer.UI.Utils.isInBackground`
* `Layer.UI.showFullScreen` moved to `Layer.UI.Utils.showFullScreen`
* `Layer.UI.createItemSeparator` moved to `Layer.UI.UIUtils.createItemSeparator`
* `Layer.UI.addAdapter` moved to `Layer.UI.adapters.register`
* `Layer.UI.registerMessageActionHandler` moved to `Layer.UI.MessageActions.register`
* `Layer.Core.Message.getText()` is removed
* `<layer-message-viewer />` `setupMessage()` method is now `_setupMessage()`
* `Layer.Util` moved to `Layer.Utils`; folder paths similarly changed.
* `Layer.UI.animatedScrollTo` and `Layer.UI.animatedScrollLeftTo` moved to `Layer.UI.UIUtils`
* Everything in `Layer.UI.utils` renamed to `Layer.UI.UIUtils`
* `Layer.UI.UIUtils.registerStatusModel(ModelClass)` is now used to register a Message as a Status Message rather than `Layer.UI.statusMimeTypes.push(mimeType)`
* `Layer.Core.MessageTypeModel` now has a `getModelsByRole` method, and no longer `getModelsForPart` and `getModelForPart` methods
* `Layer.Core.MessageTypeModel` now has a `childModels` property with all Child Models initialized automatically.
* `Layer.Core.Identity.sessionOwner` has been renamed to `Layer.Core.Identity.isMine`. Most common use of this: `message.sender.isMine` tells you if the sender of the message is the user of this client.
* `<layer-choice-button />` and `<layer-choice-message-view />` both provide `onChoiceSelect` which lets Mixins customize selection behavior

## 1.0.0-pre1.16

* Fixes handling of react adaptor on receiving empty values

## 1.0.0-pre1.15

1. Adds a Feedback Message Type
2. Adds an Expanded Message Viewer/dialog
3. Adds better test for Message Part to see if its < 2KB
4. Adds a destroy method to all UI Components that can be called to destroy a Components
5. `<layer-conversation-view />` Now has a `layer-conversation-panel-change` event
6. Adds sample app code for making app fit and titles/composer not slide out of view
7. General Cleanup

## 1.0.0-pre1.14

* Fixes bug in Message Grouping where Status Messages are treated as part of the grouping
* Adds a `filter` callback to `Layer.Core.Query` and a `queryFilter` property to the `ConversationView`:

```
render() {
  return <ConversationView
    queryFilter={(message) => return isAcceptableMessage(message)} />
}
```

## 1.0.0-pre1.13

* Adds Message Tests for all message types
* Adds `customResponseData` per choice item for the Choice Model (experimental/risky feature)

## 1.0.0-pre1.11

* Adds `Layer.UI.statusMimeTypes.push(MyCustomModel.MIMEType)` as the way to register a Message Type to be rendered as a Status Message instead of a Sent or Received Message.

## 1.0.0-pre1.10

* Adds `<layer-conversation-item-date />` added to simplify Conversation Item Date customizations

## 1.0.0-pre1.9

* Adds `enabledFor` to Choice Model
* Some refactoring of enabled detection for Choice Models
* Adds CSS class name`layer-message-item-${Message View Class Name}` to the `<layer-message-item-sent />`, `<layer-message-item-received />` and `<layer-message-item-status />` elements; `layer-message-item-layer-text-view`

## 1.0.0-pre1.8

* Adds a Status Message Type
* Adds a `Layer.UI.statusMimeTypes` array of mime types that are treated as Status Messages

## 1.0.0-pre1.7

* Test Framework
* Bug fixes
* React Sample App

## 1.0.0-pre1.6

* Fixes `nodeId` property which was missing from the prototype, and breaking attempts to set `parentNodeId`

## 1.0.0-pre1.5

* Updates React adapter's getInitialProps method to work with new class definitions
* Updates reauthentication to not reauthenticate based on no-longer-used session tokens

## 1.0.0-pre1.4

* Fixes error in static client property `QUERIED_CACHE_PURGE_INTERVAL` which should have been `CACHE_PURGE_INTERVAL`, causing new messages to be instantly destroyed

## 1.0.0-pre1.3

* Updates React adapter for React 16
* Removes old nodejs support code; runs in browser only for now

## 1.0.0-pre1.2

* Fixes package.json `main`
* Fixes folder references

## 1.0.0-pre1.1

* Prerelease of the Web XDK merges the WebSDK and Layer UI for Web into a single project and evolves the concept of Messaging Experiences beyond slapping a message onto a page.
