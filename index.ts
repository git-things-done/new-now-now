import { lexer } from 'marked'
import * as github from '@actions/github'
import { getInput } from '@actions/core'
import { exit } from 'process'

const slug = process.env.GITHUB_REPOSITORY!
const [owner, repo] = slug.split('/')
const issue_number = parseInt((getInput('today') || process.env.GTD_TODAY)!)
const token = getInput('token')!
const octokit = github.getOctokit(token)
const body = getInput('body')

const comments = await octokit.rest.issues.listComments({
  owner,
  repo,
  issue_number
})

console.log(`creating new now-now: ${body}`)

let out = ''
for (const comment of comments.data) {
  if (!comment.body) continue

  //FIXME won’t work if eg. there’s a `# Right Now`
  const start = comment.body.trim()
  if (!start.startsWith('## Now Now') && !start.startsWith("## Right Now")) continue
  //FIXME ^^ not sufficient

  for (const item of lexer(comment.body)) {
    if (item.type === 'heading' && item.text == 'Just Now') {
      out = `${out.trim()}
- [ ] ${body.trim()}

`
    }
    out += item.raw
  }

  await octokit.rest.issues.updateComment({
    owner,
    repo,
    comment_id: comment.id,
    body: out
  })

  // only once thanks
  exit(0)
}

// found nothing, add a new comment
await octokit.rest.issues.createComment({
  owner,
  repo,
  issue_number,
  body: `# Now Now\n${body}`
})
