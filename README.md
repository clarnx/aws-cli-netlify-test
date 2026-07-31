# AWS CLI on the Netlify build image

Two deploys, one commit each, showing why a CodeArtifact build fails and what fixes it.

**Deploy 1** uses the original build command. The AWS CLI is not in the Netlify build
image, so `aws` is not found. Because the token is set with
`export NPM_AWS_AUTH=$(aws ...)`, and `export` reports success even when the command
inside it fails, the build does not stop. It carries on with an empty token and fails
later at the step that needs it.

**Deploy 2** uses the updated build command. `mise use -g aws-cli@2.36.13` installs the
CLI (mise already ships in the build image with its shim directory on PATH), so `aws`
works for the rest of the build. The token is assigned first and exported second, so a
failed AWS call stops the build immediately.

## What this proves and what it does not

There are no real AWS credentials here. `NPM_AWS_KEY` and `NPM_AWS_SECRET` are AWS's
documented example values, so AWS rejects them. The domain and owner id are placeholders
too. Deploy 2 proves:

- the AWS CLI installs on real Netlify infrastructure and `aws` lands on PATH
- the build network can reach `codeartifact.us-east-1.amazonaws.com`
- the `codeartifact get-authorization-token` subcommand runs and is understood by AWS

It does not prove a token is issued, which needs credentials carrying
`codeartifact:GetAuthorizationToken` and `sts:GetServiceBearerToken`. Deploy 2 treats
"AWS rejected these credentials" as the expected outcome and fails only if `aws` is
missing or something unexpected happens.

Swapping in a real key, secret, domain and owner id makes the same command return a real
token, and `check-codeartifact.mjs` then reports the token as present.
