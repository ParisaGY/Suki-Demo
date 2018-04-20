/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 */

const Alexa = require('alexa-sdk');

const states = {
    STARTMODE: '_STARTMODE',                // Prompt the user to start or restart the game.
    USERFIRSTMODE: '_USERFIRSTMODE',     // Alexa asking how can I help you
    ASKMODE: '_ASKMODE',                    // Alexa is asking user the questions.
    DESCRIPTIONMODE: '_DESCRIPTIONMODE'     // Alexa is describing the final choice and prompting to start again or quit

};
// Questions (bipolar-depression)
START_NODE = 1;
const nodes = [

// Questions (Schizophrenia)

             { "node": 1, "message": "Would you like to speak to veteran crisis line representative?", "yes": 2, "no": 3 },

             { "node": 2, "message": "Dialing now............ Thank you for calling the veteran crisis line. This is an Agent talking to you. Do you want to continue?", "yes": 600, "no": 700 },//29


             { "node": 3, "message": "Do you want to do some breathing excercise?", "yes": 4, "no": 5 },

             { "node": 4, "message": "The Stimulating Breath is adapted from yogic breathing techniques. Its aim is to raise vital energy and increase alertness. You can find more information in www.breathing.com", "yes": 0, "no": 0, "description": " " },

             { "node": 5, "message": "Do you want to listen to a relaxing music?", "yes": 6, "no": 700 },

             { "node": 6, "message": "Please go to www.relaxingmusic.com and listen the relaxing music", "yes": 0, "no": 0, "description": " " },



// Answers & descriptions
             { "node": 600, "message": "Continue talking", "yes": 0, "no": 0, "description": " " },
             { "node": 700, "message": "okay,", "yes": 0, "no": 0, "description": " "},


];

// This is used for keeping track of visited nodes when we test for loops in the tree
let visited;

// These are messages that Alexa says to the user during conversation

// This is the initial welcome message
const welcomeMessageLaunch = "welcome to reaching out! How do you feel today? "; //check

// This is the message that is repeated if the response to the initial welcome message is not heard
const repeatWelcomeMessageLaunch = "I didn't hear you. How can I help you today?"; //check

// This is the initial welcome message to flow
const welcomeMessageFlow = "Sorry to hear that! I can help you feel better by provididing information or connect you to someone to talk. Do you want to continue? ";
//

// This is the message that is repeated if the response to the initial welcome message is not heard
const repeatWelcomeMessageFlow = "Say yes to start the session or no to quit.";

// This is the message that is repeated if Alexa does not hear/understand the response to the welcome message
const promptToStartMessage = "Say yes to continue, or no to end the session.";

// This is the prompt during the game when Alexa doesnt hear or understand a yes / no reply
const promptToSayYesNo = "Say yes or no to answer the question.";

// This is the prompt during the start game when Alexa doesnt hear or understand user's input
const promptToSayQuestion = "Tell me How I can help you today.";

// This is the response to the user after the final question when Alexa decides on what group choice the user should be given
const decisionMessage = " ";

// This is the prompt to ask the user if they would like to hear a short description of their chosen profession or to play again
const playAgainMessage = "do you want to start over?";

// This is the help message during the setup at the beginning of the game
const helpMessage = "I can help you feel better by provididing information or connect you to someone to talk. tell me how I can help you today?"; //check

// This is the help message during the setup at the beginning of the game
//const helpMessageLaunch = "This is samssa voice assistant. tell me how I can help you today.";

// This is the goodbye message when the user has asked to quit the game
const goodbyeMessage = "Ok, see you next time!";

const speechNotFoundMessage = "Could not find speech for node";

const nodeNotFoundMessage = "In nodes array could not find node";

const descriptionNotFoundMessage = "Could not find description for node";

const loopsDetectedMessage = "A repeated path was detected on the node tree, please fix before continuing";

const utteranceTellMeMore = " ";

const utterancePlayAgain = "play again";


// --------------- Handlers -----------------------

// Called when the session starts.
exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandler, UserFirstHandler,startGameHandlers, askQuestionHandlers, descriptionHandlers);
    alexa.execute();
};
// set state to start up and  welcome the user
const newSessionHandler = {
  'LaunchRequest': function () {
    this.handler.state = states.USERFIRSTMODE;
    this.response.speak(welcomeMessageLaunch).listen(repeatWelcomeMessageLaunch);
    this.emit(':responseReady');
},'AMAZON.HelpIntent': function () {
    this.handler.state = states.USERFIRSTMODE;
    this.response.speak(helpMessage).listen(helpMessage);
    this.emit(':responseReady');
  },
  'Unhandled': function () {
    this.handler.state = states.USERFIRSTMODE;
    this.response.speak(promptToSayQuestion).listen(promptToSayQuestion);
    this.emit(':responseReady');
  }

};

// user has heard the Welcoming message and has been asked how alexa can help
const UserFirstHandler = Alexa.CreateStateHandler(states.USERFIRSTMODE, {

    'AMAZON.HelpIntent': function () {
        this.response.speak(helpMessage).listen(helpMessage);
        this.emit(':responseReady');

    },'AMAZON.StopIntent': function () {
        this.response.speak(goodbyeMessage);
        this.emit(':responseReady');

    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(goodbyeMessage);
        this.emit(':responseReady');

    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.USERFIRSTMODE;
        this.response.speak(welcomeMessageLaunch).listen(repeatWelcomeMessageLaunch);
        this.emit(':responseReady');

    },
    'FirstIntent': function () {


      //this.response.speak('welcomeMessageFlow').listen('welcomeMessageFlow');
      //this.emit(':responseReady');
        const repzz = this.event.request.intent.slots.Feeling.value;
        //subzz = this.event.request.intent.slots.Person.value;
        console.log(repzz)
        //console.log(subzz);
        START_NODE = 1;

        this.handler.state = states.STARTMODE;
        helper.giveFirst(this);
        this.emit(':responseReady');

    },
    'Unhandled': function () {
        this.response.speak(promptToSayQuestion).listen(promptToSayQuestion);
        this.emit(':responseReady');

    }
});

// --------------- Functions that control the skill's behavior -----------------------

// Called at the start of the game, picks and asks first question for the user
const startGameHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
    'AMAZON.YesIntent': function () {

        // ---------------------------------------------------------------
        // check to see if there are any loops in the node tree - this section can be removed in production code
        visited = [nodes.length];


        let loopFound = helper.debugFunction_walkNode(START_NODE);
        if( loopFound === true)
        {
            // comment out this line if you know that there are no loops in your decision tree
             this.response.speak(loopsDetectedMessage);
        }
        // ---------------------------------------------------------------

        // set state to asking questions
        this.handler.state = states.ASKMODE;

        // ask first question, the response will be handled in the askQuestionHandler
        let message = helper.getSpeechForNode(START_NODE);

        // record the node we are on
        this.attributes.currentNode = START_NODE;

        // ask the first question
        this.response.speak(message).listen(message);
        this.emit(':responseReady');
    },
    'AMAZON.NoIntent': function () {
        // Handle No intent.
        this.response.speak(goodbyeMessage);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(goodbyeMessage);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(goodbyeMessage);
        this.emit(':responseReady');
    },
    'AMAZON.StartOverIntent': function () {
         this.response.speak(promptToStartMessage).listen(promptToStartMessage);

         this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        this.response.speak(helpMessage).listen(helpMessage);
        this.emit(':responseReady');
    },
    'Unhandled': function () {
        this.response.speak(promptToStartMessage).listen(promptToStartMessage);
        this.emit(':responseReady');
    }
});


// user will have been asked a question when this intent is called. We want to look at their yes/no
// response and then ask another question. If we have asked more than the requested number of questions Alexa will
// make a choice, inform the user and then ask if they want to play again
const askQuestionHandlers = Alexa.CreateStateHandler(states.ASKMODE, {

    'AMAZON.YesIntent': function () {
        // Handle Yes intent.
        helper.yesOrNo(this,'yes');
        this.emit(':responseReady');
    },
    'AMAZON.NoIntent': function () {
        // Handle No intent.
         helper.yesOrNo(this, 'no');
         this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        this.response.speak(promptToSayYesNo).listen(promptToSayYesNo);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(goodbyeMessage);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(goodbyeMessage);
        this.emit(':responseReady');
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.USERFIRSTMODE;
        this.response.speak(welcomeMessageLaunch).listen(repeatWelcomeMessageLaunch);
        this.emit(':responseReady');
    },
    'Unhandled': function () {
        this.response.speak(promptToSayYesNo).listen(promptToSayYesNo);
        this.emit(':responseReady');
    }
});

// user has heard the final choice and has been asked if they want to hear the description or to play again
const descriptionHandlers = Alexa.CreateStateHandler(states.DESCRIPTIONMODE, {

 'AMAZON.YesIntent': function () {
        // Handle Yes intent.
        // reset the game state to start mode
        this.handler.state = states.USERFIRSTMODE;
        this.response.speak(welcomeMessageLaunch).listen(repeatWelcomeMessageLaunch);
        this.emit(':responseReady');

    },
    'AMAZON.NoIntent': function () {
        // Handle No intent.
        this.response.speak(goodbyeMessage);
        this.emit(':responseReady');

    },
    'AMAZON.HelpIntent': function () {
        this.response.speak(promptToSayYesNo).listen(promptToSayYesNo);
        this.emit(':responseReady');

    },
    'AMAZON.StopIntent': function () {
        this.response.speak(goodbyeMessage);
        this.emit(':responseReady');

    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(goodbyeMessage);
        this.emit(':responseReady');

    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.USERFIRSTMODE;
        this.response.speak(welcomeMessageLaunch).listen(repeatWelcomeMessageLaunch);
        this.emit(':responseReady');

    },
    'DescriptionIntent': function () {
        //const reply = this.event.request.intent.slots.description.value;
        //console.log('HEARD:' + reply);
        helper.giveDescription(this);
        //this.emit('parisa')


    },
    'Unhandled': function () {
        this.response.speak(promptToSayYesNo).listen(promptToSayYesNo);
        this.emit(':responseReady');

    }
});


// --------------- Helper Functions  -----------------------

const helper = {

    // gives the user more information on their final choice
    giveDescription: function (context,reply) {


        // get the speech for the child node
        let description = helper.getDescriptionForNode(context.attributes.currentNode);
        let message = description + repeatWelcomeMessageFlow;
        context.response.speak(message).listen(message);
        context.emit(':responseReady');
    },

    // allow the user start the game
    giveFirst: function (context,reply) {
        // get the speech for the child node
        //let description = helper.getDescriptionForNode(context.attributes.currentNode);
        //let message = description + repeatWelcomeMessageLaunch;

        context.response.speak(welcomeMessageFlow).listen(welcomeMessageFlow);
        context.emit(':responseReady');

    },

    // logic to provide the responses to the yes or no responses to the main questions
    yesOrNo: function (context, reply) {

        // this is a question node so we need to see if the user picked yes or no
        let nextNodeId = helper.getNextNode(context.attributes.currentNode, reply);

        // error in node data
        if (nextNodeId == -1)
        {
            context.handler.state = states.STARTMODE;

            // the current node was not found in the nodes array
            // this is due to the current node in the nodes array having a yes / no node id for a node that does not exist
            context.response.speak(nodeNotFoundMessage);
        }

        // get the speech for the child node
        let message_decision = helper.getSpeechForNode_decision(nextNodeId);
        let message = helper.getSpeechForNode(nextNodeId);

        // have we made a decision
        if (helper.isAnswerNode(nextNodeId) === true) {

            // set the game state to description mode
            context.handler.state = states.DESCRIPTIONMODE;

            // append the play again prompt to the decision and speak it
            message = decisionMessage + ' ' + message_decision + ' ,' + playAgainMessage;
        }

        // set the current node to next node we want to go to
        context.attributes.currentNode = nextNodeId;

        context.response.speak(message).listen(message);
    },

    // gets the description for the given node id
    getDescriptionForNode: function (nodeId) {


        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].node == nodeId) {
                return nodes[i].description;
            }
        }
        return descriptionNotFoundMessage + nodeId;
    },

    // returns the speech for the provided node id
    getSpeechForNode: function (nodeId) {

        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].node == nodeId) {
            //  console.log(subzz)
              //let finalmessage = 'Does your' + ' '+ subzz + ' '+ nodes[i].message;
              let finalmessage = nodes[i].message;
                return finalmessage;
            }
        }
        return speechNotFoundMessage + nodeId;
    },
    getSpeechForNode_decision: function (nodeId) {

        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].node == nodeId) {

                return nodes[i].message;
            }
        }
        return speechNotFoundMessage + nodeId;
    },

    // checks to see if this node is an choice node or a decision node
    isAnswerNode: function (nodeId) {

        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].node == nodeId) {
                if (nodes[i].yes === 0 && nodes[i].no === 0) {
                    return true;
                }
            }
        }
        return false;
    },

    // gets the next node to traverse to based on the yes no response
    getNextNode: function (nodeId, yesNo) {



        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].node == nodeId) {
                if (yesNo == "yes") {
                    return nodes[i].yes;
                }

                if (yesNo == "no"){
                  if (nodes[i].no ==29){

                     return 20;
                  }
                }

                if (yesNo == "no"){
                  if (nodes[i].no ==39){

                     return 300;
                  }
                }

                return nodes[i].no;
            }
        }
        // error condition, didnt find a matching node id. Cause will be a yes / no entry in the array but with no corrosponding array entry
        return -1;
    },

    // Recursively walks the node tree looking for nodes already visited
    // This method could be changed if you want to implement another type of checking mechanism
    // This should be run on debug builds only not production
    // returns false if node tree path does not contain any previously visited nodes, true if it finds one
    debugFunction_walkNode: function (nodeId) {

        //console.log("Walking node: " + nodeId);

        if( helper.isAnswerNode(nodeId) === true) {
            // found an answer node - this path to this node does not contain a previously visted node
            // so we will return without recursing further

            // console.log("Answer node found");
             return false;
        }

        // mark this question node as visited
        if( helper.debugFunction_AddToVisited(nodeId) === false)
        {
            // node was not added to the visited list as it already exists, this indicates a duplicate path in the tree
            return true;
        }

        // console.log("Recursing yes path");
        let yesNode = helper.getNextNode(nodeId, "yes");
        let duplicatePathHit = helper.debugFunction_walkNode(yesNode);

        if( duplicatePathHit === true){
            return true;
        }

        // console.log("Recursing no");
        let noNode = helper.getNextNode(nodeId, "no");
        duplicatePathHit = helper.debugFunction_walkNode(noNode);

        if( duplicatePathHit === true){
            return true;
        }

        // the paths below this node returned no duplicates
        return false;
    },

    // checks to see if this node has previously been visited
    // if it has it will be set to 1 in the array and we return false (exists)
    // if it hasnt we set it to 1 and return true (added)
    debugFunction_AddToVisited: function (nodeId) {

        if (visited[nodeId] === 1) {
            // node previously added - duplicate exists
            // console.log("Node was previously visited - duplicate detected");
            return false;
        }

        // was not found so add it as a visited node
        visited[nodeId] = 1;
        return true;
    }
};
