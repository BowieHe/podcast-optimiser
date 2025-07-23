import { summarizeDialogue } from "./dialogue-summarizer";
import fs from "fs";

async function testDialogueSummarizer() {
	// 使用你提供的对话文件进行测试
	const filePath = "/Users/bowie/Downloads/cleared_content.txt";

	try {
		const text = fs.readFileSync(filePath, "utf-8");

		console.log("原文长度:", text.length, "字符");
		console.log("开始测试对话精简功能...");

		const result = await summarizeDialogue(text);

		console.log("\n=== 精简结果 ===");
		console.log("精简后长度:", result.length, "字符");
		console.log(
			"压缩比例:",
			Math.round((result.length / text.length) * 100) + "%"
		);
		console.log("\n精简内容预览（前500字符）:");
		console.log(result.substring(0, 500) + "...");

		// 保存结果
		const outputPath =
			"/Users/bowie/Downloads/cleared_content_summarized.txt";
		fs.writeFileSync(outputPath, result, "utf-8");
		console.log(`\n完整结果已保存到: ${outputPath}`);
	} catch (error) {
		console.error("测试失败:", error);
	}
}

testDialogueSummarizer();
