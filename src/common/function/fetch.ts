
export default function (url: string, options: RequestInit = {}) {
  return new Promise(function (resolve, reject) {
    const request = new XMLHttpRequest()
    const keys = []
    const all = []
    const headers = {}

    const response = () => ({
      ok: (request.status / 100 | 0) == 2,		// 200-299
      statusText: request.statusText,
      status: request.status,
      url: request.responseURL,
      text: () => Promise.resolve(request.responseText),
      json: () => Promise.resolve(JSON.parse(request.responseText)),
      blob: () => Promise.resolve(new Blob([request.response])),
      clone: response,
      headers: {
        keys: () => keys,
        entries: () => all,
        get: (n: string) => headers[n.toLowerCase()],
        has: (n: string) => n.toLowerCase() in headers
      }
    })

    request.open(options.method || 'get', url, true)

    request.onload = () => {
      request
      .getAllResponseHeaders()
      .replace(
        /^(.*?):[^\S\n]*([\s\S]*?)$/gm,
        function (match, key, value) {
          keys.push(key = key.toLowerCase())
          all.push([key, value])
          headers[key] = headers[key] ? `${headers[key]},${value}` : value
          return match
        }
      )
      resolve(response())
    }

    request.onerror = reject

    request.withCredentials = options.credentials == 'include'

    for (const i in options.headers) {
      request.setRequestHeader(i, options.headers[i])
    }

    request.send(options.body || null)
  })
}