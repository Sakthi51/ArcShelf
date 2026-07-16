export type BookmarkNode = chrome.bookmarks.BookmarkTreeNode

function send<T>(msg: Record<string, unknown>): Promise<T> {
  return new Promise((resolve) => {
    try {
      chrome.runtime.sendMessage(msg, (response: T) => {
        if (chrome.runtime.lastError) resolve(null as T)
        else resolve(response)
      })
    } catch {
      resolve(null as T)
    }
  })
}

const api = {
  getTree: () => send<BookmarkNode[]>({ action: 'get-tree' }),
  search: (query: string) => send<BookmarkNode[]>({ action: 'search', query }),
  create: (data: { parentId: string; title: string; url?: string; index?: number }) =>
    send<BookmarkNode>({ action: 'create', data }),
  update: (id: string, changes: { title?: string; url?: string }) =>
    send<BookmarkNode>({ action: 'update', id, changes }),
  move: (id: string, destination: { parentId: string; index?: number }) =>
    send<BookmarkNode>({ action: 'move', id, destination }),
  remove: (id: string) => send<{ ok: boolean }>({ action: 'remove', id }),
  removeTree: (id: string) => send<{ ok: boolean }>({ action: 'remove-tree', id }),
}

export const storage = {
  async getLocal<T>(keys: string | string[]): Promise<Record<string, T>> {
    return chrome.storage.local.get(keys) as Promise<Record<string, T>>
  },
  async setLocal(items: Record<string, unknown>): Promise<void> {
    return chrome.storage.local.set(items)
  },
}

export const tabs = {
  async getCurrent(): Promise<{ title?: string; url?: string } | null> {
    return send<{ title?: string; url?: string } | null>({ action: 'get-current-tab' })
  },
  openUrl(url: string, newTab = false) {
    if (newTab) {
      send({ action: 'open-tab', url })
    } else {
      window.location.href = url
    }
  },
  openMultiple(urls: string[]) {
    send({ action: 'open-tabs', urls })
  },
  openInNewWindow(urls: string[]) {
    send({ action: 'open-window', urls })
  },
}

export default api
