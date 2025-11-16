import OpenAI from "openai";
import { ENV } from "../config/env";

export const openaiClient = (ENV.OPENAI_API_KEY ? new OpenAI({ apiKey: ENV.OPENAI_API_KEY }) : null);
