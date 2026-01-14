import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { QueueItem, YouTubeVideo } from '$lib/types';
import type { Writable } from 'svelte/store';

const defaultQueue: QueueItem[] = [];

interface QueueStore extends Writable<QueueItem[]> {
	load: () => void;
	save: (queue: QueueItem[]) => void;
	add: (video: YouTubeVideo) => void;
	remove: (id: string) => void;
	clear: () => void;
	moveUp: (id: string) => void;
	moveDown: (id: string) => void;
	reorder: (fromIndex: number, toIndex: number) => void;
	next: () => QueueItem | null;
}

function createQueueStore(): QueueStore {
	const { subscribe, set, update } = writable<QueueItem[]>(defaultQueue);

	const store: QueueStore = {
		subscribe,
		set,
		update,
		// Load queue from localStorage
		load: () => {
			if (!browser) return;
			const stored = localStorage.getItem('karalab-queue');
			if (stored) {
				try {
					const parsed = JSON.parse(stored) as Array<Omit<QueueItem, 'addedAt'> & { addedAt: string }>;
					// Convert addedAt strings back to Date objects
					const queue: QueueItem[] = parsed.map((q) => ({
						...q,
						addedAt: new Date(q.addedAt)
					}));
					set(queue);
				} catch (e) {
					console.error('Failed to load queue:', e);
				}
			}
		},
		// Save queue to localStorage
		save: (queue: QueueItem[]) => {
			if (!browser) return;
			try {
				localStorage.setItem('karalab-queue', JSON.stringify(queue));
				set(queue);
			} catch (e) {
				console.error('Failed to save queue:', e);
			}
		},
		// Add video to queue
		add: (video: YouTubeVideo) => {
			update((queue) => {
				const newItem: QueueItem = {
					id: crypto.randomUUID(),
					video,
					order: queue.length,
					addedAt: new Date()
				};
				const updated = [...queue, newItem];
				store.save(updated);
				return updated;
			});
		},
		// Remove item from queue
		remove: (id: string) => {
			update((queue) => {
				const updated = queue.filter((q) => q.id !== id);
				// Reorder remaining items
				const reordered = updated.map((q, index) => ({
					...q,
					order: index
				}));
				store.save(reordered);
				return reordered;
			});
		},
		// Clear queue
		clear: () => {
			store.save([]);
			set([]);
		},
		// Move item up in queue
		moveUp: (id: string) => {
			update((queue) => {
				const index = queue.findIndex((q) => q.id === id);
				if (index <= 0) return queue;
				const updated = [...queue];
				[updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
				const reordered = updated.map((q, i) => ({ ...q, order: i }));
				store.save(reordered);
				return reordered;
			});
		},
		// Move item down in queue
		moveDown: (id: string) => {
			update((queue) => {
				const index = queue.findIndex((q) => q.id === id);
				if (index < 0 || index >= queue.length - 1) return queue;
				const updated = [...queue];
				[updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
				const reordered = updated.map((q, i) => ({ ...q, order: i }));
				store.save(reordered);
				return reordered;
			});
		},
		// Reorder items by dragging
		reorder: (fromIndex: number, toIndex: number) => {
			update((queue) => {
				if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= queue.length || toIndex >= queue.length) {
					return queue;
				}
				const updated = [...queue];
				const [movedItem] = updated.splice(fromIndex, 1);
				updated.splice(toIndex, 0, movedItem);
				const reordered = updated.map((q, i) => ({ ...q, order: i }));
				store.save(reordered);
				return reordered;
			});
		},
		// Get next item and remove it
		next: (): QueueItem | null => {
			let nextItem: QueueItem | null = null;
			update((queue) => {
				if (queue.length === 0) return queue;
				nextItem = queue[0];
				const updated = queue.slice(1).map((q, i) => ({ ...q, order: i }));
				store.save(updated);
				return updated;
			});
			return nextItem;
		}
	};

	return store;
}

export const queue = createQueueStore();

// Auto-load queue on browser
if (browser) {
	queue.load();
}
