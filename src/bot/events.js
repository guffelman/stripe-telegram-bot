const {
  Telegraf
} = require("telegraf");
const stripehelper = require("../webhook/stripehelper.js");
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);

async function printChannelIDs() {
  try {
      const botInfo = await bot.telegram.getMe();
      const botUserId = botInfo.id;
      const commands = await bot.telegram.getMyCommands();

      console.log("Channel IDs of chats the bot is a part of:");
      for (const command of commands) {
          const channel = command.scope ?
              command.scope.type === "chat" ?
              command.scope :
              null :
              null;
          if (channel && channel.type === "channel") {
              console.log(`${channel.title} (${channel.id})`);
          }
      }
  } catch (error) {
      console.error("Error fetching chat list:", error);
  } finally {

      bot.stop("SIGINT");
  }
}

async function addUserToChannelbyId(userid, channelid) {
  try {

      const chatMember = await bot.telegram.getChatMember(channelid, userid);

      if (chatMember) {
          console.log(
              `User is already a member of the channel: userId=${userid}, channelId=${channelid}`
          );
          return;
      }

      await bot.telegram.inviteChatMember(channelid, userid);
      console.log(
          `User added to the channel: userId=${userid}, channelId=${channelid}`
      );
  } catch (error) {
      console.error("Error adding user to the channel:", error);
  }
}

async function addUserToChannel(username, channelid) {
  try {

      const chatMember = await bot.telegram.getChatMember(channelid, username);
      console.log(chatMember);

      if (chatMember) {
          console.log(
              `User is already a member of the channel: username=${username}, channelId=${channelid}`
          );
          return;
      }

      await bot.telegram.inviteChatMember(channelid, username);
      console.log(
          `User added to the channel: username=${username}, channelId=${channelid}`
      );
  } catch (error) {
      console.error("Error adding user to the channel:", error);
  }
}

async function removeUserFromChannel(teleid, channelid) {
  try {

      const chatMember = await bot.telegram.getChatMember(channelid, teleid);
      console.log(chatMember);

      if (!chatMember) {
          console.log(
              `User is not a member of the channel: username=${username}, channelId=${channelid}`
          );
          return;
      }

      await bot.telegram.banChatMember(channelid, teleid);
      console.log(
          `User removed from the channel: username=${teleid}, channelId=${channelid}`
      );
  } catch (error) {
      console.error("Error removing user from the channel:", error);
  }
}

bot.start((ctx) => {
  const {
      username,
      id
  } = ctx.from;
  console.log(`Received /start command from ${username} (${id})`);

  ctx.reply(
      "Hello! Please enter your phone number or email address to verify your purchase.", {
          reply_markup: {
              keyboard: [
                  [{
                      text: "Phone",
                      request_contact: true
                  }]
              ],
              resize_keyboard: true,
              one_time_keyboard: true,
          },
      }
  );
});

bot.command("printChannelIDs", (ctx) => {
  const {
      username,
      id
  } = ctx.from;
  console.log(`Received /printChannelIDs command from ${username} (${id})`);
  printChannelIDs();
});

bot.command("test", (ctx) => {
  const {
      username,
      id
  } = ctx.from;
  console.log(`Received /test command from ${username} (${id})`);

  addUserToChannelbyId(id, -1001926259682);
});

bot.command("add", (ctx) => {

  const username = ctx.message.text.split(" ")[1];
  const {
      id
  } = ctx.from;
  console.log(`Received /add command from ${username} (${id})`);

  addUserToChannel(username, -1001926259682);
});

bot.on("contact", (ctx) => {
  const {
      username,
      id
  } = ctx.from;
  console.log(`Received contact from ${username} (${id})`);
  const {
      phone_number,
      first_name
  } = ctx.message.contact;
  console.log(`Received phone number ${phone_number} from ${first_name}`);
});

bot.on("message", (ctx) => {
  const {
      username,
      id
  } = ctx.from;

  usermessage = ctx.message.text;

  if (usermessage.match(/^\+?[0-9]{10,11}$/)) {
      console.log("phone number");
      stripehelper.isCustomerActiveByPhone(usermessage).then((active) => {
          if (active) {
              messagerId = id;
              console.log("Customer is active");

              stripehelper.updateCustomerTeleIDbyPhone(usermessage, messagerId);

              addUserToChannelbyId(id, -1001926259682).then(() => {
                  ctx.reply("Your purchase has been verified. Welcome to the channel!");
              });
          } else {
              console.log("Customer is not active");
              ctx.reply("Your purchase has not been verified. Please try again.");
          }
      });
  } else if (
      usermessage.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
  ) {
      console.log("email address");
      stripehelper.isCustomerActiveByEmail(usermessage).then((active) => {
          if (active) {
              messagerId = id;

              stripehelper.updateCustomerTeleIDbyEmail(usermessage, messagerId);

              console.log("Customer is active");
              addUserToChannelbyId(messagerId, -1001926259682).then(() => {
                  ctx.reply("Your purchase has been verified. Welcome to the channel!");
              });
          } else {
              console.log("Customer is not active");
              ctx.reply("Your purchase has not been verified. Please try again.");
          }
      });
  } else {
      console.log(`Received message from ${username} (${id})`);
      ctx.reply(
          "Please enter your phone number (ex: +12225558888) or email address to verify your purchase.", {
              reply_markup: {
                  keyboard: [
                      [{
                          text: "Phone",
                          request_contact: true
                      }]
                  ],
                  resize_keyboard: true,
                  one_time_keyboard: true,
              },
          }
      );
  }
});

module.exports = {
  bot,
  removeUserFromChannel
};