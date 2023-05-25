"use client";

import { alternateSubjectsPrompt, shortEmailPrompt, transcriptPrompt } from "@/utils/generatePrompts";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ClientForm() {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");

  const [sender, setSender] = useState("");
  const [ad, setAd] = useState("")
  const [from, setFrom] = useState("")
  const [response, setResponse] = useState<String>("");
  const [counter, setCounter] = useState(0)

  const [transcriptRes, setTranscriptRes] = useState("")
  const [emailContent, setEmailContent] = useState("")
  const [alternateSubjects, setAlternateSubjects] = useState("")

  const router = useRouter()

  // const prompt = `Q: ${input} :Describe in 3 words.`;

  let prompt = transcriptPrompt(input)

  if (counter == 1) {
    prompt = shortEmailPrompt(emailContent, sender, ad, from)
  }
  if (counter == 2) {
    prompt = alternateSubjectsPrompt(emailContent)
  }

  const generateResponse = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (counter > 2) {
      window.location.reload()
    }
    e.preventDefault();
    setResponse("");
    setLoading(true);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      switch (counter) {
        case 1:
          setEmailContent((prev) => prev + chunkValue);
          break;
          
          case 2:
            setAlternateSubjects((prev) => prev + chunkValue);
            break
               
          default:
          setTranscriptRes((prev) => prev + chunkValue);
          break;
      }
    }
    setLoading(false);
    setCounter(counter + 1)
  };

  return (
    <div className="w-full max-w-xl">
      {transcriptRes && (
        <>
            <p className="font-bold ps-5">
              Transcipt Conversion
            </p>
          <div dangerouslySetInnerHTML={{ __html: transcriptRes }} className="mb-8 mt-0 rounded-xl border bg-white p-4 shadow-md transition hover:bg-gray-100" />
        </>
      )}
      {emailContent && (
        <>
            <p className="font-bold ps-5">
              Short Email Generation
            </p>
          <div dangerouslySetInnerHTML={{ __html: emailContent }} className="mb-8 mt-0 rounded-xl border bg-white p-4 shadow-md transition hover:bg-gray-100" />
        </>
      )}
      {alternateSubjects && (
        <>
          <p className="font-bold ps-5">
              5 Alternative Subject Lines
          </p>
          <div dangerouslySetInnerHTML={{ __html: alternateSubjects }} className="mb-3 mt-0 rounded-xl border bg-white p-4 shadow-md transition hover:bg-gray-100" />
        </>
      )}
      {counter == 0 && !loading && (
        <>
          <div className="mt-4 flex flex-col items-center justify-center gap-2 font-mono md:flex-row">
            <div className="bg-neuborder-neutral-900 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 dark:bg-white">
              <div className="text-xl text-neutral-50 dark:text-neutral-900">
                1
              </div>
            </div>
            <small className="font-bold text-sm">
              Paste the transcript in the box below and click the button
            </small>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
            className="focus:ring-neu w-full rounded-md border border-neutral-400
            p-4 text-neutral-900 shadow-sm placeholder:text-neutral-400 focus:border-neutral-900 mt-3"
            placeholder={"e.g. hey traders to the top flow of the day 0:03..."}
          />
        </>
      )} {counter == 1 && !loading && (
          <>
            <div className=" flex flex-col items-center justify-center gap-2 font-mono md:flex-row">
              <div className="bg-neuborder-neutral-900 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 dark:bg-white">
                <div className="text-xl text-neutral-50 dark:text-neutral-900">
                  2
                </div>
              </div>
              <small className="font-bold text-sm">
                Input required information and generate short email
              </small>
            </div>
            <input type="text" placeholder="Paste Sender name here" value={sender} onChange={(e) => setSender(e.target.value)} className="focus:ring-neu w-full rounded-md border border-neutral-400
            p-4 text-neutral-900 shadow-sm placeholder:text-neutral-400 focus:border-neutral-900 mb-2 mt-3"/>
                    <textarea
          value={ad}
          onChange={(e) => setAd(e.target.value)}
          rows={4}
          className="focus:ring-neu w-full rounded-md border border-neutral-400
          p-4 text-neutral-900 shadow-sm placeholder:text-neutral-400 focus:border-neutral-900"
          placeholder={"Paste Ad copy here"}
            />
          <input type="text" placeholder="Paste email P.S text here" value={from} onChange={(e) => setFrom(e.target.value)} className="focus:ring-neu w-full rounded-md border border-neutral-400
            p-4 text-neutral-900 shadow-sm placeholder:text-neutral-400 focus:border-neutral-900 mb-2"/>
          </>
      )}
      {!loading ? (
        <button
          className="w-full rounded-xl bg-neutral-900 px-4 py-2 font-medium text-white hover:bg-black/80"
          onClick={(e) => generateResponse(e)}
        >
          {counter == 2 && "Generate 5 Subject Lines"}
          {counter < 2 ? "Generate Response" : "Restart Generation"}
        </button>
      ) : (
        <button
          disabled
          className="w-full rounded-xl bg-neutral-900 px-4 py-2 font-medium text-white mt-4"
        >
            <div className="animate-pulse font-bold tracking-widest">
              {counter < 2 ? "..." : "Completing final taks..."}
          </div>
        </button>
      )}
    </div>
  );
}