<script lang="ts">
  import { actions } from 'astro:actions';
  import { onMount } from 'svelte';

  export let initialPosts: any[] = [];

  let posts = [...initialPosts];
  let isEditing = false;
  let isCreating = false;
  let currentPostPath = '';
  
  // 表单状态
  let title = '';
  let category = '';
  let description = '';
  let image = '';
  let tagsInput = '';
  let content = '';
  let published = '';
  
  let isSubmitting = false;

  const DRAFT_KEY = 'post_draft';

  // 持久化草稿
  function saveDraft() {
    if (typeof localStorage === 'undefined' || isEditing) return;
    const draft = { title, category, description, image, tagsInput, content };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }

  // 加载草稿
  function loadDraft() {
    if (typeof localStorage === 'undefined' || isEditing) return;
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        title = draft.title || '';
        category = draft.category || '';
        description = draft.description || '';
        image = draft.image || '';
        tagsInput = draft.tagsInput || '';
        content = draft.content || '';
        
        // 如果有内容，自动打开编辑器
        if (title || content || category) {
          isCreating = true;
        }
      } catch (e) {
        console.error('Failed to load draft', e);
      }
    }
  }

  // 清除草稿
  function clearDraft() {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(DRAFT_KEY);
  }

  onMount(() => {
    loadDraft();
    if (!published) {
      published = new Date().toISOString().split('T')[0];
    }
  });

  // 监听变量变化并保存
  $: if (!isEditing && (title || category || content)) {
    saveDraft();
  }

  async function handleEdit(post: any) {
    const { data, error } = await actions.getPostContent({ path: post.id });
    if (data?.success) {
      isEditing = true;
      isCreating = false;
      currentPostPath = post.id;
      title = data.data.title;
      category = data.data.category;
      description = data.data.description || '';
      image = data.data.image || '';
      tagsInput = (data.data.tags || []).join(', ');
      content = data.body;
      published = new Date(data.data.published).toISOString().split('T')[0];
    } else {
      alert('加载失败: ' + (error?.message || '未知错误'));
    }
  }

  function resetForm() {
    isEditing = false;
    isCreating = false;
    currentPostPath = '';
    title = '';
    category = '';
    description = '';
    image = '';
    tagsInput = '';
    content = '';
    published = new Date().toISOString().split('T')[0];
  }

  async function handleSubmit() {
    if (!title || !category || !content) {
      alert('请填写标题、分类和内容');
      return;
    }

    isSubmitting = true;
    const tags = tagsInput.split(/[,，]/).map(t => t.trim()).filter(t => t);
    
    const { data, error } = await actions.savePost({
      oldPath: isEditing ? currentPostPath : undefined,
      title,
      category,
      description,
      image,
      tags,
      content,
      published
    });

    if (data?.success) {
      alert(isEditing ? '保存成功！' : '发布成功！');
      clearDraft(); // 发布成功后清除草稿
      window.location.reload();
    } else {
      alert('操作失败: ' + (error?.message || '未知错误'));
    }
    isSubmitting = false;
  }

  async function handleDelete(postPath: string) {
    if (!confirm('确定要删除这篇文章吗？')) return;
    
    const { data, error } = await actions.deletePost({ path: postPath });
    if (data?.success) {
      posts = posts.filter(p => p.id !== postPath);
    } else {
      alert('删除失败: ' + (error?.message || '未知错误'));
    }
  }
</script>

<div class="space-y-8">
  {#if isEditing || isCreating}
    <!-- 编辑/创建 区域 -->
    <section class="card-base p-6 rounded-2xl">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-[var(--text-color)]">{isEditing ? '编辑文章' : '写新文章'}</h2>
        <button on:click={resetForm} class="text-sm text-[var(--primary)] hover:underline">取消{isEditing ? '编辑' : '撰写'}</button>
      </div>
      
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            bind:value={title}
            type="text" 
            placeholder="文章标题" 
            class="px-4 py-2 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-color)] focus:border-[var(--primary)] outline-none"
          />
          <input 
            bind:value={category}
            type="text" 
            placeholder="分类 (例如: Java笔记本)" 
            class="px-4 py-2 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-color)] focus:border-[var(--primary)] outline-none"
          />
        </div>

        <input 
          bind:value={description}
          type="text" 
          placeholder="文章描述" 
          class="w-full px-4 py-2 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-color)] focus:border-[var(--primary)] outline-none"
        />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            bind:value={image}
            type="text" 
            placeholder="封面图 URL" 
            class="px-4 py-2 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-color)] focus:border-[var(--primary)] outline-none"
          />
          <input 
            bind:value={published}
            type="date" 
            class="px-4 py-2 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-color)] focus:border-[var(--primary)] outline-none"
          />
        </div>

        <input 
          bind:value={tagsInput}
          type="text" 
          placeholder="标签 (逗号分隔)" 
          class="w-full px-4 py-2 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-color)] focus:border-[var(--primary)] outline-none"
        />

        <textarea 
          bind:value={content}
          placeholder="Markdown 内容..." 
          class="w-full h-96 p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] focus:border-[var(--primary)] outline-none transition-all text-[var(--text-color)] font-mono"
        ></textarea>

        <button 
          on:click={handleSubmit}
          disabled={isSubmitting}
          class="w-full py-3 rounded-xl bg-[var(--primary)] text-white font-bold disabled:opacity-50"
        >
          {isSubmitting ? '正在保存...' : (isEditing ? '更新文章' : '发布文章')}
        </button>
      </div>
    </section>
  {/if}

  <!-- 文章列表 -->
  <section class="card-base p-6 rounded-2xl">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold text-[var(--text-color)]">所有文章</h2>
      {#if !isEditing && !isCreating}
        <button on:click={() => { isCreating = true; }} class="px-4 py-2 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] font-bold hover:bg-[var(--primary)]/20 transition-all text-sm">
          写新文章
        </button>
      {/if}
    </div>
    
    <div class="divide-y divide-[var(--border-color)]">
      {#each posts as post}
        <div class="py-4 flex justify-between items-center gap-4">
          <div class="flex-grow overflow-hidden">
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2 py-0.5 rounded bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold">
                {post.data.category}
              </span>
              <span class="text-xs text-[var(--content-meta)]">
                {new Date(post.data.published).toLocaleDateString()}
              </span>
            </div>
            <h3 class="font-bold text-[var(--text-color)] truncate">{post.data.title}</h3>
            <p class="text-sm text-[var(--content-meta)] truncate">{post.data.description || '暂无描述'}</p>
          </div>
          <div class="flex gap-2 shrink-0">
            <button 
              on:click={() => handleEdit(post)}
              class="text-[var(--primary)] hover:bg-[var(--primary)]/5 px-3 py-1 rounded-lg border border-[var(--primary)]/20 transition-all text-sm"
            >
              编辑
            </button>
            <button 
              on:click={() => handleDelete(post.id)}
              class="text-red-500 hover:bg-red-500/5 px-3 py-1 rounded-lg border border-red-500/20 transition-all text-sm"
            >
              删除
            </button>
          </div>
        </div>
      {/each}
    </div>
  </section>
</div>
