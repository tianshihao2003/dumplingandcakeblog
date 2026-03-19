type GitHubEnv = {
	token: string;
	repo: string;
	owner: string;
	name: string;
	branch: string;
	deployHookUrl?: string;
};

export function getGitHubEnv(): GitHubEnv | null {
	const token = process.env.GITHUB_TOKEN;
	const repo = process.env.GITHUB_REPO;
	if (!token || !repo) return null;

	const [owner, name] = repo.split('/');
	if (!owner || !name) return null;

	return {
		token,
		repo,
		owner,
		name,
		branch: process.env.GITHUB_BRANCH || 'main',
		deployHookUrl: process.env.VERCEL_DEPLOY_HOOK_URL,
	};
}

function encodeRepoPath(repoPath: string) {
	return repoPath
		.split('/')
		.map((seg) => encodeURIComponent(seg))
		.join('/');
}

async function githubRequest<T>(env: GitHubEnv, path: string, init?: RequestInit): Promise<T> {
	const res = await fetch(`https://api.github.com${path}`, {
		...init,
		headers: {
			Accept: 'application/vnd.github+json',
			Authorization: `Bearer ${env.token}`,
			'X-GitHub-Api-Version': '2022-11-28',
			...(init?.headers || {}),
		},
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error(`GitHub API ${res.status}: ${text}`);
	}
	return (await res.json()) as T;
}

type ContentsResponse = {
	sha: string;
	content?: string;
	encoding?: string;
	download_url?: string | null;
	path: string;
};

export async function getRepoFile(env: GitHubEnv, repoPath: string) {
	const encoded = encodeRepoPath(repoPath);
	return githubRequest<ContentsResponse>(
		env,
		`/repos/${env.owner}/${env.name}/contents/${encoded}?ref=${encodeURIComponent(env.branch)}`,
	);
}

export async function upsertRepoFile(
	env: GitHubEnv,
	params: {
		repoPath: string;
		contentBase64: string;
		message: string;
		sha?: string;
	},
) {
	const encoded = encodeRepoPath(params.repoPath);
	return githubRequest(env, `/repos/${env.owner}/${env.name}/contents/${encoded}`, {
		method: 'PUT',
		body: JSON.stringify({
			message: params.message,
			content: params.contentBase64,
			branch: env.branch,
			...(params.sha ? { sha: params.sha } : {}),
		}),
	});
}

export async function deleteRepoFile(env: GitHubEnv, repoPath: string, sha: string, message: string) {
	const encoded = encodeRepoPath(repoPath);
	return githubRequest(env, `/repos/${env.owner}/${env.name}/contents/${encoded}`, {
		method: 'DELETE',
		body: JSON.stringify({
			message,
			sha,
			branch: env.branch,
		}),
	});
}

export async function getRepoFileRaw(env: GitHubEnv, repoPath: string): Promise<ArrayBuffer> {
	const encoded = encodeRepoPath(repoPath);
	const res = await fetch(
		`https://api.github.com/repos/${env.owner}/${env.name}/contents/${encoded}?ref=${encodeURIComponent(env.branch)}`,
		{
			headers: {
				Accept: 'application/vnd.github.raw',
				Authorization: `Bearer ${env.token}`,
				'X-GitHub-Api-Version': '2022-11-28',
			},
		},
	);

	if (!res.ok) {
		const text = await res.text();
		throw new Error(`GitHub API ${res.status}: ${text}`);
	}
	return await res.arrayBuffer();
}

export async function triggerVercelDeploy(env: GitHubEnv) {
	if (!env.deployHookUrl) return;
	await fetch(env.deployHookUrl, { method: 'POST' });
}
