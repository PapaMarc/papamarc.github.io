/*******************************************************************
*
* File    : JSFX_Spring.js
*
* Created : 2001/05/09
*
* Author  : Roy Whittle  (Roy@Whittle.com) www.Roy.Whittle.com
*		Based on an original idea by
*		Philip Winston (pwinston@yahoo.com) www.geocities.com/pwinston/
*
* Purpose : To create a springy mouse trailer
*
* History
* Date         Version        Description
* 2000-12-06	1.0		I have reverse engineered Philip Winston's
*					Excellent "Elastic Bullets" script
*					(www.geocities.com/pwinston/
*					 pwinston@yahoo.com)
*					This is an initial version. 
* 2000-12-08	1.1		Added the function textSpring
* 2001-05-09	1.2		Converted for JavaScript-FX
***********************************************************************/
if(!window.JSFX)
	JSFX = new Object();

var GRAVITY = 9.8; 

JSFX.Point = function(x, y)
{
	this.x = x;
	this.y = y;
}
/*
 * Class SpringMass extends Layer
 */
JSFX.SpringMass = function(htmlStr, x, y)
{
	if(!htmlStr)
		return;
	//Call the super constructor
	this.superC = JSFX.Layer;
	this.superC(htmlStr, x, y);

	this.screen=new JSFX.Point(x,y);
	this.connection=new Array();
	this.dx=0;
	this.dy=0;
	this.show();
}
JSFX.SpringMass.prototype = new JSFX.Layer;

JSFX.MouseSpring = function(n, img, ax, ay)
{
	if(n==null) return;

	if(ax==null && ay==null)
	{
		ax=0;
		ay=GRAVITY;
	}
	if(ax==null)
		ax=0;
	if(ay==null)
		ay=0;

	this.theMasses = new Array();
	for(i=0 ; i<n ; i++)
		this.theMasses[i] = new JSFX.SpringMass(img, 100, (100 + (20*i)) );

	this.friction	= -7;
	this.mass		= 10;
	this.springForce	= 50;
	this.springLength	= 10;
	this.ax		= ax;
	this.ay		= ay;
	this.interval	= 40;
	this.numSteps	= 1000/this.interval;

	len  = this.theMasses.length;
	len2 = len-1;
	for(i=0 ; i<len ; i++)
	{
		this.theMasses[i].connection[0] = i > 0		? this.theMasses[i-1] : null;
		this.theMasses[i].connection[1] = i < (len2)	? this.theMasses[i+1] : null;
	}
}

JSFX.MouseSpring.prototype.calculateForce = function(m1,m2,f)
{
	if(m1 == null || m2 == null)
		return;

	x = m2.screen.x - m1.screen.x;
	y = m2.screen.y - m1.screen.y;

	len  = Math.sqrt(x*x + y*y); // good old Pythagoras theorem
	force = this.springForce * (len - this.springLength);

	//If we only process positive force then the spring acts
	//more like an elastic band
	if(force > 0)
	{
		f.x += force * x/len; //cos = adjacent over hypotenuse
		f.y += force * y/len; //sin = opposite over hypotenuse
	}
}

JSFX.MouseSpring.prototype.updateSpeed = function()
{
	f = new JSFX.Point(0,0);

	for(i=1 ; i<this.theMasses.length ; i++)
	{
		m = this.theMasses[i];
		f.x=m.dx * this.friction;
		f.y=m.dy * this.friction;

		for(j=0 ; j<m.connection.length ; j++)
			this.calculateForce(m, m.connection[j], f);

		m.dx += ((f.x/this.mass) + this.ax)/this.numSteps;  // delta = dela + acc where
		m.dy += ((f.y/this.mass) + this.ay)/this.numSteps;  // acc = Force/Mass (Newtons 1st? law of motion)
	}
}
JSFX.MouseSpring.prototype.moveMasses = function()
{
	this.theMasses[0].screen.x = JSFX.Browser.mouseX+10;
	this.theMasses[0].screen.y = JSFX.Browser.mouseY;
	for(i=0 ; i<this.theMasses.length ; i++)
	{
		m = this.theMasses[i];
		m.screen.x += m.dx;
		m.screen.y += m.dy;
		m.moveTo(m.screen.x, m.screen.y);
	}
}

JSFX.MouseSpring.prototype.animate = function()
{
	this.updateSpeed();
	this.moveMasses();
}


JSFX.MakeSpring = function(n, img, ax, ay)
{
	var spring = new JSFX.MouseSpring(n, img, ax, ay);
	JSFX.MakeSpring.springs[JSFX.MakeSpring.springs.length] = spring;

	if(!JSFX.MakeSpring.theTimer)
		JSFX.MakeSpring.theTimer = setInterval("JSFX.MakeSpring.animate()", 40);

	return(spring);
}
JSFX.MakeSpring.springs = new Array();
JSFX.MakeSpring.animate = function()
{
	var i;
	for(i=0 ; i<JSFX.MakeSpring.springs.length ; i++)
		JSFX.MakeSpring.springs[i].animate();
}
//Class TextSpring extends MouseSpring
JSFX.TextSpring = function(textText, textColor, textFont,  textSize)
{
	//Call the super constructor
	this.superC = JSFX.MouseSpring;
	this.superC(textText.length, ".", 9.8, 0);

	if(textSize==null || textSize==0)
		textSize=4;

	if(textFont == null)
		textFont = "Arial";

	for(i=0 ; i<textText.length ; i++)
		this.theMasses[i].setContent(
						  "<FONT COLOR='"+textColor
						+ "' SIZE='" + textSize
						+ "' FACE='" + textFont
						+ "'>" 
						+ textText.charAt(i)
						+ "</FONT>"
							);
	this.springForce	= textText.length*6;
	this.friction	= -10;
}
JSFX.TextSpring.prototype = new JSFX.MouseSpring;

JSFX.MakeTextSpring = function(textText, textColor, textFont,  textSize)
{
	var spring = new JSFX.TextSpring(textText, textColor, textFont,  textSize);
	JSFX.MakeSpring.springs[JSFX.MakeSpring.springs.length] = spring;

	if(!JSFX.MakeSpring.theTimer)
		JSFX.MakeSpring.theTimer = setInterval("JSFX.MakeSpring.animate()", 40);

	return(spring);
}

/*** If no other script has added it yet, add the ns resize fix ***/
if(navigator.appName.indexOf("Netscape") != -1 && !document.getElementById)
{
	if(!JSFX.ns_resize)
	{
		JSFX.ow = outerWidth;
		JSFX.oh = outerHeight;
		JSFX.ns_resize = function()
		{
			if(outerWidth != JSFX.ow || outerHeight != JSFX.oh )
				location.reload();
		}
	}
	window.onresize=JSFX.ns_resize;
}

