export const BOOKMARKS_BAR_ID = '1'
export const OTHER_BOOKMARKS_ID = '2'
export const MOBILE_BOOKMARKS_ID = '3'

export const SIDEBAR_WIDTH_MIN = 200
export const SIDEBAR_WIDTH_MAX = 400
export const SIDEBAR_WIDTH_DEFAULT = 260

export const ITEM_HEIGHT = 36
export const FOLDER_INDENT = 12
export const VIRTUAL_OVERSCAN = 5

export const SEARCH_DEBOUNCE_MS = 150
export const SEARCH_MAX_RESULTS = 100
export const RECENT_SEARCHES_MAX = 10

export const UNDO_STACK_MAX = 20
export const UNDO_EXPIRY_MS = 5 * 60 * 1000

export const DND_FOLDER_EXPAND_DELAY = 500
export const DND_AUTO_SCROLL_THRESHOLD = 40

export const TOAST_DURATION_MS = 5000

export function getFaviconUrl(url: string): string {
  try {
    const { origin } = new URL(url)
    return `${origin}/favicon.ico`
  } catch {
    return ''
  }
}
