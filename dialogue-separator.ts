import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY =
	"YOUR_GEMINI_API_KEY_HERE";
const GEMINI_BASE_URL = "https://api.ai-wave.org/gemini";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const model = genAI.getGenerativeModel(
	{ model: "gemini-2.5-pro" },
	{ baseUrl: GEMINI_BASE_URL }
);

async function separateDialogue(
	text: string,
	numberOfSpeakers: number
): Promise<string> {
	try {
		const prompt = `
请分析以下对话文本，识别其中的${numberOfSpeakers}个说话人，并将对话内容按照说话人进行分离。

要求：
1. 根据语境、语调、话题转换等线索判断说话人
2. 将结果格式化为：
   A: [说话内容]
   B: [说话内容]
   A: [说话内容]
   ...
3. 保持原文的完整性，不要遗漏内容
4. 如果有${numberOfSpeakers}个以上的说话人，请用A、B、C...标记
5. 尽量保持语句的自然分割

对话文本：
${text}
`;

		const result = await model.generateContent(prompt);

		return result.response.text();
	} catch (error) {
		console.error("Error separating dialogue:", error);
		throw error;
	}
}

// 支持命令行参数
async function main() {
	const filePath = process.argv[2];
	const numberOfSpeakers = parseInt(process.argv[3]) || 2;

	if (!filePath) {
		console.error("请提供文本文件路径作为参数");
		console.error(
			"使用方法: npx ts-node dialogue-separator.ts 文件路径 [说话人数量(默认2)]"
		);
		process.exit(1);
	}

	const fs = await import("fs");
	let text = "";
	try {
		text = fs.readFileSync(filePath, "utf-8");
	} catch (err) {
		console.error("读取文件失败:", err);
		process.exit(1);
	}

	try {
		console.log("正在分析对话，请稍候...");
		const result = await separateDialogue(text, numberOfSpeakers);
		console.log("\n=== 对话分离结果 ===");
		console.log(result);
	} catch (err) {
		console.error("分析失败:", err);
	}
}

// 如果直接运行此文件，则执行main函数
if (require.main === module) {
	main();
}

// 导出函数供其他模块使用
export { separateDialogue };
