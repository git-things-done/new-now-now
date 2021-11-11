# “New ‘Now Now’” for Git Things Done

This action can be controlled externally to facilitate easy creation of new “Now
Now”s.

## iOS/macOS Shortcuts

We provide shortcuts that you can “duplicate” to facilitate this.

1. [Duplicate]
2. Add to Homescreen/Dock/Menubar
3. Tap/Click to add new items to the “Now Now” list[^1]

<img width="378" alt="image" src="https://user-images.githubusercontent.com/58962/140531618-5012f544-4f25-4815-9978-f3f0e6bf80dd.png">

[Duplicate]: https://www.icloud.com/shortcuts/781d011ddf4748f78ac55d577de3bf20
[^1]: **Please note**, the shortcut will request a [Personal Access Token](https://github.com/settings/tokens) with `repo` scope.

## Desired Features

* Should be *easier* to set up (the PAT is tedious)
* Both the action and our shortcut should support choosing priority


# Setting Up

> ***NOTE*** if you forked our template you will already have this.

You need `.github/workflows/new-now-now.yml` in your [GitTD repo] containing:

```yaml
name: New “Now Now”
on:
  repository_dispatch:
    types: new-now-now
jobs:
  new-now-now:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0  #FIXME needed so we can get the CURRENT issue below
      
      - run: echo "CURRENT=$(git show origin/gh-pages:CURRENT)" >> $GITHUB_ENV
      
      - uses: git-things-done/new-now-now@v1
        with:
          today: ${{ env.CURRENT }}
          body: ${{ github.event.client_payload.body }}
```

[GitTD repo]: https://github.com/git-things-done/gtd
