

export function buildFileUrlV2(key: string) {
    const BASE_URL = process.env.EXPO_PUBLIC_IMAGE_SERVER_URL // change on prod
    return `${BASE_URL}/api/${key}`
}

export function buildFileUrl(repo: string, key: string) {
    const BASE_URL = process.env.EXPO_PUBLIC_IMAGE_SERVER_URL // change on prod
    return `${BASE_URL}/api/${repo}/${key}`
}