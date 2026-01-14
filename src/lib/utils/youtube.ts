type VideoType = 'karaoke' | 'vocal';
type ThumbnailQuality = 'default' | 'medium' | 'high' | 'standard' | 'maxres';

/**
 * Detect video type based on title and description
 */
export function detectVideoType(title: string, description: string = ''): VideoType {
	const text = `${title} ${description}`.toLowerCase();
	
	// Keywords for karaoke/instrumental versions
	const karaokeKeywords = [
		'karaoke',
		'instrumental',
		'backing track',
		'backing',
		'no vocals',
		'minus one',
		'karoake',
		'カラオケ',
		'伴奏',
		'伴唱'
	];
	
	// Keywords for vocal versions
	const vocalKeywords = [
		'original',
		'with vocals',
		'full version',
		'original version',
		'原唱',
		'原版'
	];
	
	const hasKaraoke = karaokeKeywords.some(keyword => text.includes(keyword));
	const hasVocal = vocalKeywords.some(keyword => text.includes(keyword));
	
	if (hasKaraoke && !hasVocal) return 'karaoke';
	if (hasVocal) return 'vocal';
	
	// Default to karaoke if uncertain (most common use case)
	return 'karaoke';
}

/**
 * Format duration from ISO 8601 format (PT4M13S) to readable format
 */
export function formatDuration(duration: string): string {
	if (!duration) return '0:00';
	
	const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
	if (!match) return '0:00';
	
	const hours = parseInt(match[1] || '0', 10);
	const minutes = parseInt(match[2] || '0', 10);
	const seconds = parseInt(match[3] || '0', 10);
	
	if (hours > 0) {
		return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	}
	return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Get YouTube thumbnail URL
 */
export function getThumbnailUrl(videoId: string, quality: ThumbnailQuality = 'medium'): string {
	const qualityMap: Record<ThumbnailQuality, string> = {
		default: 'default',
		medium: 'mqdefault',
		high: 'hqdefault',
		standard: 'sddefault',
		maxres: 'maxresdefault'
	};
	
	return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}
