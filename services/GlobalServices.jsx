import axios from "axios";
import OpenAI from "openai"
import { CoachingOptions } from "./options";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";


export const getToken =async()=>{
    const result = await axios.get('/api/getToken')
    return result.data;
}

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.NEXT_PUBLIC_OPENROUTER,
    dangerouslyAllowBrowser:true
    })

export const AIModel=async(topic,coachingOption,lastTwoMsg)=>{

    const option = CoachingOptions.find((item) => item.name == coachingOption)
    const PROMPT = (option.prompt).replace('{user_topic}', topic)
    const completion = await openai.chat.completions.create({
        model: "google/gemini-2.0-pro-exp-02-05:free",
        messages: [
            { role: "assistant", content: PROMPT },
            ...lastTwoMsg
        ],
      })
      console.log(completion.choices[0].message)
      return completion.choices[0].message
}

export const ConvertTextToSpeech= async(text,expertName)=>{
    const pollyClient = new PollyClient({
        region: 'us-east-1',
        credentials:{
            accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY
        }

    })

    const command = new SynthesizeSpeechCommand({
        Text:text,
        OutputFormat:'mp3',
        VoiceId:expertName
    })

    try{
        const {AudioStream}= await pollyClient.send(command)

        const audioArrayBuffer  = await AudioStream.transformToByteArray();
        const audioBlob = new Blob([audioArrayBuffer],{type:'audio/mp3'})

        const audioURL = URL.createObjectURL(audioBlob);

        return audioURL;
    }catch(e){
        console.log(e)
    }
}


