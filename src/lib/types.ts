export interface YouTubeVideo {
	id: string;
	title: string;
	channelTitle: string;
	thumbnail: string;
	duration: string;
	publishedAt: string;
	videoType: 'karaoke' | 'vocal';
}

export interface Playlist {
	id: string;
	name: string;
	songs: YouTubeVideo[];
	createdAt: Date;
}

export interface QueueItem {
	id: string;
	video: YouTubeVideo;
	order: number;
	addedAt: Date;
}

export interface AIEvaluation {
	score: number;
	feedback: string;
	evaluatedAt: Date;
}

export interface Recording {
	id: string;
	songId: string;
	songName: string;
	audioBlob: Blob;
	url: string;
	date: Date;
	duration: number;
	aiEvaluation: AIEvaluation | null;
}

export interface AppSettings {
	darkMode: boolean;
	language: string;
	defaultVolume: number;
	autoplay: boolean;
	searchFilter: 'karaoke' | 'vocal';
	audioQuality: number;
	recordingEnabled: boolean;
}
