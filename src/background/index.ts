async function sendToActiveTab(message: object) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (tab?.id) {
    chrome.tabs.sendMessage(tab.id, message).catch(() => {})
  }
}

chrome.action.onClicked.addListener(() => {
  sendToActiveTab({ action: 'toggle-sidebar' })
})

chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-sidebar') {
    sendToActiveTab({ action: 'toggle-sidebar' })
  }
  if (command === 'add-bookmark') {
    sendToActiveTab({ action: 'show-sidebar' })
  }
})

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (!msg || !msg.action) return false

  switch (msg.action) {
    case 'get-tree':
      chrome.bookmarks.getTree().then(sendResponse).catch(() => sendResponse(null))
      return true

    case 'search':
      chrome.bookmarks.search(msg.query).then(sendResponse).catch(() => sendResponse([]))
      return true

    case 'create':
      chrome.bookmarks.create(msg.data).then(sendResponse).catch(() => sendResponse(null))
      return true

    case 'update':
      chrome.bookmarks.update(msg.id, msg.changes).then(sendResponse).catch(() => sendResponse(null))
      return true

    case 'move':
      chrome.bookmarks.move(msg.id, msg.destination).then(sendResponse).catch(() => sendResponse(null))
      return true

    case 'remove':
      chrome.bookmarks.remove(msg.id).then(() => sendResponse({ ok: true })).catch(() => sendResponse({ ok: false }))
      return true

    case 'remove-tree':
      chrome.bookmarks.removeTree(msg.id).then(() => sendResponse({ ok: true })).catch(() => sendResponse({ ok: false }))
      return true

    case 'get-current-tab':
      chrome.tabs.query({ active: true, currentWindow: true }).then(tabs => {
        sendResponse(tabs[0] ? { title: tabs[0].title, url: tabs[0].url } : null)
      }).catch(() => sendResponse(null))
      return true

    case 'open-tab':
      chrome.tabs.create({ url: msg.url }).then(() => sendResponse({ ok: true })).catch(() => sendResponse({ ok: false }))
      return true

    case 'open-tabs':
      Promise.all((msg.urls as string[]).map(url => chrome.tabs.create({ url })))
        .then(() => sendResponse({ ok: true }))
        .catch(() => sendResponse({ ok: false }))
      return true

    case 'open-window':
      chrome.windows.create({ url: msg.urls }).then(() => sendResponse({ ok: true })).catch(() => sendResponse({ ok: false }))
      return true

    case 'get-bar-state':
      chrome.storage.local.get('sidebarVisible').then(r => {
        sendResponse({ visible: r.sidebarVisible !== false })
      }).catch(() => sendResponse({ visible: true }))
      return true
  }

  return false
})

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'bookmark-page',
    title: 'Bookmark this page',
    contexts: ['page'],
  })
})

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab?.id) return
  if (info.menuItemId === 'bookmark-page') {
    await chrome.bookmarks.create({
      parentId: '1',
      title: tab.title ?? 'Untitled',
      url: tab.url,
    })
  }
})
