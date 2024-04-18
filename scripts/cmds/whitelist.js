const fs = require("fs-extra");
const { config } = global.GoatBot;
const { client } = global;



module.exports = {
  config: {
    name: "whitelist",
    aliases: [],
    version: "0.1",
    author: "Fahim", //upol author change koiro na 😓
    countDown: 5,
    role: 2,


    
    shortDescription: {
      en: "turn on/off whitelist mode"
    },
    longDescription: {
      en: "follow shortDescription read 😴"
    },
    category: "owner",


    
    guide: {
      en: "   {pn} [on | off]: turn on/off the  whitelist mode "
				
    }
  },


  
  	langs: {
		en: {
			turnedOn: "✅ | Turned on the whitelist mode",
			turnedOff: "✅ | Turned off the whitelist mode",
			
		} 
	},
  



  onStart: function ({ args, message, getLang }) {
    let isSetNoti = false;
    let value;
    let indexGetVal = 0;

    if (args[0] == "noti") {
      isSetNoti = true;
      indexGetVal = 1;
    } 


    
    if (args[indexGetVal] == "on")
      value = true;
    else if (args[indexGetVal] == "off")
      value = false;
    else
      return message.SyntaxError();
    

    

    if (isSetNoti) {
      config.hideNotiMessage.whiteListMode = !value;
      message.reply(getLang(value ? "turnedOnNoti" : "turnedOffNoti"));
    }
      

    
    else {
      config.whiteListMode.enable = value;
      message.reply(getLang(value ? "turnedOn" : "turnedOff"));
    }

    fs.writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
  }
};
