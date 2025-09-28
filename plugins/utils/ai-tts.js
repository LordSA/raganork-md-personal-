const axios = require("axios");
const FormData = require("form-data");

const VOICES = Object.freeze([
  "nova",
  "alloy",
  "ash",
  "coral",
  "echo",
  "fable",
  "onyx",
  "sage",
  "shimmer"
]);

function getVoice(voice) {
  if (!voice) return "coral";
  const v = voice.toLowerCase();
  return VOICES.includes(v) ? v : "coral";
}

async function aiTTS(text, voice = "coral", speed = "1.00") {
  if (!text) return { error: "No text provided" };
  const selectedVoice = getVoice(voice);
  const formData = new FormData();
  formData.append("msg", text);
  formData.append("lang", selectedVoice);
  formData.append("speed", speed);
  formData.append("source", "ttsmp3");
  try {
    const { data } = await axios.post(
      "https://ttsmp3.com/makemp3_ai.php",
      formData,
      { headers: formData.getHeaders() }
    );
    // Add this after getting the URL
if (data?.Error === 0 && data?.URL) {
  // Verify URL is accessible before returning
  try {
    await axios.head(data.URL, { timeout: 5000 });
    return { url: data.URL };
  } catch (urlError) {
    return { error: "Generated audio URL is not accessible" };
  }
}
    if (data?.Error === "Usage Limit exceeded") {
      return { error: "TTS API usage limit exceeded", response: data };
    }
    if (data?.Error === 0 && data?.URL) {
      return { url: data.URL };
    }
    return { error: "TTS generation failed", response: data };
  } catch (error) {
    return { error: error.message };
  }
}

module.exports = aiTTS;

