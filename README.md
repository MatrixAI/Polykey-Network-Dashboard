# Matrix.ai

Main website for Polykey. This uses Docusaurus as a CMS.

GitLab builds this site via the CI/CD into static pages, rendering the markdown files.

The CI/CD pushes it to [polykey.com](https://polykey.com) which is hosted by Cloudflare's worker system.

## Development

Run `nix-shell`, and once you're inside, you can use:

```sh
# install (or reinstall packages from package.json)
npm install
# compile the static site
npm run build
# run the repl (this allows you to import from ./src)
npm run ts-node
# lint the source code
npm run lint
# automatically fix the source
npm run lintfix
# run the development server
npm run start
# deploy via cloudflare
npm run deploy
```

You need to do setup the `.env` from `.env.example` if you want to successfully deploy to Cloudflare.

## Contributing

Because we use docusaurus, we can choose to write in markdown, TSX or MDX.

### Blogging

Create a new markdown file in `/blog`. See the other files for formatting.

Edit the `/blog/authors.yml` if you are a new author.

### Pages

Create a new markdown file in `/pages`. See the other files for formatting.

Note that some pages were not able to be put into `/pages` due to to more complex coding. These are in the `/src`.

### HTML Syntax

Sometimes markdown syntax just doesn't cut it, and HTML syntax needs to be used.

While `docusaurus` is flexible, GitHub/GitLab is not.

GitHub/GitLab will process the markdown and then sanitizes the HTML: https://github.com/github/markup#github-markup.

There is a limited set of HTML tags are here: https://github.com/gjtorikian/html-pipeline/blob/03ae30d713199c2562951d627b98b75dc16939e4/lib/html/pipeline/sanitization_filter.rb#L40-L49

Furthermore not all attributes are kept. The `style` attribute for example is filtered out.

The most common styling attributes to be used will most likely be `align`, `width`, and `height`. See:  https://davidwells.io/snippets/how-to-align-images-in-markdown

### Linking Assets (files, images)

Markdown supports 2 ways of referencing images:

```md
![](/images/foobar.png)
<img src="/images/foobar.png" />
```

The former is markdown syntax, the latter is HTML tag.

In order to maintain portability, we always use absolute paths. This works on both GitHub/GitLab markdown rendering and also for `docusaurus`.

On GitHub/GitLab, which renders the markdown directly, the relative paths are considered relative to the location of the markdown file referencing the path. The absolute paths are considered relative to the root of the project repository. Therefore because `images` directory is located at the project root, it ends up being routable.

With `docusaurus`, the absolute paths are looked up relative to `static` directory. Inside the `static` directory we have created symlinks pointing back to `../images`. This allows `docusaurus` to also resolve these paths which will be copied into the `/build/` directory.

Note that `docusaurus` doesn't do any special rendering for HTML tags, it uses the `src` as is. While markdown references will be further processed with webpack. It is therefore preferable to use markdown syntax instead. The `docusaurus` does support a variant of the HTML tag:

```md
<img src={require('/images/foobar.png').default} />
```

However this does not work in GitHub/GitLab. So this is not recommended to use.

Therefore if you want to add inline styles to an image and still use markdown syntax so you get the benefit of `docusaurus` asset processing, the styles must be applied outside the image reference in a surrounding tag:

```md
<div align="center">

  ![](/images/foobar.png)

</div>
```

Take note of the whitespace newlines between, if no newlines are used, GitHub/GitLab will interpret this as all HTML. Also note that `<p></p>` will not work.

Note that this won't work for resizing the images unfortunately. You have to apply the `width` attribute directly to the `<img />` tag. See: https://github.com/facebook/docusaurus/discussions/6465 for more information.

## Deployment

You need to setup `.env` from `.env.example`.

Then you can build `npm run build`.

Finally run `npm run deploy`.

This will deploy the development workers first.

If you want to deploy production workers, you have to `npm run deploy -- --env production`.

### DNS

DNS is managed by cloudflare. The `wrangler.toml` specifies the usage of a custom domain for the worker that runs this static site.

The entire built `public` directory gets uploaded to cloudflare's KV system.

The custom domain is then added as a special record on the `polykey.com` zone which routes directly to the worker service.

On top of that, there is a page rule that 301 redirects `www.polykey.com/*` to `https://polykey.com/$1`.

Finally HTTPS is always on, so there's a redirection from `http` to `https` too.

Traditionally without the custom domain, you would have to use worker routes. However this only works if you also create a A record for the root with the proxy-mode turned on. The actual address doesn't matter, you can point it to a private or reserved IP, maybe even `127.0.0.1` because once the proxy is activated, the worker routes take effect.
