interface EvaluationResult {
	score: number;
	feedback: string;
}

/**
 * Evaluate audio recording using Gemini AI
 */
export async function evaluateRecording(
	audioBlob: Blob,
	songName: string
): Promise<EvaluationResult> {
	try {
		const formData = new FormData();
		formData.append('audio', audioBlob, 'recording.webm');
		formData.append('songName', songName);
		
		const response = await fetch('/api/gemini/evaluate', {
			method: 'POST',
			body: formData
		});
		
		if (!response.ok) {
			throw new Error(`Evaluation failed: ${response.statusText}`);
		}
		
		const result = await response.json() as EvaluationResult;
		return {
			score: result.score,
			feedback: result.feedback
		};
	} catch (error) {
		console.error('Error evaluating recording:', error);
		throw error;
	}
}
