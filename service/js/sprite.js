


var Sprite= function (src){
    
    var self=this;
    this.src = src;
    this.x=0;
    this.y=0;
    this.direction =0;
    this.size=100; // percent;
    
    this.edgebounce=true;
    this.costume=null;
    this.saying=null;
    this.thinking=null;
    this.visible=false;
    this.layer=1;
    
    this.pensize=1;
    this.pencolor="black";
    this.penshade="black";
    
    this.penupdown="up";
    
    this.move = function (x,y) {
	this.x += x;
	this.y += y;
    }
    
    this.penup = function () {
	this.penupdown="up";
    }
    
    return this;
};

var Message= function (type, text) {
    var self=this;
    this.nick = nick;
    this.type= type // "msg", "join", "part"
    this.text= text
    this.timestamp= (new Date()).getTime()
}







