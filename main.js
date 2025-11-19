import TOML from 'https://cdn.jsdelivr.net/npm/smol-toml@1.4.2/+esm';

document.addEventListener('alpine:init', () => {
	Alpine.data('blogApp', () => ({
		posts: [],
		featuredPost: null,
		selectedCategory: 'all',
		sortOrder: 'default',
		modalOpen: false,
		selectedPost: null,
		siteName: 'MAGEZEEN',
		socialLinks: [],

		async loadData() {
			const response = await fetch('./data.toml');
			const tomlText = await response.text();
			const data = TOML.parse(tomlText);

			this.posts = data.posts;
			this.featuredPost = this.posts.find((p) => p.featured);
			this.siteName = data.site?.name || 'MAGEZEEN';
			this.socialLinks = data.social || [];
		},

		get filteredPosts() {
			let filtered = this.posts.filter((p) => !p.featured);

			if (this.selectedCategory !== 'all') {
				filtered = filtered.filter((p) => p.category === this.selectedCategory);
			}

			if (this.sortOrder === 'newest') {
				filtered = [...filtered].reverse();
			} else if (this.sortOrder === 'oldest') {
				filtered = [...filtered].sort((a, b) => a.id - b.id);
			}

			return filtered;
		},

		openModal(post) {
			this.selectedPost = post;
			this.modalOpen = true;
			document.body.style.overflow = 'hidden';
		},

		closeModal() {
			this.modalOpen = false;
			document.body.style.overflow = '';
			setTimeout(() => {
				this.selectedPost = null;
			}, 300);
		}
	}));
});
