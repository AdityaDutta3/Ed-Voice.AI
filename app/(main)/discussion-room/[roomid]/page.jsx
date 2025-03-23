"use client";

import { api } from "@/convex/_generated/api";
import { CoachingExpert } from "@/services/options";
import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { UserButton } from "@stackframe/stack";
import { Button } from "@/components/ui/button";
import { RealtimeTranscriber } from "assemblyai";
import { AIModel, ConvertTextToSpeech, getToken } from "@/services/GlobalServices";
import { Loader2, Loader2Icon } from "lucide-react";
import ChatBox from "./_components/ChatBox";
import { UpdateConversation } from "@/convex/DiscussionRoom";

function DiscussionRoom() {
  const { roomid } = useParams();
  const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, {
    id: roomid,
  });
  const [expert, setExpert] = useState();
  const [enableMic, setEnableMic] = useState();
  const realtimeTranscriber = useRef(null);
  const recorder = useRef(null);
  const [transcribe, setTranscribe] = useState();
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [audioURL,setAudioURL] = useState()
  let silenceTimeout;
  let texts = {};
  const UpdateConversation = useMutation(api.DiscussionRoom.UpdateConversation)

  useEffect(() => {
    if (DiscussionRoomData) {
      const Expert = CoachingExpert.find(
        (item) => item.name == DiscussionRoomData.expertName
      );
      console.log(Expert);
      setExpert(Expert);
    }
  }, [DiscussionRoomData]);

  const connectToServer = async () => {
    setEnableMic(true);
    setLoading(true);

    //AssemblyAI
    realtimeTranscriber.current = new RealtimeTranscriber({
      token: await getToken(),
      sample_rate: 16_000,
    });

    realtimeTranscriber.current.on("transcript", async (transcript) => {
      let msg = "";
      if (transcript.message_type == "FinalTranscript") {
        setConversation((prev) => [
          ...prev,
          {
            role: "user",
            content: transcript.text,
          },
        ]);
        // await updateUserTokenMathod(transcript.text);
      }

      texts[transcript.audio_start] = transcript?.text;
      const keys = Object.keys(texts);
      keys.sort((a, b) => a - b);

      for (const key of keys) {
        if (texts[key]) {
          msg += `${texts[key]}`;
        }
      }

      setTranscribe(msg);
    });

    await realtimeTranscriber.current.connect();
    setLoading(false);
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      const RecordRTC = (await import("recordrtc")).default;
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          recorder.current = new RecordRTC(stream, {
            type: "audio",
            mimeType: "audio/webm;codecs=pcm",
            recorderType: RecordRTC.StereoAudioRecorder,
            timeSlice: 250,
            desiredSampRate: 16000,
            numberOfAudioChannels: 1,
            bufferSize: 4096,
            audioBitsPerSecond: 128000,
            ondataavailable: async (blob) => {
              if (!realtimeTranscriber.current) return;
              clearTimeout(silenceTimeout);
              const buffer = await blob.arrayBuffer();
              realtimeTranscriber.current.sendAudio(buffer);
              silenceTimeout = setTimeout(() => {
                console.log("User stopped talking");
              }, 2000);
            },
          });

          recorder.current.startRecording();
          setEnableMic(true);
        })
        .catch((err) => console.error(err));
    }
  };

  const disconnect = async (e) => {
    e.preventDefault();
    setLoading(true);
    await realtimeTranscriber.current.close();
    recorder.current.pauseRecording();
    recorder.current = null;
    setEnableMic(false);

    await UpdateConversation({
      id:DiscussionRoomData._id,
      conversation:conversation
    })
    setLoading(false);
  };

  useEffect(()=>{
    async function fetchData(){
      if(conversation[conversation.length-1]?.role == 'user'){
          //Calling AI Model
        const lastTwoMsg = conversation.slice(-8)
        const aiResp = await AIModel(
          DiscussionRoomData.topic,
          DiscussionRoomData.coachingOption,
          lastTwoMsg
        );

        const url = await ConvertTextToSpeech(aiResp.content,DiscussionRoomData.expertName)
        console.log(url)
        setAudioURL(url)
        setConversation((prev) => [...prev, aiResp]);
      }
    }
    fetchData()
  },[conversation])

  return (
    <div className="text-lg font-bold -mt-12">
      <h2>{DiscussionRoomData?.coachingOption}</h2>
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className=" h-[60vh] bg-secondary border rounded-4xl flex flex-col items-center justify-center relative">
            <Image
              src={expert?.avatar || "/t2.jpg"}
              alt="Avatar"
              width={200}
              height={200}
              className="h-[80px] w-[80px] rounded-full object-cover animate-pulse"
            />
            <h2 className="text-gray-500">{expert?.name}</h2>
            <audio src={audioURL} type="audio/mp3" autoPlay/>
            <div className="p-5 bg-gray-200 px-10 rounded-lg absolute bottom-10 right-10">
              <UserButton />
            </div>
          </div>
          <div className="mt-5 flex justify-center items-center">
            {!enableMic ? (
              <Button onClick={connectToServer} disabled={loading}>
                {loading && <Loader2Icon className="animate-spin" />}Connect
              </Button>
            ) : (
              <Button
                onClick={disconnect}
                variant="destructive"
                disabled={loading}
              >
                {loading && <Loader2Icon className="animate-spin" />}Disconnect
              </Button>
            )}
          </div>
        </div>
        <div>
          <ChatBox conversation={conversation} />
        </div>
      </div>
      {transcribe && (
        <div>
          <h2 className="p-4 border rounded-2xl mt-5 bg-gray-400">{transcribe.split(' ').slice(-20).join(' ')}</h2>
        </div>
      )}
    </div>
  );
}

export default DiscussionRoom;
