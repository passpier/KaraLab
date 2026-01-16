import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { AppSettings } from '$lib/types';
import type { Writable } from 'svelte/store';

const defaultSettings: AppSettings = {
	darkMode: false,
	language: 'zh-TW',
	defaultVolume: 70,
	autoplay: true,
	searchFilter: 'karaoke',
	audioQuality: 128,
	recordingEnabled: true
};

interface SettingsStore extends Writable<AppSettings> {
	load: () => void;
	save: (settings: AppSettings) => void;
}

function createSettingsStore(): SettingsStore {
	const { subscribe, set, update } = writable<AppSettings>(defaultSettings);

	return {
		subscribe,
		set,
		update,
		// Load settings from localStorage
		load: () => {
			if (!browser) return;
			const stored = localStorage.getItem('karalab-settings');
			if (stored) {
				try {
					const parsed = JSON.parse(stored) as Partial<AppSettings>;
					set({ ...defaultSettings, ...parsed });
				} catch (e) {
					console.error('Failed to load settings:', e);
				}
			}
		},
		// Save settings to localStorage
		save: (settings: AppSettings) => {
			if (!browser) return;
			try {
				localStorage.setItem('karalab-settings', JSON.stringify(settings));
				set(settings);
			} catch (e) {
				console.error('Failed to save settings:', e);
			}
		}
	};
}

export const settings = createSettingsStore();

// Auto-load settings on browser
if (browser) {
	settings.load();
}
