import OpenAI from "openai";

export const getAIResponse = async (message) => {
  try {
    const openai = new OpenAI({
      apiKey: `${import.meta.env.VITE_OPENAI_API_KEY}`,
      dangerouslyAllowBrowser: true,
    });

    const prompt = message;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant designed to output JSON." },
        { role: "user", content: prompt },
      ],
    });

    console.log("chatGPT 결과: ", response.choices[0].message.content);
    return response.choices[0].message.content;
  } catch (error) {
    console.log("chatGPT: 🚨 에러가 발생했습니다.", error);
    throw error;
  }
};
