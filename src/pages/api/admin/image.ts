import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';

import { fileURLToPath } from 'node:url';
import { getGitHubEnv, getRepoFileRaw } from '@/utils/github-repo';

export const prerender = false;

export const GET: APIRoute = async ({ request, cookies }) => {
  if (cookies.get('admin_token')?.value !== 'authenticated') {
    return new Response('Unauthorized', { status: 401 });
  }

  const url = new URL(request.url);
  const imgPath = url.searchParams.get('path');
  
  if (!imgPath) {
    return new Response('Missing path', { status: 400 });
  }

  // 如果是远程图片，直接重定向
  if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
    return new Response(null, {
      status: 302,
      headers: {
        'Location': imgPath
      }
    });
  }

	const gh = getGitHubEnv();
	if (gh) {
		try {
			const repoPath = `src/content/moments/${imgPath}`;
			const buffer = await getRepoFileRaw(gh, repoPath);
			const ext = path.extname(imgPath).toLowerCase();
			const mimeTypes: Record<string, string> = {
				'.jpg': 'image/jpeg',
				'.jpeg': 'image/jpeg',
				'.png': 'image/png',
				'.gif': 'image/gif',
				'.webp': 'image/webp',
				'.avif': 'image/avif',
			};
			return new Response(buffer, {
				headers: {
					'Content-Type': mimeTypes[ext] || 'application/octet-stream',
					'Cache-Control': 'private, max-age=3600',
				},
			});
		} catch (err) {
			return new Response('Not Found', { status: 404 });
		}
	}

  // 获取项目根目录，基于当前文件的绝对路径
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  // 从 src/pages/api/admin/image.ts 回退到项目根目录
  const projectRoot = path.resolve(__dirname, '../../../../');
  const momentsDir = path.join(projectRoot, 'src', 'content', 'moments');
  const fullPath = path.join(momentsDir, imgPath);
  
  // 安全检查：确保路径在 moments 目录下
  const normalizedPath = path.normalize(fullPath);
  const normalizedMomentsDir = path.normalize(momentsDir);
  
  if (!normalizedPath.toLowerCase().startsWith(normalizedMomentsDir.toLowerCase())) {
    return new Response('Forbidden', { status: 403 });
  }

  try {
    const buffer = await fs.readFile(normalizedPath);
    const ext = path.extname(normalizedPath).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.avif': 'image/avif',
    };
    
    return new Response(buffer, {
      headers: {
        'Content-Type': mimeTypes[ext] || 'application/octet-stream',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err) {
    return new Response(`Not Found: ${fullPath}`, { status: 404 });
  }
};
