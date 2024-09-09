import { z } from "zod";
import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod";

import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// question structure
const Question = z.object({
  question_text: z.string(),
  question_category: z.string(),
});

// zod API response: array of categories
const QuestionResponse = z.object({
  questions: z.array(Question),
});

// env API key
const client = new OpenAI({
  apiKey: "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",
});

const generatePrompt = (document: string, customPrompt: string | null) => `
You are an experienced professor tasked with generating viva questions based on a student's document. Your goal is to assess the student's understanding of the material, their ability to discuss the concepts, and their capacity to expand on the ideas presented. Your task is to generate five viva questions that will effectively evaluate the student's knowledge and critical thinking skills. These questions should:

1. Test the student's familiarity with the written text
2. Assess their ability to discuss the concepts in depth
3. Challenge them to expand on the ideas presented 

When formulating your questions, consider the following criteria:
- Relevance: Ensure questions directly relate to key concepts in the document
- Coverage: Address all significant topics discussed
- Depth: Require thorough understanding rather than surface-level knowledge
- Clarity: Prompt clear and concise articulation of ideas
- Open-ended nature: Encourage detailed explanations
- Analytical thinking: Require analysis, comparison, or critique of concepts
- Creativity: Push students to apply concepts to new scenarios or generate new ideas

Examples of good questions:
1. "How does [concept from the document] relate to [another concept]? Can you provide an example of their interaction in a real-world scenario?"
2. "What are the potential limitations or criticisms of [theory/method discussed in the document]? How would you address these concerns?"
3. "If you were to extend the research presented in this document, what additional areas or aspects would you explore, and why?" 

${customPrompt ? `Additional instructions: ${customPrompt}\n\n` : ""}

As you generate the questions, increase their technicality and complexity. The first question should be relatively straightforward, while the final question should challenge the student to think critically and creatively about the material. Generate exactly five questions based on the document provided, adhering to the criteria and format specified above.

Document:
${document}
`;

// function to prompt OpenAI and parse the response using Zod
async function promptSubUUID({
  prompt,
  submission,
  uuid,
  customPrompt = null, // New optional parameter
}: {
  prompt: string;
  submission: string;
  uuid: string;
  customPrompt?: string | null;
}): Promise<[string, string]> {
  try {
    const generatedPrompt = generatePrompt(submission, customPrompt);
    console.log("[x] Sending to OpenAI: \n", generatedPrompt);

    const response = await client.chat.completions.create({
      model: "gpt-4o-2024-08-06", // Use the appropriate model
      messages: [{ role: "user", content: generatedPrompt }],
      response_format: zodResponseFormat(QuestionResponse, "QuestionResponse"),
    });

    const responseText = response.choices[0].message.content;
    if (responseText != null) return [responseText, uuid];
    else return ["response error", uuid];
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export { promptSubUUID };

// ------------------- debugging --------------------//

const debug = true;
if (debug) {
  (async () => {
    try {
      const response = await promptSubUUID({
        prompt: "",
        submission: `
        High level overview shows each ‘slave’ Arduino communicating using UART using a single communication line, the data is sent across the communication line which can be received by any or all of the individual marble machines. This allows the master Arduino to dictate the overall aesthetics of the greater sculpture. Each marble machine shall contain a ‘slave’ Arduino that receives serial data from the ‘master’. Only the ‘master’ Arduino will be able to send data to all the boxes. The master will be separate and not contained in any individual marble machine, but still a part of the larger sculpture. Specifications of the Open System Interconnection(OSI) model(Alani 2014) each layer and its role in this are outlined here.

The Physical Layer will manage the physical connection between devices, allowing raw binary data to be transferred over the physical medium. The connection required for the Arduino to connect to the overall sculpture will be soldered using 20 Awg (Appendix B) to the Arduino pins D0(RX) and D1(TX) and connected to a 2 Pin Female Polarized Header Connector. This includes the TX and RX pins, common ground and their respective cabling for transferring the data. Using a two wire balanced signalling scheme and bus topology connecting the ‘master’ Arduino to all the slaves, allows quick and easy connection between the greater sculpture for maintenance and diagnostics.

The bitrate is set for this protocol at 9600 bits/s, sufficient speed for the colour variables to be updated, it also aligns with the typical bitrate set on other teams' Arduinos. The physical layer of this communication method will be following the RS232 standards(O’Reilly 2019), this is the most commonly used and defined by the Serial Communication Standards.

The Data Link Layer will handle data framing, error detection and flow control. In this design the serial communication protocol will be managed by the SoftwareSerial package. Including start and stop bits for framing and error checking.

The Network, Transport, Session and Presentation Layers functionalities are handled at the Application layer. The functionality of data being sent to slave Arduino’s requires no session management, no formatting/encryption or compression, no routing or error handling. All devices receive all communication sent by the master and choose to disregard or receive, allowing many of the OSI model layers to use the Application layer and its functionalities.

The Application Layer will handle the user interface of updating and maintaining the system and any updates coming from the ‘master’ Arduino. Any custom implementations of the LEDs including time of day settings or lighting levels. The protocol implementations between the master and slave Arduino for data formatting and how data is structured. The ability to translate the received data into a behavioural change on the LED colours and logic. As a ball passes a sensor in the box it must incorporate a lighting pattern and the received colour values. If no message has been received from the master in a predetermined amount of time, a default lighting sequence will be initiated.

This will be used for communication between the box being designed by our team and the greater sculpture, allowing all cubes participating to coordinate the lighting aesthetic. Its ease of integration, inexpensive additional hardware requirements and simple message structure makes it ideal for this application. Modifications to this design will allow two way communication, no error handling simplifying communication of the overall structure. In this iteration of the project only colour and brightness values will be transmitted to each box, in further iterations of this design numerous characteristics can be monitored with two way communication introduced to the overall sculpture. This will however require some additional hardware components.

Once the marble enters from the bottom of the cube, the beam break sensor will indicate to the arduino that a marble has entered the system and will indicate this through the LEDs (ReqF03). The marble will hit a physical barrier which deflects the marble trajectory onto a wire track. The marble traverses through the cube in between lengths of galvanised wire that is 15mm apart. The track will lead the ball to the Achmedies Spiral (refer to Appendix A.4). The Achmedies spiral raises the marble to the top of the box that takes around five seconds (ReqF16). Every five seconds the motor which drives the Achmedies Spiral will be toggled off for 0.75 seconds (ReqF15). At the top of the spiral the marble will transfer to another wire track which will guide the marble around the box, changing the direction of the marble in two dimensions (ReqF14).

The marble travels around the box until it reaches the other side of the Achmedies spiral where it will again be lifted to the top of the box. It will then travel along a track to the ejection mechanism. The ejection mechanism is a rubber wheel attached to a motor. The speed is predefined speed (ReqF13) such that the marble meets appropriate speed requirements. This speed is managed using PID through a control on the Arduino. When the marble passes underneath the rubber wheel, momentum is transferred from the wheels circular momentum to the marble such that the marble has sufficient momentum to travel up an arc, through the expulsion hole and into the next box (ReqF12). Refer to Appendix A.5.

This allows the Marble Machine to meet all requirements without the use of compressed gas or liquids (ReqF10). 

6.1.9 Arduino Pin usage

Arduino Pin Peripheral Set to Read/Write

D0 (RX) Interbox communication receive Read

D1 Interbox communication transmit Write

D2 L293D motor driver for Ejection motor Write

D3 (PWM)

D4

D5 (PWM) LED light strip control 2 Read

D6 (PWM) LED light strip control 3 Read

D7

D8 IR break beam sensor Write

D9 (PWM) Mosfet for Archimedes screw Write

D10 (PWM)

D11 (PWM)

D12

D13 Arduino Light to display errors Write
        
        `,
        uuid: "1234",
        customPrompt: "",
      });

      if (response) console.log("The response is: ", response);
    } catch (error) {
      console.error("failed to get response", error);
    }
  })();
}
