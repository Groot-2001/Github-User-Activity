import { Command, CommandRunner, Option } from 'nest-commander';
import axios from 'axios';
import { AppService } from './app.service';

interface MyCommandOptions {
    id?: number,
    title?: string;
    description?: string;
    status?: string,
    updatedAt: Date;
}

@Command({
    name: 'github-activity',
    description: ', accept the GitHub username as an argument, fetch the user’s recent activity using the GitHub API, and display it in the terminal.',
})
export class GithubCli extends CommandRunner {
    constructor(private appService: AppService) {
        super();
    }

    async run(passedParams: string[], options?: MyCommandOptions): Promise<void> {
        switch (passedParams[0]) {
            case 'activity':
                this.fetchActivity(options);
                break;
            case 'profile':
                this.getProfile(options);
                break;
            case 'list-repo':
                this.getRepos(options);
                break;
            case 'list-issues':
                this.getIssues(options);
                break;
            case 'markdown-mode':
                this.markDown(options)
                break;
        }
    }

    @Option({
        flags: '-u, --username [string]',
        description: 'Provide a github username',
    })
    parseUserName(val: string): string {
        return val;
    }

    @Option({
        flags: '-t, --token [string]',
        description: 'Provide a github personal access token or fined grained token for the profile access',
    })
    parseToken(val: string): string {
        return val;
    }

    @Option({
        flags: '-r, --reponame [string]',
        description: 'Provide a github repository name',
    })
    parseRepo(val: string): string {
        return val;
    }

    @Option({
        flags: '-p, --page [number]',
        description: 'Provide a per page data with number is how much data you want to fetch',
    })
    parsePage(val: number): number {
        return val;
    }

    @Option({
        flags: '-b, --body [string]',
        description: 'Provide a github markdown body',
    })
    parseBody(val: string): string {
        return val;
    }

    async fetchActivity(options) {
        try {
            const url = `https://api.github.com/users/${options.username}/events`;
            const response = await axios.get(url);
            const formattedResponse = response.data.map((event) => {
                switch (event.type) {
                    case 'PushEvent':
                        return `- Pushed ${event.payload.commits.length} commits to ${event.repo.name}`;
                    case 'IssuesEvent':
                        return `- ${event.payload.action} an issue in ${event.repo.name}`;
                    case 'WatchEvent':
                        return `- Starred ${event.repo.name}`;
                    case 'PullRequestEvent':
                        return `- ${event.payload.action} a pull request in ${event.repo.name}`;
                    case 'CreateEvent':
                        return `- Created a ${event.payload.ref_type} in ${event.repo.name}`;
                    case 'DeleteEvent':
                        return `- Deleted a ${event.payload.ref_type} in ${event.repo.name}`;
                    default:
                        return `- Performed ${event.type} in ${event.repo.name}`;
                }
            });
            console.log(formattedResponse.join('\n'))
        } catch (error) {
            if (error.response) {
                console.error(`Error: ${error.response.status} - ${error.response.data.message}`);
            } else {
                console.error('Error:', error.message);
            }
        }
    }

    async getProfile(options) {
        try {
            const url = `https://api.github.com/user`;
            const token = `${options.token}`
            const profileData = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const response = {
                username: profileData.data.login,
                name: profileData.data.name,
                bio: profileData.data.bio,
                url: profileData.data.html_url,
                company: profileData.data.company,
                repos_url: profileData.data.repos_url,
                total_repos: profileData.data.public_repos,
                email: profileData.data.email,
                followers: profileData.data.followers,
                followings: profileData.data.following,
                created: this.appService.convertToDate(profileData.data.created_at)
            }

            for (const key in response) {
                if (response.hasOwnProperty(key)) {
                    console.log(`${key}: ${response[key]}`);
                }
            }
        } catch (error) {
            if (error.response) {
                console.error(`Error: ${error.response.status} - ${error.response.data.message}`);
            } else {
                console.error('Error:', error.message);
            }
        }
    }

    async getRepos(options) {
        try {
            const url = `https://api.github.com/users/${options.username}/repos`;
            const repoData = await axios.get(url);
            const formattedResponse = repoData.data.map((e) => {
                return {
                    name: e.name,
                    url: e.html_url
                }
            });
            formattedResponse.forEach((repo, index) => {
                console.log(`${index + 1}. Name: ${repo.name}`);
                console.log(`    URL: ${repo.url}\n`)
            });
        } catch (error) {
            if (error.response) {
                console.error(`Error: ${error.response.status} - ${error.response.data.message}`);
            } else {
                console.error('Error:', error.message);
            }
        }
    }

    async getIssues(options) {
        try {
            const url = `https://api.github.com/repos/${options.username}/${options.reponame}/issues?per_page=${options.page}`;
            const IssueData = await axios.get(url);
            const formattedResponse = IssueData.data.map((e) => {
                return {
                    title: e.title,
                    url: e.html_url,
                    number: e.number,
                    repository: e.repository_url,
                    status: e.state,
                    body: e.body,
                }
            });
            formattedResponse.forEach((repo, index) => {
                console.log(`${index + 1}. Issue: ${repo.title}`);
                console.log(`   Context: ${repo.body}`);
                console.log(`   URL: ${repo.url}`);
                console.log(`   Number: ${repo.number}`);
                console.log(`   Repository: ${repo.repository}`);
                console.log(`   status: ${repo.status}\n`);
            });
        } catch (error) {
            if (error.response) {
                console.error(`Error: ${error.response.status} - ${error.response.data.message}`);
            } else {
                console.error('Error:', error.message);
            }
        }
    }

    async markDown(options) {
        try {
            const url = `https://api.github.com/markdown/raw`;
            const markDownData = await axios.post(url, options.body, {
                "headers": {
                    "Content-Type": "text/plain"
                }
            });
            console.log(markDownData.data);
        } catch (error) {
            if (error.response) {
                console.error(`Error: ${error.response.status} - ${error.response.data.message}`);
            } else {
                console.error('Error:', error.message);
            }
        }
    }
}
