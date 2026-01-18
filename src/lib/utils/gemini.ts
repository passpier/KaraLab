interface EvaluationResult {
	score: number;
	feedback: string;
}

/**
 * Local-only evaluation placeholder (no uploads).
 */
export async function evaluateRecording(
	audioBlob: Blob,
	songName: string
): Promise<EvaluationResult> {
	void audioBlob;
	const templates = [
		`不錯的表現！${songName} 的節奏掌握得很好，建議再注意咬字清晰度。`,
		`${songName} 的情感表達很到位，可以嘗試在副歌提高音量層次。`,
		`音準整體穩定，但在高音段有些偏移，建議放慢練習高音。`,
		`節拍感不錯，若能再放鬆氣息控制，整體會更自然。`,
		`旋律掌握良好，試著加強尾音收束，會更有質感。`
	];

	const randomIndex = Math.floor(Math.random() * templates.length);
	const randomScore = Math.floor(70 + Math.random() * 26);

	return {
		score: randomScore,
		feedback: templates[randomIndex]
	};
}
