import { defineAction } from 'astro:actions';
import { z } from 'zod';
import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import {
	deleteRepoFile,
	getGitHubEnv,
	getRepoFile,
	triggerVercelDeploy,
	upsertRepoFile,
} from '@/utils/github-repo';

const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD ?? "0824").trim();
const MOMENTS_DIR = path.resolve('src/content/moments');
const MOMENTS_ASSETS_DIR = path.resolve('src/content/moments/assets');
const POSTS_DIR = path.resolve('src/content/posts');

function ensureMarkdownExt(filePath: string) {
	if (filePath.endsWith('.md') || filePath.endsWith('.mdx')) return filePath;
	return `${filePath}.md`;
}

function ensureMarkdownExtRepoPath(repoPath: string) {
	if (repoPath.endsWith('.md') || repoPath.endsWith('.mdx')) return repoPath;
	return `${repoPath}.md`;
}

function isProd() {
	return process.env.NODE_ENV === 'production';
}

function getGitHubEnvOrNull() {
	return getGitHubEnv();
}

function requireGitHubEnv() {
	const env = getGitHubEnvOrNull();
	if (!env) {
		throw new Error('GitHub 环境变量未生效：请在 Vercel 配置 GITHUB_TOKEN 与 GITHUB_REPO，并重新部署');
	}
	return env;
}

// 辅助函数：验证权限
function checkAuth(cookies: any) {
  if (cookies.get('admin_token')?.value !== 'authenticated') {
    throw new Error('Unauthorized');
  }
}

const login = defineAction({
  input: z.object({
    password: z.string(),
  }),
  handler: async ({ password }, { cookies }) => {
    if (password.trim() === ADMIN_PASSWORD) {
      cookies.set('admin_token', 'authenticated', {
        path: '/',
        httpOnly: true,
        secure: isProd(),
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
      return { success: true };
    }
    return { success: false, message: 'Invalid password' };
  },
});

const logout = defineAction({
  handler: async (_, { cookies }) => {
    cookies.delete('admin_token', { path: '/' });
    return { success: true };
  },
});

const addMoment = defineAction({
  input: z.object({
    content: z.string(),
    images: z.string().optional(),
    tags: z.array(z.string()).optional(),
    location: z.string().optional(),
    device: z.string().optional(),
    published: z.string().optional(), // YYYY-MM-DD HH:mm:ss
  }),
  handler: async (input, { cookies }) => {
    checkAuth(cookies);

    const published = input.published || new Date().toISOString().replace('T', ' ').split('.')[0];
    const filename = `${new Date().getTime()}.md`;
    const filepath = path.join(MOMENTS_DIR, filename);

    const data = {
      author: "团子和蛋糕",
      avatar: "https://re.tsh520.cn/zl/tx.webp",
      published: new Date(published),
      tags: input.tags || [],
      images: input.images || "",
      location: input.location || "",
      device: input.device || "",
    };

    const fileContent = matter.stringify(input.content, data);

		const gh = getGitHubEnvOrNull();
		if (gh) {
			const repoPath = ensureMarkdownExtRepoPath(`src/content/moments/${filename}`);
			await upsertRepoFile(gh, {
				repoPath,
				contentBase64: Buffer.from(fileContent, 'utf-8').toString('base64'),
				message: `chore(moments): add ${filename}`,
			});
			await triggerVercelDeploy(gh);
		} else if (isProd()) {
			requireGitHubEnv();
		} else {
			await fs.writeFile(filepath, fileContent, 'utf-8');
		}

    return { success: true, filename };
  },
});

const deleteMoment = defineAction({
  input: z.object({
    id: z.string(), // filename
  }),
  handler: async ({ id }, { cookies }) => {
    checkAuth(cookies);
		const gh = getGitHubEnvOrNull();
		if (gh) {
			const repoPath = ensureMarkdownExtRepoPath(`src/content/moments/${id}`);
			const existing = await getRepoFile(gh, repoPath);
			await deleteRepoFile(gh, repoPath, existing.sha, `chore(moments): delete ${id}`);
			await triggerVercelDeploy(gh);
		} else if (isProd()) {
			requireGitHubEnv();
		} else {
			const filepath = ensureMarkdownExt(path.join(MOMENTS_DIR, id));
			await fs.unlink(filepath);
		}
    return { success: true };
  },
});

const getMomentContent = defineAction({
	input: z.object({
		id: z.string(),
	}),
	handler: async ({ id }, { cookies }) => {
		checkAuth(cookies);
		let raw: string;
		const gh = getGitHubEnvOrNull();
		if (gh) {
			const repoPath = ensureMarkdownExtRepoPath(`src/content/moments/${id}`);
			const existing = await getRepoFile(gh, repoPath);
			const b64 = (existing.content || '').replace(/\n/g, '');
			raw = Buffer.from(b64, 'base64').toString('utf-8');
		} else if (isProd()) {
			requireGitHubEnv();
			throw new Error('GitHub 环境变量未生效');
		} else {
			const filepath = ensureMarkdownExt(path.join(MOMENTS_DIR, id));
			raw = await fs.readFile(filepath, 'utf-8');
		}
		const { data, content: body } = matter(raw);
		return { success: true, data, body };
	},
});

const updateMoment = defineAction({
	input: z.object({
		id: z.string(),
		content: z.string(),
		images: z.string().optional(),
		tags: z.array(z.string()).optional(),
		location: z.string().optional(),
		device: z.string().optional(),
		published: z.string().optional(),
	}),
	handler: async (input, { cookies }) => {
		checkAuth(cookies);
		let raw: string;
		let sha: string | undefined;
		const gh = getGitHubEnvOrNull();
		if (gh) {
			const repoPath = ensureMarkdownExtRepoPath(`src/content/moments/${input.id}`);
			const existing = await getRepoFile(gh, repoPath);
			sha = existing.sha;
			const b64 = (existing.content || '').replace(/\n/g, '');
			raw = Buffer.from(b64, 'base64').toString('utf-8');
		} else if (isProd()) {
			requireGitHubEnv();
			throw new Error('GitHub 环境变量未生效');
		} else {
			const filepath = ensureMarkdownExt(path.join(MOMENTS_DIR, input.id));
			raw = await fs.readFile(filepath, 'utf-8');
		}
		const { data: oldData } = matter(raw);

		const publishedRaw = input.published ?? oldData?.published ?? new Date();
		const publishedDate = publishedRaw instanceof Date ? publishedRaw : new Date(publishedRaw);

		const newData = {
			author: oldData?.author ?? "团子和蛋糕",
			avatar: oldData?.avatar ?? "https://re.tsh520.cn/zl/tx.webp",
			published: publishedDate,
			tags: input.tags || [],
			images: input.images || "",
			location: input.location || "",
			device: input.device || "",
		};

		const fileContent = matter.stringify(input.content, newData);
		if (gh) {
			const repoPath = ensureMarkdownExtRepoPath(`src/content/moments/${input.id}`);
			await upsertRepoFile(gh, {
				repoPath,
				sha,
				contentBase64: Buffer.from(fileContent, 'utf-8').toString('base64'),
				message: `chore(moments): update ${input.id}`,
			});
			await triggerVercelDeploy(gh);
		} else if (isProd()) {
			requireGitHubEnv();
		} else {
			const filepath = ensureMarkdownExt(path.join(MOMENTS_DIR, input.id));
			await fs.writeFile(filepath, fileContent, 'utf-8');
		}
		return { success: true };
	},
});

const uploadMomentImage = defineAction({
  accept: 'form',
  input: z.object({
    file: z.instanceof(File),
  }),
  handler: async ({ file }, { cookies }) => {
    checkAuth(cookies);

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;

		const gh = getGitHubEnvOrNull();
		if (gh) {
			const repoPath = `src/content/moments/assets/${filename}`;
			await upsertRepoFile(gh, {
				repoPath,
				contentBase64: buffer.toString('base64'),
				message: `chore(moments): upload ${filename}`,
			});
			await triggerVercelDeploy(gh);
		} else if (isProd()) {
			requireGitHubEnv();
		} else {
			// 确保资产目录存在
			try {
				await fs.access(MOMENTS_ASSETS_DIR);
			} catch {
				await fs.mkdir(MOMENTS_ASSETS_DIR, { recursive: true });
			}
			const filepath = path.join(MOMENTS_ASSETS_DIR, filename);
			await fs.writeFile(filepath, buffer);
		}

    return { 
      success: true, 
      path: `assets/${filename}` 
    };
  },
});

const savePost = defineAction({
  input: z.object({
    oldPath: z.string().optional(), // 用于重命名/移动
    category: z.string(),
    title: z.string(),
    content: z.string(),
    description: z.string().optional(),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
    published: z.string().optional(),
  }),
  handler: async (input, { cookies }) => {
    checkAuth(cookies);

    const categoryDir = path.join(POSTS_DIR, input.category);
    const filename = `${input.title}.md`;
    const newPath = path.join(categoryDir, filename);

    const repoNewPath = ensureMarkdownExtRepoPath(`src/content/posts/${input.category}/${filename}`);

    const data = {
      title: input.title,
      published: input.published ? new Date(input.published) : new Date(),
      description: input.description || "",
      image: input.image || "",
      tags: input.tags || [],
      category: input.category,
    };

    const fileContent = matter.stringify(input.content, data);

		const gh = getGitHubEnvOrNull();
		if (gh) {
			let sha: string | undefined;
			try {
				const existing = await getRepoFile(gh, repoNewPath);
				sha = existing.sha;
			} catch {}

			await upsertRepoFile(gh, {
				repoPath: repoNewPath,
				sha,
				contentBase64: Buffer.from(fileContent, 'utf-8').toString('base64'),
				message: `chore(posts): save ${input.category}/${filename}`,
			});

			if (input.oldPath && input.oldPath !== path.join(input.category, filename)) {
				const repoOldPath = ensureMarkdownExtRepoPath(`src/content/posts/${input.oldPath}`);
				try {
					const oldExisting = await getRepoFile(gh, repoOldPath);
					await deleteRepoFile(gh, repoOldPath, oldExisting.sha, `chore(posts): delete old ${input.oldPath}`);
				} catch {}
			}

			await triggerVercelDeploy(gh);
		} else if (isProd()) {
			requireGitHubEnv();
		} else {
			// 确保目录存在
			await fs.mkdir(categoryDir, { recursive: true });
			// 处理移动/重命名
			if (input.oldPath && input.oldPath !== path.join(input.category, filename)) {
				const fullOldPath = ensureMarkdownExt(path.join(POSTS_DIR, input.oldPath));
				try {
					await fs.access(fullOldPath);
					await fs.unlink(fullOldPath);
				} catch {}
			}
			await fs.writeFile(newPath, fileContent, 'utf-8');
		}

    return { success: true, path: path.join(input.category, filename) };
  },
});

const deletePost = defineAction({
  input: z.object({
    path: z.string(),
  }),
  handler: async ({ path: postPath }, { cookies }) => {
    checkAuth(cookies);
		const gh = getGitHubEnvOrNull();
		if (gh) {
			const repoPath = ensureMarkdownExtRepoPath(`src/content/posts/${postPath}`);
			const existing = await getRepoFile(gh, repoPath);
			await deleteRepoFile(gh, repoPath, existing.sha, `chore(posts): delete ${postPath}`);
			await triggerVercelDeploy(gh);
		} else if (isProd()) {
			requireGitHubEnv();
		} else {
			let fullPath = ensureMarkdownExt(path.join(POSTS_DIR, postPath));
			await fs.unlink(fullPath);
		}
    return { success: true };
  },
});

const getPostContent = defineAction({
  input: z.object({
    path: z.string(),
  }),
  handler: async ({ path: postPath }, { cookies }) => {
    checkAuth(cookies);
		let raw: string;
		const gh = getGitHubEnvOrNull();
		if (gh) {
			const repoPath = ensureMarkdownExtRepoPath(`src/content/posts/${postPath}`);
			const existing = await getRepoFile(gh, repoPath);
			const b64 = (existing.content || '').replace(/\n/g, '');
			raw = Buffer.from(b64, 'base64').toString('utf-8');
		} else if (isProd()) {
			requireGitHubEnv();
			throw new Error('GitHub 环境变量未生效');
		} else {
			const fullPath = ensureMarkdownExt(path.join(POSTS_DIR, postPath));
			raw = await fs.readFile(fullPath, 'utf-8');
		}

		const { data, content: body } = matter(raw);
    return { success: true, data, body };
  },
});

export const server = {
  login,
  logout,
  addMoment,
  deleteMoment,
  getMomentContent,
  updateMoment,
  uploadMomentImage,
  savePost,
  deletePost,
  getPostContent,
};
