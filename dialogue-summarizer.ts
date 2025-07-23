import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const GEMINI_API_KEY =
	"YOUR_GEMINI_API_KEY_HERE";
const GEMINI_BASE_URL = "https://api.ai-wave.org/gemini";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function summarizeDialogue(text: string): Promise<string> {
	try {
		const requestOptions = { baseUrl: GEMINI_BASE_URL };

		const model = genAI.getGenerativeModel(
			{ model: "gemini-2.5-pro" }, // 使用稳定的模型
			requestOptions
		);

		const prompt = `
请对以下对话内容进行润色和优化，要求如下：

1. 保持原有的对话格式（A: xxx, B: xxx）。
2. 对重复提及的例子可以稍作概括，但不要删除。
3. 允许调整语序以提升表达的流畅性，但需确保内容和原意保持一致。
4. 去除冗余信息、重复表达和口语化的填充词。
5. 确保每个说话人的语言风格和逻辑脉络完整保留。
6. 确保对话的连贯性和完整性。
7. 在合适的地方加入语气词或停顿符号（如“嗯”、“啊”、“哦”或“...”），让对话更自然、更像真实对话。
8. 内容应适合用于后续的TTS模型生成音频。

对话内容：
${text}

请返回润色和优化后的对话内容：
`;

		const result = await model.generateContent(prompt);
		const response = result.response;
		return response.text() || "润色失败";
	} catch (error) {
		console.error("Error summarizing dialogue:", error);
		throw error;
	}
}

// 支持命令行参数
async function main() {
	const filePath = process.argv[2];

	if (!filePath) {
		console.error("请提供对话文件路径作为参数");
		console.error("使用方法: npx ts-node dialogue-summarizer.ts 文件路径");
		console.error(
			"例如: npx ts-node dialogue-summarizer.ts cleared_content.txt"
		);
		process.exit(1);
	}

	let text = "";
	try {
		text = fs.readFileSync(filePath, "utf-8");
	} catch (err) {
		console.error("读取文件失败:", err);
		process.exit(1);
	}

	try {
		console.log("正在润色和优化对话，请稍候...");

		const result = await summarizeDialogue(text);

		console.log("\n=== 润色和优化后的对话内容 ===");
		console.log(result);

		// 可选：保存到文件
		const outputPath = filePath.replace(/\.(txt|ini)$/, "_optimized.txt");
		fs.writeFileSync(outputPath, result, "utf-8");
		console.log(`\n润色结果已保存到: ${outputPath}`);
	} catch (err) {
		console.error("润色失败:", err);
	}
}

// 如果直接运行此文件，则执行main函数
if (require.main === module) {
	main();
}

// 导出函数供其他模块使用
export { summarizeDialogue };
