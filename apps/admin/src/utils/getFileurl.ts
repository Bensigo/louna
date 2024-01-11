

export function buildFileUrl(repo: string, key: string) {
    const BASE_URL = 'http://localhost:6060' // change on prod
    return `${BASE_URL}/api/${repo}/${key}`
}