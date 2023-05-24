export function transcriptPrompt(transcript:string) {
    return `Wrap paragraphs in html p tags. Remove all weird spacing, timestamps and rewrite the below as sentence with paragraphs.:
    ${transcript}`;
}
  
export function shortEmailPrompt(cleaned_transcript:string, sender:string, adCopy:string, from:string) {
    return `
    format email using spacing and html paragraph tags.
      Great. Now I want you to write me a short 80-100 word email going out to a list of investors.
  
      We want this email snippet to present interesting information summarized from the video. But the MAIN goal of the email is to get our readers to want to watch this video in its entirety. So we don't want to give the most exciting stuff away in the snippet. We want the email snippet to be informational, but incomplete. We should create an enticing "open loop" that can only be fulfilled by watching the actual video.
  
      So we want to make sure we TEASE the most exciting benefits of watching the video. However, for compliance reasons, we can't make specific claims around making money. Instead, we have to imply the monetary gains by presenting this information as a rare opportunity in the market.  
  
      ${cleaned_transcript}
  
      Email tone guidelines:
  
      Use casual, conversational language that resonates with the target market.
      Keep sentences short, punchy, and action-oriented.
      Use active voice and avoid passive constructions.
      Optimize each sentence for maximum emotional impact.
      Remove any fluff and focus on the core message.
      Include vivid, specific details that create a strong emotional connection.
      Ensure the tone is relatable and speaks directly to the audience's experiences and feelings.
      We want to be authoritative, but friendly.  The Email would need to come from the voice of ${sender}  
  
      Inside this email there should be a space for an advertisement ${adCopy} 
  
      There should be a P.S. on this email that will be ${from}
  `;
}

export function alternateSubjectsPrompt(short_email:string) {
    return `
    return this following in an html  ordered-list format:
    Now give me 5 alternate subject line options for this email: ${short_email}

    Keep all subject lines to 8 words or less.
    All of these subject lines need to include some combination of INTENSE CURIOSITY + BENEFIT TO READER.
    Be ultra-specific. 
    Keep the subject lines topical and time sensitive.
    Imply an urgent need.
    Focus more on teasing the specific information, instead of just telling them to watch a video.
    Be exciting and salacious. As if you're writing a tabloid magazine for investors. Clickbait is encouraged. Make it seem like an exciting narrative that we're revealing to our audience.

    Remember the compliance rules: we can't directly promise monetary gains. So we need to imply that without saying it.

    Your ONLY goal here is to get the MAXIMUM amount of email opens. So if 100 investors see this email in their inbox, 99 of them should want to open the email. Anything less is a failure.`;
}