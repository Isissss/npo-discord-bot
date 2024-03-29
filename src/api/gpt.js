//gpt api with a prompt

import axios from 'axios';
import dotenv from 'dotenv';
import OpenAI from "openai";
import fs from "fs";


dotenv.config();


const openai = new OpenAI({apiKey: `${process.env.GPT_API_KEY}`});

export async function gpt() {
    const completion = await openai.chat.completions.create(
        {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant."
                },
                {
                    role: "user",
                    content: 'Geef mij een vraag van de dag. Graag over actueel nieuws of onderwerpen die actueel en aantrekkelijk voor jongeren zijn. Stuur hierbij ook het antwoord. Zorg ervoor dat de vraag en het antwoord niet te lang zijn en interessant voor jongeren. Stuur de response als json object terug.'
                }
            ]
        }

    )
const data = JSON.parse(completion.choices[0].message.content)

    return data;
    
      
}


//gpt api with a prompt

