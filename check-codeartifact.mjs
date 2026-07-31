// Stands in for the `pnpm install` step that pulls private packages from CodeArtifact.
// pnpm reads the token out of .npmrc and sends it as a bearer token, so an empty token
// gets a 401. This script fails the same way, without needing a real registry.
const token = process.env.NPM_AWS_AUTH ?? ''

console.log(`NPM_AWS_AUTH length: ${token.length}${token.length === 0 ? '  <-- EMPTY' : ''}`)

if (token.length === 0) {
  console.error('')
  console.error('Installing private packages would now send an empty bearer token and get')
  console.error('back "ERR_PNPM_FETCH_401 ... Unauthorized - 401", which is exactly what the')
  console.error('original build failed with, about two minutes after the real problem.')
  process.exit(1)
}

console.log('Token present, private package install would proceed.')
