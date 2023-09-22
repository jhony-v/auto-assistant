import {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
} from "@bot-whatsapp/bot";
import QRPortalWeb from "@bot-whatsapp/portal";
import BaileysProvider from "@bot-whatsapp/provider/baileys";
import JsonFileAdapter from "@bot-whatsapp/database/json";
import { completion } from "@auto-assistant/core-handler";


// TODO: optimize flows for each user
let localMessages = [];

const flowPrincipal = addKeyword(`/.*/`, { regex: true }).addAction(
  async (ctx, { flowDynamic }) => {
    const answers = await completion({
      input: { phone: ctx.from, message: ctx.body },
      messages: localMessages,
    });
    console.log(JSON.stringify(answers, null, 2));
    answers.forEach((answer) => {
      localMessages.push(answer);
      flowDynamic(answer.content);
    });
  }
);

const main = async () => {
  const adapterDB = new JsonFileAdapter();
  const adapterFlow = createFlow([flowPrincipal]);
  const adapterProvider = createProvider(BaileysProvider);

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  QRPortalWeb();
};

main();
