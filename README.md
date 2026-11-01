# HandleIT

Source for [handleit.online](https://handleit.online): **HandleIT Office Manager**, AI office help for lawn care and home-service businesses.

```
site/
  index.html          Office Manager homepage and pilot form
  duotext/index.html  DuoText page
  assets/             logo
```

The pilot form posts to `process_form.php`, which lives only on the server. It holds mail credentials and is never committed here.

## Deploy

Pushes to `main` that touch `site/` run `.github/workflows/deploy.yml`, which copies `site/` to the web root with rsync. It never deletes server-only files. The workflow needs the repository secret `SSH_PRIVATE_KEY`; without it, the job skips with a warning.

Nothing is built on the server.

The earlier transit-app scaffold is kept on the branch `archive/transit-presence`.
