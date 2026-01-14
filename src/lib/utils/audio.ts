interface AudioAnalyzerResult {
	analyser: AnalyserNode;
	dataArray: Uint8Array;
}

/**
 * Initialize audio context for visualization
 */
export async function initAudioContext(): Promise<AudioContext> {
	const AudioContextClass = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext) as typeof AudioContext;
	return new AudioContextClass();
}

/**
 * Get microphone stream
 */
export async function getMicrophoneStream(): Promise<MediaStream> {
	try {
		const stream = await navigator.mediaDevices.getUserMedia({
			audio: {
				echoCancellation: true,
				noiseSuppression: true,
				autoGainControl: true
			}
		});
		return stream;
	} catch (error) {
		console.error('Error accessing microphone:', error);
		throw new Error('Microphone access denied or unavailable');
	}
}

/**
 * Create audio analyzer for visualization
 */
export function createAudioAnalyzer(
	stream: MediaStream,
	audioContext: AudioContext
): AudioAnalyzerResult {
	const source = audioContext.createMediaStreamSource(stream);
	const analyser = audioContext.createAnalyser();
	analyser.fftSize = 256;
	
	source.connect(analyser);
	
	const bufferLength = analyser.frequencyBinCount;
	const dataArray = new Uint8Array(bufferLength);
	
	return { analyser, dataArray };
}

/**
 * Create a MediaRecorder instance for recording audio
 */
export function createMediaRecorder(stream: MediaStream, maxDuration: number = 300): MediaRecorder {
	const mediaRecorder = new MediaRecorder(stream, {
		mimeType: 'audio/webm;codecs=opus'
	});
	
	// Auto-stop after max duration
	setTimeout(() => {
		if (mediaRecorder.state === 'recording') {
			mediaRecorder.stop();
		}
	}, maxDuration * 1000);
	
	return mediaRecorder;
}

/**
 * Get audio duration from blob
 */
export async function getAudioDuration(audioBlob: Blob): Promise<number> {
	return new Promise((resolve, reject) => {
		const audio = new Audio();
		const url = URL.createObjectURL(audioBlob);
		
		audio.addEventListener('loadedmetadata', () => {
			URL.revokeObjectURL(url);
			resolve(audio.duration);
		});
		
		audio.addEventListener('error', (error) => {
			URL.revokeObjectURL(url);
			reject(error);
		});
		
		audio.src = url;
	});
}
