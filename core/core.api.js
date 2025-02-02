const GH_RESERVED_REPO_NAMES = ['followers', 'following', 'repositories'];
const GH_404_SEL = '#parallax_wrapper';
const GH_RAW_CONTENT = 'body > pre';

class cometixService {
  constructor() {
    this.reset();
  }

  // Hooks
  activate(inputs, opts) {}

  applyOptions(opts) {
    return false;
  }

  // Public
  load(loadFn) {
    loadFn();
  }

  reset() {
    this.getAccessToken = this._getAccessToken;
    this.shouldShowcometix = this._shouldShowcometix;
    this.getInvalidTokenMessage = this._getInvalidTokenMessage;
    this.setNodeIconAndText = this._setNodeIconAndText;
  }

  // Private
  _getAccessToken() {
    return window.extStore.get(window.STORE.TOKEN);
  }

  _getInvalidTokenMessage({responseStatus, requestHeaders}) {
    return (
      'The GitHub access token is invalid. ' +
      'Please go to <a class="settings-btn">Settings</a> and update the token.'
    );
  }

  async _setNodeIconAndText(context, item) {
    if (item.type === 'blob') {
      if (await extStore.get(STORE.ICONS)) {
        const className = FileIcons.getClassWithColor(item.text);
        item.icon += ' ' + (className || 'file-generic');
      } else {
        item.icon += ' file-generic';
      }
    }
  }
