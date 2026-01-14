import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { Playlist, YouTubeVideo } from '$lib/types';
import type { Writable } from 'svelte/store';

const defaultPlaylists: Playlist[] = [];

interface PlaylistsStore extends Writable<Playlist[]> {
	load: () => void;
	save: (playlists: Playlist[]) => void;
	add: (name: string) => void;
	remove: (id: string) => void;
	addSong: (playlistId: string, video: YouTubeVideo) => void;
	removeSong: (playlistId: string, videoId: string) => void;
}

function createPlaylistsStore(): PlaylistsStore {
	const { subscribe, set, update } = writable<Playlist[]>(defaultPlaylists);

	const store: PlaylistsStore = {
		subscribe,
		set,
		update,
		// Load playlists from localStorage
		load: () => {
			if (!browser) return;
			const stored = localStorage.getItem('karalab-playlists');
			if (stored) {
				try {
					const parsed = JSON.parse(stored) as Array<Omit<Playlist, 'createdAt'> & { createdAt: string }>;
					// Convert createdAt strings back to Date objects
					const playlists: Playlist[] = parsed.map((p) => ({
						...p,
						createdAt: new Date(p.createdAt)
					}));
					set(playlists);
				} catch (e) {
					console.error('Failed to load playlists:', e);
				}
			}
		},
		// Save playlists to localStorage
		save: (playlists: Playlist[]) => {
			if (!browser) return;
			try {
				localStorage.setItem('karalab-playlists', JSON.stringify(playlists));
				set(playlists);
			} catch (e) {
				console.error('Failed to save playlists:', e);
			}
		},
		// Add a new playlist
		add: (name: string) => {
			update((playlists) => {
				const newPlaylist: Playlist = {
					id: crypto.randomUUID(),
					name,
					songs: [],
					createdAt: new Date()
				};
				const updated = [...playlists, newPlaylist];
				store.save(updated);
				return updated;
			});
		},
		// Remove a playlist
		remove: (id: string) => {
			update((playlists) => {
				const updated = playlists.filter((p) => p.id !== id);
				store.save(updated);
				return updated;
			});
		},
		// Add song to playlist
		addSong: (playlistId: string, video: YouTubeVideo) => {
			update((playlists) => {
				const updated = playlists.map((p) => {
					if (p.id === playlistId) {
						return {
							...p,
							songs: [...p.songs, video]
						};
					}
					return p;
				});
				store.save(updated);
				return updated;
			});
		},
		// Remove song from playlist
		removeSong: (playlistId: string, videoId: string) => {
			update((playlists) => {
				const updated = playlists.map((p) => {
					if (p.id === playlistId) {
						return {
							...p,
							songs: p.songs.filter((s) => s.id !== videoId)
						};
					}
					return p;
				});
				store.save(updated);
				return updated;
			});
		}
	};

	return store;
}

export const playlists = createPlaylistsStore();

// Auto-load playlists on browser
if (browser) {
	playlists.load();
}
