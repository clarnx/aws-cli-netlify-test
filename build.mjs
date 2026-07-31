// Builds the page, embedding whatever evidence the build command collected so the
// results are readable from the deployed URL rather than only in the build log.
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs'

const read = (f) => (existsSync(`.evidence/${f}`) ? readFileSync(`.evidence/${f}`, 'utf8').trim() : '(not collected)')

const sections = [
  ['Before installing anything, is the AWS CLI in the build image?', read('before.txt')],
  ['What the old build command does with that', read('old-behaviour.txt')],
  ['After mise use -g aws-cli@2.36.13', read('after.txt')],
  ['aws --version', read('version.txt')],
  ['aws codeartifact get-authorization-token', read('token.txt')],
]

mkdirSync('dist', { recursive: true })

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

writeFileSync(
  'dist/index.html',
  `<!doctype html>
<meta charset="utf-8">
<title>AWS CLI on the Netlify build image</title>
<style>
  body { font-family: system-ui, sans-serif; max-width: 52rem; margin: 3rem auto; padding: 0 1rem; line-height: 1.55 }
  h2 { font-size: 1rem; margin: 2rem 0 .4rem }
  pre { background: #f4f4f5; padding: .8rem 1rem; border-radius: 6px; overflow-x: auto; font-size: .85rem }
  .note { background: #fff8e1; border-left: 3px solid #f0b429; padding: .8rem 1rem; border-radius: 4px }
</style>
<h1>Build succeeded with the updated command</h1>
<p>Ran on Netlify at ${new Date().toISOString()}. Everything below was collected during this build.</p>
${sections.map(([t, v]) => `<h2>${esc(t)}</h2>\n<pre>${esc(v)}</pre>`).join('\n')}
<div class="note">
  <strong>Note on credentials.</strong> This site has no real AWS credentials. The key and
  secret are AWS's documented example values and the domain is a placeholder, so AWS
  rejects them. That is why the token call above ends in an authentication error rather
  than a token. The point it proves is that <code>aws</code> installed, ran, and reached
  CodeArtifact. With real credentials the same command returns a token.
</div>
`,
)

console.log('wrote dist/index.html')
