<br />
<p align="center">
  <a href="https://github.com/AkashRajpurohit/easy-gif">
    <img src="https://media.tenor.com/NjbLQCvQoC8AAAAC/bongo-cat.gif" alt="Bongo cat" width="200" height="150" />
  </a>

  <h3 align="center">Easy GIF!</h3>

  <p align="center">
    <samp>Effortlessly Find and Share Gifs on the Fly!</samp>
    <br />
    <br />
    <a href="https://github.com/AkashRajpurohit/easy-gif/issues/new?template=bug_report.md">Bug report</a>
    ·
    <a href="https://github.com/AkashRajpurohit/easy-gif/issues/new?template=feature_request.md">Feature request</a>
		<br />
		<br />
		<a href="https://workers.cloudflare.com/">
    	<img alt="Deployed to Cloudflare Workers" src="https://img.shields.io/badge/Deployed%20via-Cloudflare%20Workers-%23FAAD3F" />
  	</a>
		<a href="https://tenor.com/">
    	<img alt="Powered by Tenor" src="https://img.shields.io/badge/Powered%20by-Tenor-0088cc" />
  	</a>
		<img alt="Visitors count" src="https://visitor-badge.laobi.icu/badge?page_id=@akashrajpurohit~easy-gif.visitor-badge&style=flat-square&color=0088cc" />
		<a href="https://twitter.com/akashwhocodes">
    	<img alt="follow on twitter" src="https://img.shields.io/twitter/follow/akashwhocodes.svg?style=social&label=@akashwhocodes" />
  	</a>
		<a href="https://github.com/AkashRajpurohit/easy-gif">
			<img alt="GitHub" src="https://img.shields.io/github/license/AkashRajpurohit/easy-gif" />
		</a>
  </p>
</p>

# Motivation 💪

Simple utility service which helps me save ~5 seconds for every time I want to send a GIF to communicate with someone.

> These numbers adds up pretty quickly if you are a heavy GIF user as well. 👀

It uses Tenor GIF API to fetch the relevant GIF based on text search and returns the GIF image directly as the API response (not the URL).

![Preview](preview.gif)

You can self host it easily using Cloudflare Workers, see [deployment](#deployment-%EF%B8%8F) section below for more details.

# Endpoint 🚀

- `${HOST_URL}/${my awesome text}` -> pass the text in URL format after slash.

	For example -> `https://example.com/bongo-cat`. Replace `example.com` with whatever your self hosted worker host name is.

# Deployment ☁️

Self hosting this is pretty straight forward, there are two ways.

The simplest way is to use the "Deploy with Workers" button and deploy the current version of service on your Cloudflare account.

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/AkashRajpurohit/easy-gif)

Another way is to [fork this repository](https://docs.github.com/en/get-started/quickstart/fork-a-repo) under your own Github account which will run the `deploy-to-cf` Github action workflow.

This workflow requires some environment variables so make sure add those

## Github Actions

Add these to the forked repository [github actions variables](https://docs.github.com/en/actions/learn-github-actions/variables).

- `CF_API_TOKEN` -> This is your Cloudflare API token which has permissions for Worker scripts.

	Add the API tokens from [here](https://dash.cloudflare.com/profile/api-tokens)
- `CF_ACCOUNT_ID` -> This would be your Cloudflare Account ID.

## Cloudflare Worker

- `TENOR_API_KEY` - Get your tenor API key from [here](https://tenor.com/gifapi/documentation#quickstart) and save it on the worker environment one it is created.

Once these are added, run the workflow and you should see the service being deployed on Cloudflare workers.

Take the worker URL and start sending GIFs 🎉

# Slack Bot

There is also a slack bot now which you can use to send gifs, you can add it in your slack workspace and start sending gifs using the command `/giffy <query>`.

Add the bot by clicking here

<a href="https://slack.com/oauth/v2/authorize?client_id=1018885169649.7982632532727&scope=chat:write,channels:join,commands&user_scope="><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>

# Technology Stack 💻

- Framework - [Hono](https://honojs.dev/)
- Deployment - [Cloudflare Workers](https://workers.cloudflare.com/)
- GIF Service - [Tenor](https://tenor.com/)

# Bugs or Requests 🐛

If you encounter any problems feel free to open an [issue](https://github.com/AkashRajpurohit/easy-gif/issues/new?template=bug_report.md). If you feel the project is missing a feature, please raise a [ticket](https://github.com/AkashRajpurohit/easy-gif/issues/new?template=feature_request.md) on GitHub and I'll look into it. Pull requests are also welcome.

# Where to find me? 👀

[![Website Badge](https://img.shields.io/badge/-akashrajpurohit.com-3b5998?logo=google-chrome&logoColor=white)](https://akashrajpurohit.com/)
[![Twitter Badge](https://img.shields.io/badge/-@akashwhocodes-00acee?logo=Twitter&logoColor=white)](https://twitter.com/AkashWhoCodes)
[![Linkedin Badge](https://img.shields.io/badge/-@AkashRajpurohit-0e76a8?logo=Linkedin&logoColor=white)](https://linkedin.com/in/AkashRajpurohit)
[![Instagram Badge](https://img.shields.io/badge/-@akashwho.codes-e4405f?logo=Instagram&logoColor=white)](https://instagram.com/akashwho.codes/)
[![Telegram Badge](https://img.shields.io/badge/-@AkashRajpurohit-0088cc?logo=Telegram&logoColor=white)](https://t.me/AkashRajpurohit)
