var CONFIG = { debug: false
               , nick: "#"   // set in onConnect
               , id: null    // set in onConnect
               , last_message_time: 1
               , focus: true //event listeners bound in onConnect
               , unread: 0 //updated in the message-processing loop
               , online : true
             };

var nicks = [];

/* The Multi-Language Editor and Engine */


(function ($) {
    
    $.fn.Woofie  = function(settings) {
        
        var config = {
            languageCatalog: {}
        };
        
        var sprites = new Array(new Sprite("sprites/dad.png"),
                                new Sprite("sprites/lucy.png"),
                                new Sprite("sprites/sophia.png")
                               );
        
        var scripts = new Array();
        var GUID = 200000;
        var dragState = null; //'catalog','canvas'
        var BLOCKCONNECTHEIGHTSHIM =3;
        
        if (settings) $.extend(config, settings);
        
        this.each(function () {
            
            woofer = $(this);
            
            woofer.settings = config;
            
            loadLanguage(woofer.settings.languageCatalog);
            
            $("#charprogram",this).droppable({drop: dropOnCanvas,
                                              accept: ".acceptCanvas"});
            $("#editScript",this).click(showScript);
            $("#consolebutton",this).click(function() {$('#consoleLayout',this).toggle();resize()});
            
            window.onresize=resize;
            woofer.disableSelection();
            loadSprites();
            resize();
            fadeIn(); 
            $('#connectcardstage').cardFlip();
            return this;
        });
        
        
        function     debug( text) {
            $('#console',woofer).append(text).append("<BR>");
            $('#console',woofer)[0].scrollTop = $('#console',woofer)[0].scrollHeight;
        }
        
        // Makes a statement from its page and index number.
        // "variables.0" returns the first command in variables page
        function commandFromName(commandName) {
            var parts = commandName.split('.');
            return woofer.settings.languageCatalog.pages[parts[0]].dataSource[parts[1]];
        }
        
        // Makes the html representing the statement.
        function makeCommandHtml(command) {
            var commandTemplate = ['<span class="',
                                   woofer.settings.languageCatalog.settings.commandTypeImages[command.type].blockcss,
                                   '" command="',
                                   command.commandId,
                                   '">',
                                   parseCommandFormat(command),
                                   '</span>'].join('');
            return commandTemplate;
        }
        
        
        var GUID=22222222;
        function newGUID() {
            return GUID++;
        }
        
        function loadSprites() {
            for (var i in sprites) {
                $("<div class='castmember'>" + sprites[i].src.replace("sprites/","").replace(".png","") + "<br><img src='../" + sprites[i].src + "' width=50 height=50></div>")
                    .click(spriteSelectedEvent)
                    .appendTo('#castlist',woofer);
            }
            $('#castlist .castmember:first',woofer).addClass("selected");
        }
        
        function spriteSelectedEvent (event) {
            if (CONFIG.online) {
                $('#castlist .castmember').removeClass("selected");
                $(event.currentTarget).addClass("selected");
            }
            else {
                recvSpriteSelectedEvent(event) 
            }
        }
        
        function recvSpriteSelectedEvent(event) {
            $('#castlist .castmember').removeClass("selected");
            $(event.currentTarget).addClass("selected");
        }
        
        function newBlockInit(newBlock, putx,puty) {
            newBlock.css('position','absolute')    
                .css('top',puty)
                .css('left',putx)
                .appendTo('#charprogram',woofer)
                .draggable( { helper: 'original',
                              revert :"invalid",                              
                              start: function (event,ui) {
                                  dragState="block";
                                  startstopBlocksDragEvent(event,ui)},
                              drag: updateBlocksDragEvent,
                              stop:  function (event,ui) {
                                  dragState=null;
                                  startstopBlocksDragEvent(event,ui)}
                            }) 
                .droppable({ greedy:true,
                             tolerance: "pointer",
                             drop: dropOnBlock,
                             hoverClass:'ui-drophover',
                             accept:".acceptStatement"})
                .data('next',null)
                .data('prev',null)
                .attr('guid',newGUID())
                .disableSelection()
                .find('*')
                .disableSelection()
            ;
            
            newWellInit(newBlock);
            pushScript(newBlock[0]);
            return newBlock;
        }
        
        function showScript () {
            debug("<BR>");
            debug("=========== scripts ==========");
            for (var i=0;i<scripts.length;i++) {
                debug("++++script"+i);
                var blockPointer=scripts[i];
                while (blockPointer != null) {
                    commandA = $(blockPointer).attr("command").split('.');
                    debug(woofer.language.pages[commandA[0]].dataSource[commandA[1]].code);
                    blockPointer = $(blockPointer).data('next');
                }
                debug("==============================");
            }
        }
        
        
        function pushScript(block) {
            scripts[scripts.length]= block;
        }
        
        function removeScript(block) {
            for (var i=0;i<scripts.length;i++) {
                if (scripts[i]===block) {
                    scripts.splice(i,1);
                }
            }
        }
        
        function transformEventCoordsToCharProgram  (ui) {
            return transformXYCoordsToCharProgram (ui.position.left,ui.position.top);
        }
        
        function transformXYCoordsToCharProgram (x,y) {
            offsetx = $('#charprogram',woofer).offset().left-$('#charprogram',woofer).scrollLeft();
            offsety = $('#charprogram',woofer).offset().top-$('#charprogram',woofer).scrollTop();
            putx = x-offsetx;
            puty = y-offsety;
            return ({x:x,y:y});
            //                        return (x{x:putx,y:puty});
        }
        
        function dropOnCanvas(event, ui) {
            var block=null;
            if (dragState=="catalog") {
                
                offsetx = $('#charprogram',woofer).offset().left-$('#charprogram',woofer).scrollLeft();
                offsety = $('#charprogram',woofer).offset().top-$('#charprogram',woofer).scrollTop();
                putx = ui.position.left-offsetx;
                puty = ui.position.top-offsety;
                
                
                send({guid:"new",
                      type:"newBlock",
                      command:ui.draggable.attr("command"),
                      x:putx,
                      y:puty,
                      droppedOnGuid:null});
                
            } else
                if (dragState=="block") {
                    offsetx = $('#charprogram',woofer).offset().left-$('#charprogram',woofer).scrollLeft();
                    offsety = $('#charprogram',woofer).offset().top-$('#charprogram',woofer).scrollTop();
                    putx = ui.position.left-offsetx;
                    puty = ui.position.top-offsety;
                    block= ui.draggable;
                    
                    send({guid:ui.draggable.attr('guid'),
                          type: "dropOnCanvas",
                          x:putx,
                          y:puty,
                          droppedOnGuid:null});
                }
        }
        
        function newWellInit (wellBlock) {
            wellBlock.find(".well.Number")
                .droppable({greedy:true,
                            tolerance: "pointer",
                            drop:dropInWell,
                            hoverClass:'welldrophover',
                            accept: ".Number"})
                .attr('guid', newGUID())
                .end()
                .find(".well.Boolean")
                .droppable({greedy:true,
                            tolerance: "pointer",
                            drop:dropInWell,
                            hoverClass:'welldrophover',
                            accept: ".Boolean"})
                .attr('guid', newGUID())
                .end()
                .find(".well.String")
                .droppable({greedy:true,
                            tolerance: "pointer",
                            drop:dropInWell,
                            hoverClass:'welldrophover',
                            accept: ".String"})
                .attr('guid', newGUID())
                .end()
                .find(".well")
                .editableText({newlinesEnabled:false})
                .attr('guid', newGUID())
            
        }    
        
        function dropInWell  (event,ui) {
            var newWellThing = ui.draggable.clone() 
                .appendTo($(this).empty())
                .disableSelection();
            newWellInit(newWellThing);                        
        }
        
        // jQuery this is same as event.target.  The element that had the event bound.
        function dropOnBlock(event, ui) {
            var droppedOn = event.target; 
            
            if (dragState=="catalog") {
                send({guid:"new",
                      type:"newBlock",
                      command:ui.draggable.attr("command"),
                      x:putx,
                      y:puty,
                      droppedOnGuid: $(droppedOn).attr('guid')});
            }
            
            else if (dragState=="block") {
                send ({guid:ui.draggable.attr('guid'),
                       type:"dropOnBlock",
                       droppedOnGuid: $(droppedOn).attr('guid')});
                
            }
        }
        
        
        
        function dropBlockOnAnother (block,droppedOnBlock) {
            // insert into list
            putx = $(droppedOnBlock).position().left+$('#charprogram',woofer).scrollLeft();
            puty = $(droppedOnBlock).position().top+ $('#charprogram',woofer).scrollTop()+$(droppedOnBlock).outerHeight()-BLOCKCONNECTHEIGHTSHIM;
            
            var spliceIntoDroppedOnList = $(droppedOnBlock).data('next');
            block.css("top",puty)
                .css("left",putx).data('prev',droppedOnBlock);
            $(droppedOnBlock).data('next',block[0]);
            if ( spliceIntoDroppedOnList !=null) {
                var blockList = block;
                while (blockList.data('next')!=null) {
                    blockList = $(blockList.data('next'));
                }
                blockList.data('next',spliceIntoDroppedOnList);
                $(spliceIntoDroppedOnList).data('prev',blockList[0]);
            }
            updateBlocks(block);
        }
        
        
        
        function updateBlocks  (block) {
            var putx = block.position().left;
            var puty = block.position().top + block.outerHeight() - BLOCKCONNECTHEIGHTSHIM;
            if (block.data('next')!=null) {
                var me = $(block.data('next'));
                me.css('left',putx)
                    .css('top',puty)
                    .removeClass('ui-drophover');
                puty += me.outerHeight() - BLOCKCONNECTHEIGHTSHIM;
                updateBlocks(me);
            }
        }
        
        function updateBlocksNew  (block,event) {
            var putx = block.position().left;
            var puty = block.position().top + block.outerHeight() - BLOCKCONNECTHEIGHTSHIM;
            if (block.data('next')!=null) {
                var me = $(block.data('next'));
                me.css('left',putx)
                    .css('top',puty)
                    .removeClass('ui-drophover');
                puty += me.outerHeight() - BLOCKCONNECTHEIGHTSHIM;
                updateBlocks(me);
            }
        }
        
        function highlightBlocks (block) {
            if (dragState=="block")  block.addClass('ui-draggable-dragging')
            else block.removeClass('ui-draggable-dragging')
            
            if (block.data('next')!=null) {
                var me = $(block.data('next'));
                me.removeClass('ui-drophover');
                highlightBlocks(me);
            }
        }
        
        function startstopBlocksDragEvent (event,ui){
            highlightBlocks(ui.helper);
        }
        
        function updateBlocksDragEvent (event,ui){
            var block = $(event.target);
            
            framexy = transformEventCoordsToCharProgram(ui);
            send({guid:block.attr('guid'),
                  type:"dragBlock",
                  x: framexy.x,
                  y:framexy.y});
        }
        
        
        function loadLanguage(language) {
            woofer.language = language;
            loadLanguagePages(language.pages);
        }
        
        function loadLanguagePages (languageCatalogPages) {
            for (catalogPageIndex in languageCatalogPages) {
                var catalogPage = languageCatalogPages[catalogPageIndex];
                addPageButton(catalogPage,catalogPageIndex);
                loadCatalogPage(catalogPage);
            }
        }
        
        function addPageButton (catalogPage,catalogPageIndex) {
            var html = new Array('<div class="catalogpagebutton" id="',
                                 catalogPageIndex,
                                 '"><div class="cpblight" style="background-color:',
                                 catalogPage.color,
                                 '"></div><div class="cpblabel">',
                                 catalogPage.name,
                                 '</div></div>');
            var pageButton = $(html.join('')).click(pageButtonEvent);
            
            $('#catalogpages',woofer).append(pageButton);
        }
        
        
        function pageButtonEvent(event) {
            var catalogPage =woofer.language.pages[event.currentTarget.id]; 
            loadCatalogPage(catalogPage);
        }
        
        function loadCatalogPage (catalogPage) {
            $('#templatelist',woofer).empty();
            $('#templatelist',woofer).css("background-image","url(../i/"+catalogBackgrounds[catalogPage.id]+")");
            for (commandIndex in catalogPage.dataSource) {
                var command = catalogPage.dataSource[commandIndex];
                command.commandId = catalogPage.id + "." + commandIndex;
                addCommandTemplate(command);
            }
            // Make draggable
            $('#templatelist span',woofer).disableSelection();
            $('#templatelist > span',woofer).draggable( {helper: "clone", 
                                                         revert: "invalid",
                                                         opacity: .75,
                                                         start: function () {
                                                             dragState="catalog";}});
            
            // Highlight page button
            $('.catalogpagebutton').css('background-color','#777');
            $('#catalogpages #'+catalogPage.id,woofer).css('background-color',catalogPage.color);
        }
        
        function addCommandTemplate(command) {
            var commandTemplate = $(makeCommandHtml(command)+"<P>");
            $('#templatelist',woofer).append(commandTemplate);
            return commandTemplate;        
        }
        
        
        function parseCommandFormat (command) {        
            var paramregexp = /\{[^\}]*?\}|[^\{\}]*/g;
            var innerHtmlString = "";
            var parameters = command.format.match(paramregexp);
            
            for   (var elementParameterIndex in parameters) {
                elementParameter = parameters[elementParameterIndex];
                var myregexp = /^\{.*\}$/;
                if (elementParameter.match(myregexp)){  // matches {var}
                    
                    var paramType = getParamTypeByName(command,elementParameter.substring(1,elementParameter.length-1));
                    innerHtmlString += ["<span class='well ", 
                                        paramType,
                                        "'>&nbsp;&nbsp;&nbsp;</span>"].join('');
                    
                }
                else {
                    innerHtmlString += ["<span class='commandtext'>", 
                                        elementParameter,
                                        "</span>"].join('');
                }
                
            }
            return innerHtmlString;
            
        }
        
        function getParamTypeByName(command,name) {
            for (index in command.params) {
                var parameterDef = command.params[index];
                if (parameterDef.name == name) {
                    return parameterDef.type;
                }
            }
            return null;
        }
        
        
        function resize() {
            var tablePadding = $('#bigtable',woofer)[0].cellSpacing;
            $('#consolebutton',woofer).css('top',$('#middlerow',woofer).position().top+$('#middlerow',woofer).innerHeight()-14);
        }
        
        
        function fadeIn () {
            
            var current =woofer.data("fade"); 
            if (current == null || typeof current =="undefined") {
                current = .9;//-3
            }
            if (current < 1) {
                woofer.css('opacity',current);
                setTimeout(fadeIn,100);
                current += 0.1;
                woofer.data("fade",current);
                
            }
        }
        
        /* Collaboration features */
        
        //updates the users link to reflect the number of active users
        function updateUsersLink ( ) {
            var t = nicks.length.toString() + " user";
            if (nicks.length != 1) t += "s";
            $('#usersLink',this).text(t);
        }
        
        //handles another person joining chat
        function userJoin(nick, timestamp) {
            //put it in the stream
            addMessage(nick, "joined", timestamp, "join");
            //if we already know about this user, ignore it
            for (var i = 0; i < nicks.length; i++)
                if (nicks[i] == nick) return;
            //otherwise, add the user to the list
            nicks.push(nick);
            //update the UI
            updateUsersLink();
        }
        
        
        //handles someone leaving
        function userPart(nick, timestamp) {
            //put it in the stream
            addMessage(nick, "left", timestamp, "part");
            //remove the user from the list
            for (var i = 0; i < nicks.length; i++) {
                if (nicks[i] == nick) {
                    nicks.splice(i,1)
                    break;
                }
            }
            //update the UI
            updateUsersLink();
        }
        
        
        //used to keep the most recent messages visible
        function scrollDown () {
            $('#log',woofer)[0].scrollTop=    $('#log',woofer)[0].scrollHeight;
            $("#entry").focus();
        }
        
        
        /*/ Incoming Message handlers

                 */
        
        var handlers = {
            
            DOdropOnCanvas: function (from, message, timestamp) {
                if (message === null)
                    return;
                var dropOnCanvasData = message;
                var block=$guid(dropOnCanvasData.guid);
                if (block.data("prev") != null) {
                    $(block.data("prev")).data("next",null);
                    block.data("prev",null);
                }
                updateBlocks(block);
                removeScript(block[0]);
                pushScript(block[0]);    
            },
            
            DOdragBlock: function (from, message, timestamp) {
                if (message === null)
                    return;
                var dragBlockData = message;
                
                // get the block, update it's position  remove the x and y.
                var block=$guid(dragBlockData.guid);
                
                block.css("top",dragBlockData.y).css("left",dragBlockData.x);
                updateBlocks(block);
            },
            
            DOnewBlock: function (from, message, timestamp) {
                if (message === null)
                    return;
                var newBlockData = message;
                newBlock = newBlockInit($(makeCommandHtml(commandFromName(newBlockData.command))),newBlockData.x,newBlockData.y)
                    .attr('guid',newBlockData.guid);
                
                if (newBlockData.droppedOnGuid != null) {
                    var droppedOn = $guid(newBlockData.droppedOnGuid);
                    dropBlockOnAnother(newBlock,droppedOn);
                }
            },
            
            
            DOdropOnBlock: function (from, message, timestamp) {
                if (message === null)
                    return;
                var dropOnBlockData = message;
                
        // get the block, update it's position  remove the x and y.
                var block=$guid(dropOnBlockData.guid);
                var droppedOn=$guid(dropOnBlockData.droppedOnGuid);
                
                dropBlockOnAnother(block,droppedOn);
                removeScript(block[0]);
            }
        }
        
        function $guid(guid) {
            return $('[guid="'+guid+'"]');
        }
        
        //inserts an event into the stream for display
        //the event may be a msg, join or part type
        //from is the user, text is the body and time is the timestamp, defaulting to now
        //_class is a css class to apply to the message, usefull for system events
        function addMessage (from, text, time, _class) {
            if (text === null)
                return;
            
            if (time == null) {
                // if the time is null or undefined, use the current time.
                time = new Date();
            } else if ((time instanceof Date) === false) {
                // if it's a timestamp, interpret it
                time = new Date(time);
            }
            
            //every message you see is actually a table with 3 cols:
            //  the time,
            //  the person who caused the event,
            //  and the content
            var messageElement = $(document.createElement("table"));
            
            messageElement.addClass("message");
            if (_class)
                messageElement.addClass(_class);
            
            // sanitize
            text = util.toStaticHTML(text);
            
            // If the current user said this, add a special css class
            var nick_re = new RegExp(CONFIG.nick);
            if (nick_re.exec(text))
                messageElement.addClass("personal");
            
            // replace URLs with links
            text = text.replace(util.urlRE, '<a target="_blank" href="$&">$&</a>');
            
            var content = '<tr>'
                + '  <td class="date">' + util.timeString(time) + '</td>'
                + '  <td class="nick">' + util.toStaticHTML(from) + '</td>'
                + '  <td class="msg-text">' + text  + '</td>'
                + '</tr>'
            ;
            messageElement.html(content);
            
            //the log is the stream that we view
            $("#log").append(messageElement);
            
            //always view the most recent message when it is added
            scrollDown();
        }
        
        function updateRSS () {
            var bytes = parseInt(rss);
            if (bytes) {
                var megabytes = bytes / (1024*1024);
                megabytes = Math.round(megabytes*10)/10;
                $("#rss").text(megabytes.toString());
            }
        }
        
        function updateUptime () {
            if (starttime) {
                $("#uptime").text(starttime.toRelativeTime());
            }
        }
        
        var transmission_errors = 0;
        var first_poll = true;
        
        
        //process updates if we have any, request updates from the server,
        // and call again with response. the last part is like recursion except the call
        // is being made from the response handler, and not at some point during the
        // function's execution.
        function longPoll (data) {
            if (transmission_errors > 2) {
                showConnect();
                return;
            }
            
            if (data && data.rss) {
                rss = data.rss;
                updateRSS();
            }
            
            //process any updates we may have
            //data will be null on the first call of longPoll
            if (data && data.messages) {
                for (var i = 0; i < data.messages.length; i++) {
                    var message = data.messages[i];
                    
                    //track oldest message so we only request newer messages from server
                    if (message.timestamp > CONFIG.last_message_time)
                        CONFIG.last_message_time = message.timestamp;
                    
                    //dispatch new messages to their appropriate handlers
                    switch (message.type) {
                    case "msg":
                        if(!CONFIG.focus){
                            CONFIG.unread++;
                        }
                        addMessage(message.nick, message.text, message.timestamp);
                        break;
                        
                    case "join":
                        userJoin(message.nick, message.timestamp);
                        break;
                        
                    case "part":
                        userPart(message.nick, message.timestamp);
                        break;
                        
                    default:
                        (handlers["DO"+message.type])(message.nick, message, message.timestamp);
                    }
                }
                //update the document title to include unread message count if blurred
                updateTitle();
                
                //only after the first request for messages do we want to show who is here
                if (first_poll) {
                    first_poll = false;
                    who();
                }
            }
            
            //make another request
            $.ajax({ cache: false
                     , type: "GET"
                     , url: "/recv"
                     , dataType: "json"
                     , data: { since: CONFIG.last_message_time, id: CONFIG.id }
                     , error: function () {
                         addMessage("", "long poll error. trying again...", new Date(), "error");
                         transmission_errors += 1;
                         //don't flood the servers on error, wait 10 seconds before retrying
                         setTimeout(longPoll, 10*1000);
                     }
                     , success: function (data) {
                         transmission_errors = 0;
                         //if everything went well, begin another request immediately
                         //the server will take a long time to respond
                         //how long? well, it will wait until there is another message
                         //and then it will return it to us and close the connection.
                         //since the connection is closed when we get data, we longPoll again
                         longPoll(data);
                     }
                   });
        }
        
        
        
        /*
                            Events
                            ======

                            dropOnCanvas:
                            {guid:"new" || guid,
                            x:putx,
                            y:puty,
                            }

                            dragBlock:
                            {guid:"new" || guid,
                            x:putx,
                            y:puty,
                            }

                            newBlock:
                            {guid:"new",
                            command:ui.draggable.attr("command"),
                            x:putx,
                            y:puty,
                            droppedOnGuid: $(droppedOn).attr('guid')}
                        */
        
        function send (message) {
            if (CONFIG.online) {
                if (CONFIG.debug === false) {
                    jQuery.get("/send", {id:CONFIG.id, 
                                         message: JSON.stringify(message)},
                               function (data) { }, "json");
                }
            } else {  // send message locally
                (handlers["DO"+message.type])(session.nick,message.text,new Date());
            }
        }
        
        //Transition the page to the state that prompts the user for a nickname
        function showConnect () {
            
            $("#connect").show();
            $("#editor1").hide();
            $("#consolebutton").hide();
            $("#toolbar").hide();
            $("#nickInput").focus();
        }
        
        //transition the page to the loading screen
        function showLoad () {
            $("#connect").hide();
            //  $("#loading").show();
            $("#editor1").show();
            $("#toolbar").hide();
        }
        
        //transition the page to the main chat view, putting the cursor in the textfield
        function showChat (nick) {
            $("#toolbar").show();
            $("#entry").focus();
            $("#connect").hide();
            //$("#loading").hide();
            $("#editor1").show();
            $("#consolebutton").show();
            scrollDown();
        }
        
        //we want to show a count of unread messages when the window does not have focus
        function updateTitle(){
            var appname = "platform chat";
            if (CONFIG.unread) {
                document.title = "(" + CONFIG.unread.toString() + ") "+ appname;
            } else {
                document.title = appname;
            }
        }
        
        // daemon start time
        var starttime;
        // daemon memory usage
        var rss;
        
        //handle the server's response to our nickname and join request
        function onConnect (session) {
            if (session.error) {
                alert("error connecting: " + session.error);
                showConnect();
                return;
            }
            
            CONFIG.nick = session.nick;
            CONFIG.id   = session.id;
            starttime   = new Date(session.starttime);
            rss         = session.rss;
            updateRSS();
            updateUptime();
            
            //update the UI to show the chat
            showChat(CONFIG.nick);
            
            //listen for browser events so we know to update the document title
            $(window).bind("blur", function() {
                CONFIG.focus = false;
                updateTitle();
            });
            
            $(window).bind("focus", function() {
                CONFIG.focus = true;
                CONFIG.unread = 0;
                updateTitle();
            });
            
            longPoll(); // moved from document ready
            
        }
        
        //add a list of present chat members to the stream
        function outputUsers () {
            var nick_string = nicks.length > 0 ? nicks.join(", ") : "(none)";
            addMessage("users:", nick_string, new Date(), "notice");
            return false;
        }
        
        //get a list of the users presently in the room, and add it to the stream
        function who () {
            jQuery.get("/who", {}, function (data, status) {
                if (status != "success") return;
                nicks = data.nicks;
                outputUsers();
            }, "json");
        }
        
        
        $(document).ready(function() {
            
            //submit new messages when the user hits enter if the message isnt blank
            $("#entry").keypress(function (e) {
                if (e.keyCode != 13 ) return; // REturn key
                var msg = $("#entry").attr("value").replace("\n", "");
                if (!util.isBlank(msg)) send({type:"msg",text:msg});
                $("#entry").attr("value", ""); // clear the entry field.
            });
            
            
            $("#usersLink").click(outputUsers);
            
            //try joining the chat when the user clicks the connect button
            $("#connectButton").click(function () {
                //lock the UI while waiting for a response
                showLoad();
                
                var nick = $("#nickInput").attr("value");
                
                //dont bother the backend if we fail easy validations
                if (nick.length > 50) {
                    alert("Nick too long. 50 character max.");
                    showConnect();
                    return false;
                }
                
                //more validations
                if (/[^\w_\-^!]/.exec(nick)) {
                    alert("Bad character in nick. Can only have letters, numbers, and '_', '-', '^', '!'");
                    showConnect();
                    return false;
                }
                var message =  {nick: nick, type:"join",text:"join"};
                //make the actual join request to the server
                $.ajax({ cache: false
                         , type: "GET" // XXX should be POST
                         , dataType: "json"
                         , url: "/join"
                         , data: {message: JSON.stringify(message) }
                         , error: function () {
                             alert("error connecting to server");
                             showConnect();
                         }
                         , success: onConnect
                       });
                return false;
            });
            
            // update the daemon uptime every 10 seconds
            setInterval(function () {
                updateUptime();
            }, 10*1000);
            
            if (CONFIG.debug) {
                
                $("#editor1").show();
                $("#consolebutton").show();
                $("#loading").hide();
                $("#connect").hide();
                return;
            }
            
            // remove fixtures
            $("#log table").remove();
            
            //begin listening for updates right away
            //interestingly, we don't need to join a room to get its updates
            //we just don't show the chat stream to the user until we create a session
            
            showConnect();
        });
        
        //if we can, notify the server that we're going away.
        $(window).unload(function () {
            jQuery.get("/part", {id: CONFIG.id}, function (data) { }, "json");
        });
    }
})(jQuery);

