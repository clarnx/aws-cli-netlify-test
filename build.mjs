// Trivial site build. The point of this repo is the build command, not the site.
import { mkdirSync, writeFileSync } from 'node:fs'

mkdirSync('dist', { recursive: true })

const html = `<!doctype html>
<meta charset="utf-8">
<title>AWS CLI on Netlify build image</title>
<style>
  body { font-family: system-ui, sans-serif; max-width: 42rem; margin: 4rem auto; padding: 0 1rem; line-height: 1.6 }
  code { background: #f4f4f5; padding: .15em .4em; border-radius: 4px }
</style>
<h1>Build succeeded</h1>
<p>
  This deploy ran the updated build command, which installs the AWS CLI with
  <code>mise use -g aws-cli@2.36.13</code> before calling
  <code>aws codeartifact get-authorization-token</code>.
</p>
<p>Built at ${new Date().toISOString()}</p>
`

writeFileSync('dist/index.html', html)
console.log('wrote dist/index.html')
