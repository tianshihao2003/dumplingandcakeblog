<script lang="ts">
  import { actions } from 'astro:actions';
  import { onMount } from 'svelte';

  export let initialMoments: any[] = [];

  let moments = [...initialMoments];
	let isEditing = false;
	let editingId = '';
	let draftBackup: { content: string; images: string[]; location: string; device: string; tagsInput: string } | null = null;
  let content = '';
  let images: string[] = [];
  let location = '';
  let device = '';
  let tagsInput = '';
	let published = '';
  let isSubmitting = false;
  let uploadFiles: FileList | null = null;
  let isUploading = false;

  const DRAFT_KEY = 'moment_draft';

  // 持久化草稿
  function saveDraft() {
		if (typeof localStorage === 'undefined' || isEditing) return;
    const draft = { content, images, location, device, tagsInput };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }

  // 加载草稿
  function loadDraft() {
    if (typeof localStorage === 'undefined') return;
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        content = draft.content || '';
        images = draft.images || [];
        location = draft.location || '';
        device = draft.device || '';
        tagsInput = draft.tagsInput || '';
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
		if (!published) published = toDatetimeLocal(new Date());
  });

  // 监听变量变化并保存
	$: if (!isEditing && (content || images.length || location || device || tagsInput)) {
    saveDraft();
  }

	function resetForm() {
		isEditing = false;
		editingId = '';
		draftBackup = null;
		content = '';
		images = [];
		location = '';
		device = '';
		tagsInput = '';
		published = toDatetimeLocal(new Date());
		clearDraft();
	}

	function cancelEdit() {
		isEditing = false;
		editingId = '';
		if (draftBackup) {
			content = draftBackup.content;
			images = draftBackup.images;
			location = draftBackup.location;
			device = draftBackup.device;
			tagsInput = draftBackup.tagsInput;
			draftBackup = null;
		}
	}

  async function handleUpload() {
    if (!uploadFiles || uploadFiles.length === 0) return;
    isUploading = true;
    
    for (let i = 0; i < uploadFiles.length; i++) {
      const file = uploadFiles[i];
      const formData = new FormData();
      formData.append('file', file);
      const { data, error } = await actions.uploadMomentImage(formData);
      if (data?.success) {
        images = [...images, data.path];
        saveDraft(); // 确保上传成功后立即保存
      } else {
        alert('上传失败: ' + (error?.message || '未知错误'));
      }
    }
    isUploading = false;
    uploadFiles = null;
  }

	function toPublishedString(datetimeLocal: string) {
		if (!datetimeLocal) return undefined;
		return datetimeLocal.replace('T', ' ') + ':00';
	}

	function toDatetimeLocal(date: Date) {
		const tzOffsetMs = date.getTimezoneOffset() * 60 * 1000;
		return new Date(date.getTime() - tzOffsetMs).toISOString().slice(0, 16);
	}

	async function handleSubmit() {
    if (!content.trim()) {
      alert('请输入内容');
      return;
    }

    isSubmitting = true;
    const tags = tagsInput.split(/[,，]/).map(t => t.trim()).filter(t => t);
    
		const payload = {
			content,
			images: images.join(', '),
			tags,
			location,
			device,
			published: toPublishedString(published)
		};

		const { data, error } = isEditing
			? await actions.updateMoment({ id: editingId, ...payload })
			: await actions.addMoment(payload);

		if (data?.success) {
			alert(isEditing ? '更新成功！' : '发布成功！');
			resetForm();
			window.location.reload();
    } else {
      alert('发布失败: ' + (error?.message || '未知错误'));
    }
    isSubmitting = false;
  }

	async function handleEdit(moment: any) {
		draftBackup = { content, images, location, device, tagsInput };
		const { data, error } = await actions.getMomentContent({ id: moment.id });
		if (data?.success) {
			isEditing = true;
			editingId = moment.id;
			content = data.body || '';
			location = data.data.location || '';
			device = data.data.device || '';
			tagsInput = (data.data.tags || []).join(', ');
			const imagesRaw = data.data.images || '';
			images = typeof imagesRaw === 'string'
				? imagesRaw.split(',').map((s: string) => s.trim()).filter(Boolean)
				: [];
			const p = data.data.published ? new Date(data.data.published) : new Date();
			published = toDatetimeLocal(p);
		} else {
			alert('加载失败: ' + (error?.message || '未知错误'));
		}
	}

  async function handleDelete(id: string) {
    if (!confirm('确定要删除这条动态吗？')) return;
    
    const { data, error } = await actions.deleteMoment({ id });
    if (data?.success) {
      moments = moments.filter(m => m.id !== id);
    } else {
      alert('删除失败: ' + (error?.message || '未知错误'));
    }
  }

  function removeImage(index: number) {
    images = images.filter((_, i) => i !== index);
    saveDraft();
  }
</script>

<div class="space-y-8">
	<section class="card-base p-6 rounded-2xl">
		<div class="flex justify-between items-center mb-6">
			<h2 class="text-xl font-bold text-[var(--text-color)]">{isEditing ? '编辑动态' : '发布新动态'}</h2>
			{#if isEditing}
				<button on:click={cancelEdit} class="text-sm text-[var(--primary)] hover:underline">取消编辑</button>
			{/if}
		</div>
    <div class="space-y-4">
      <textarea 
        bind:value={content}
        placeholder="在这里输入你的心情..." 
        class="w-full h-32 p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] focus:border-[var(--primary)] outline-none transition-all text-[var(--text-color)]"
      ></textarea>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input 
          bind:value={location}
          type="text" 
          placeholder="地点 (可选)" 
          class="px-4 py-2 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-color)]"
        />
        <input 
          bind:value={device}
          type="text" 
          placeholder="设备 (可选)" 
          class="px-4 py-2 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-color)]"
        />
      </div>

			<input 
				bind:value={published}
				type="datetime-local" 
				class="w-full px-4 py-2 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-color)]"
			/>

      <input 
        bind:value={tagsInput}
        type="text" 
        placeholder="标签 (逗号分隔)" 
        class="w-full px-4 py-2 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-color)]"
      />

      <div class="space-y-2">
        <div class="flex items-center gap-4">
          <input 
            type="file" 
            multiple 
            accept="image/*"
            bind:files={uploadFiles}
            on:change={handleUpload}
            class="hidden"
            id="image-upload"
          />
          <label 
            for="image-upload" 
            class="px-4 py-2 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] font-bold cursor-pointer hover:bg-[var(--primary)]/20 transition-all"
          >
            {isUploading ? '上传中...' : '上传图片'}
          </label>
        </div>

        {#if images.length > 0}
          <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mt-2">
            {#each images as img, i}
              <div class="relative aspect-square rounded-lg overflow-hidden group">
                <img src={`/api/admin/image/?path=${encodeURIComponent(img)}`} alt="Preview" class="w-full h-full object-cover" />
                <button 
                  on:click={() => removeImage(i)}
                  class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                >
                  删除
                </button>
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <button 
        on:click={handleSubmit}
        disabled={isSubmitting || isUploading}
        class="w-full py-3 rounded-xl bg-[var(--primary)] text-white font-bold disabled:opacity-50"
      >
				{isSubmitting ? (isEditing ? '正在更新...' : '正在发布...') : (isEditing ? '更新动态' : '发布动态')}
      </button>
    </div>
  </section>

  <section class="card-base p-6 rounded-2xl">
    <h2 class="text-xl font-bold mb-6 text-[var(--text-color)]">所有动态</h2>
    <div class="divide-y divide-[var(--border-color)]">
		{#each moments as moment}
        <div class="py-4 flex justify-between items-start gap-4">
          <div class="flex-grow overflow-hidden">
            <div class="text-sm text-[var(--content-meta)] mb-1">
              {new Date(moment.data.published).toLocaleString()}
            </div>
            <p class="text-[var(--text-color)] line-clamp-2">{moment.body}</p>
            {#if moment.data.images}
              <div class="flex gap-1 mt-2">
                {#each (typeof moment.data.images === 'string' ? moment.data.images.split(',') : []) as img}
                  {#if img.trim()}
                    <div class="w-8 h-8 rounded bg-gray-100 overflow-hidden">
                      <img src={`/api/admin/image/?path=${encodeURIComponent(img.trim())}`} alt="" class="w-full h-full object-cover" />
                    </div>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>
				<div class="flex gap-2 shrink-0">
					<button 
						on:click={() => handleEdit(moment)}
						class="text-[var(--primary)] hover:bg-[var(--primary)]/5 px-3 py-1 rounded-lg border border-[var(--primary)]/20 transition-all text-sm"
					>
						编辑
					</button>
					<button 
						on:click={() => handleDelete(moment.id)}
						class="text-red-500 hover:text-red-600 px-3 py-1 rounded-lg border border-red-500/20 hover:bg-red-500/5 transition-all text-sm"
					>
						删除
					</button>
				</div>
        </div>
      {/each}
    </div>
  </section>
</div>
