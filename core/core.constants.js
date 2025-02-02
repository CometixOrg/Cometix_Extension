const NODE_PREFIX = 'cometix';
const ADDON_CLASS = 'cometix';
const SHOW_CLASS = 'cometix-show';
const PINNED_CLASS = 'cometix-pinned';

const STORE = {
  TOKEN: 'cometix.token.local',
  HOVEROPEN: 'cometix.hover_open',
  PR: 'cometix.prdiff_shown',
  HOTKEYS: 'cometix.hotkeys',
  ICONS: 'cometix.icons',
  LAZYLOAD: 'cometix.lazyload',
  POPUP: 'cometix.popup_shown',
  WIDTH: 'cometix.sidebar_width',
  SHOWN: 'cometix.sidebar_shown',
  PINNED: 'cometix.sidebar_pinned',
  HUGE_REPOS: 'cometix.huge_repos'
};

const DEFAULTS = {
  TOKEN: '',
  HOVEROPEN: true,
  PR: true,
  LAZYLOAD: false,
  HOTKEYS: '⌘+⇧+s, ⌃+⇧+s',
  ICONS: true,
  POPUP: false,
  WIDTH: 232,
  SHOWN: false,
  PINNED: false,
  HUGE_REPOS: {}
};

const EVENT = {
  TOGGLE: 'cometix:toggle',
  TOGGLE_PIN: 'cometix:pin',
  LOC_CHANGE: 'cometix:location',
  LAYOUT_CHANGE: 'cometix:layout',
  REQ_START: 'cometix:start',
  REQ_END: 'cometix:end',
  STORE_CHANGE: 'cometix:storeChange',
  VIEW_READY: 'cometix:ready',
  VIEW_CLOSE: 'cometix:close',
  VIEW_SHOW: 'cometix:show',
  FETCH_ERROR: 'cometix:error',
  SIDEBAR_HTML_INSERTED: 'cometix:sidebarHtmlInserted',
  REPO_LOADED: 'cometix:repoLoaded'
};

window.STORE = STORE;
window.DEFAULTS = DEFAULTS;
window.EVENT = EVENT;
