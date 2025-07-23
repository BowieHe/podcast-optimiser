import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY || "your-api-key-here", // 支持环境变量
	baseURL: "https://api.kksj.org/v1", //process.env.OPENAI_BASE_URL || undefined, // 支持自定义 baseURL
});

async function transcribeAudio(filePath: string): Promise<string> {
	try {
		const fileStream = fs.createReadStream(filePath);
		const transcription = await openai.audio.transcriptions.create({
			file: fileStream,
			model: "gpt-4o-mini-transcribe",
		});
		return transcription.text;
	} catch (error) {
		console.error("Error transcribing audio:", error);
		throw error;
	}
}

// 支持命令行参数
async function main() {
	const filePath = process.argv[2];
	if (!filePath) {
		console.error("请提供音频文件路径作为参数");
		process.exit(1);
	}
	try {
		const result = await transcribeAudio(filePath);
		console.log("转录结果:", result);
	} catch (err) {
		console.error("转录失败:", err);
	}
}

main();
