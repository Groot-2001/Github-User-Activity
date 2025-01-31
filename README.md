## Introduction
 a simple command line interface (CLI) to fetch the recent activity of a GitHub user and display it in the terminal. This project will help you practice your programming skills, including working with APIs, handling JSON data, and building a simple CLI application.

## Requirements
The application should run from the command line, accept the GitHub username as an argument, fetch the user’s recent activity using the GitHub API, and display it in the terminal. The user should be able to:

- Provide the GitHub username as an argument when running the CLI
- Fetch the recent activity of the specified GitHub user using the GitHub API. You can use the following endpoint to fetch the user’s activity:
- Display the fetched activity in the terminal.
- You can learn more <ins> [about the GitHub API here.](https://docs.github.com/en/rest/activity/events?apiVersion=2022-11-28) </ins>
- Handle errors gracefully, such as invalid usernames or API failures.
- Use a programming language of your choice to build this project.
- Do not use any external libraries or frameworks to fetch the GitHub activity.

## usage

1. fetching the all the activity of a github user using username.

```bash
pnpm run start:cli github-activity activity  -u "groot-2001"
```

2. get the github profile data using personal access token.

```bash
pnpm run start:cli github-activity profile -t "{YOUR_GITHUB_TOKEN}"
```

3. list all the repositories present the github for individual user.

```bash
pnpm run start:cli github-activity list-repo -u "{Github-username}"
```

4. Route to fetch GitHub issues repositories

```bash
pnpm run start:cli github-activity list-issues -u "{USER_NAME}"  -r "{REPO_NAME}" -p {PAGE_NUMBER}
```

5. convert markdown to html body.

```bash
pnpm run start:cli github-activity markdown-mode -b "Hello **world**"
```

Happy coding!
