import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { Recording, AIEvaluation } from '$lib/types';
import type { Writable } from 'svelte/store';

const defaultRecordings: Recording[] = [];

interface RecordingsStore extends Writable<Recording[]> {
	load: () => void;
	save: (recordings: Recording[]) => void;
	add: (recording: Recording) => void;
	remove: (id: string) => void;
	updateEvaluation: (id: string, evaluation: AIEvaluation) => void;
}

function createRecordingsStore(): RecordingsStore {
	const { subscribe, set, update } = writable<Recording[]>(defaultRecordings);

	const store: RecordingsStore = {
		subscribe,
		set,
		update,
		// Load recordings from localStorage
		load: () => {
			if (!browser) return;
			const stored = localStorage.getItem('karalab-recordings');
			if (stored) {
				try {
					const parsed = JSON.parse(stored) as Array<
						Omit<Recording, 'date' | 'aiEvaluation'> & {
							date: string;
							aiEvaluation: (Omit<AIEvaluation, 'evaluatedAt'> & { evaluatedAt: string }) | null;
						}
					>;
					// Convert date strings back to Date objects
					const recordings: Recording[] = parsed.map((r) => ({
						...r,
						date: new Date(r.date),
						audioBlob: new Blob(), // Blob not stored, will be empty
						aiEvaluation: r.aiEvaluation
							? {
									...r.aiEvaluation,
									evaluatedAt: new Date(r.aiEvaluation.evaluatedAt)
								}
							: null
					}));
					set(recordings);
				} catch (e) {
					console.error('Failed to load recordings:', e);
				}
			}
		},
		// Save recordings to localStorage (without blob data)
		save: (recordings: Recording[]) => {
			if (!browser) return;
			try {
				// Don't save blob data, only metadata
				const serializable = recordings.map((r) => ({
					id: r.id,
					songId: r.songId,
					songName: r.songName,
					url: r.url,
					date: r.date.toISOString(),
					duration: r.duration,
					aiEvaluation: r.aiEvaluation
						? {
								...r.aiEvaluation,
								evaluatedAt: r.aiEvaluation.evaluatedAt.toISOString()
							}
						: null
				}));
				localStorage.setItem('karalab-recordings', JSON.stringify(serializable));
				set(recordings);
			} catch (e) {
				console.error('Failed to save recordings:', e);
			}
		},
		// Add a new recording
		add: (recording: Recording) => {
			update((recordings) => {
				const updated = [...recordings, recording];
				store.save(updated);
				return updated;
			});
		},
		// Remove a recording
		remove: (id: string) => {
			update((recordings) => {
				const recording = recordings.find((r) => r.id === id);
				if (recording && recording.url) {
					// Revoke object URL to free memory
					URL.revokeObjectURL(recording.url);
				}
				const updated = recordings.filter((r) => r.id !== id);
				store.save(updated);
				return updated;
			});
		},
		// Update AI evaluation for a recording
		updateEvaluation: (id: string, evaluation: AIEvaluation) => {
			update((recordings) => {
				const updated = recordings.map((r) => {
					if (r.id === id) {
						return {
							...r,
							aiEvaluation: {
								...evaluation,
								evaluatedAt: new Date(evaluation.evaluatedAt)
							}
						};
					}
					return r;
				});
				store.save(updated);
				return updated;
			});
		}
	};

	return store;
}

export const recordings = createRecordingsStore();

// Auto-load recordings on browser
if (browser) {
	recordings.load();
}
