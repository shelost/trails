const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

//var CENT_X, CENT_Y, A_W, A_H, XPAD, YPAD;

var scl = canvas.height*0.01

var logo = new Image()
logo.src = 'trails-logo.png'

var CENT_X, CENT_Y,A_W, A_H, XPAD, YPAD

setVariables()


function Squircle(x,y,w,h,r){

    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.r = r

    this.xspeed = 0
    this.yspeed = 0

    this.playerOn = false

    this.draw = function(){
        
        ctx.beginPath()
        ctx.moveTo(this.x+this.r, this.y)
        ctx.lineTo(this.x+this.w-this.r, this.y)
        ctx.arc(this.x+this.w-this.r, this.y+this.r, this.r, Math.PI*3/2, Math.PI*2)
        ctx.lineTo(this.x+this.w, this.y+this.h-this.r)
        ctx.arc(this.x+this.w-this.r, this.y+this.h-this.r,this.r, 0, Math.PI/2)
        ctx.lineTo(this.x+this.r, this.y+this.h)
        ctx.arc(this.x+this.r, this.y+this.h-this.r, this.r, Math.PI/2, Math.PI)
        ctx.lineTo(this.x, this.y+this.r)
        ctx.arc(this.x+this.r, this.y+this.r, this.r, Math.PI, Math.PI*3/2)
        ctx.fill()
        ctx.closePath()

    }
}

var Area;


const player = {

    x: CENT_X,
    y: CENT_Y,
    r: scl,

    xspeed: 0,
    yspeed: 0,

    history: [],

    points: 0,

    seq: 0,

    dead: false
}

const goal = {

    x: Math.random()*A_W+XPAD,
    y: Math.random()*A_H+YPAD,
    r: scl,

    xspeed: 0,
    yspeed: 0,

    captured: false
}

setInterval(()=>{


    if (player.seq>0.8){

        player.history.push([player.x, player.y, 0])
    }
    
},50)


const con = {

    left:false,
    right:false,
    up:false,
    down: false,
    space: false,
    keyListener:function(event) {
  
      var key_state = (event.type == "keydown")?true:false;
  
      switch(event.keyCode) {
  
        case 37:// left key
          con.left = key_state;
          break;
        case 38:// up key
          con.up = key_state;
          break;
        case 39:// right key
          con.right = key_state;
          break;
        case 40: // down key
          con.down = key_state;
          break;
        case 32: // space bar
          con.space = key_state;
          break;
      }
    }
}

const loop = () => {

    Area = new Squircle(XPAD,YPAD,A_W, A_H, scl*2)

    setVariables()

    // Player Controls

    if (!player.dead){
    if (con.right){

        player.xspeed += scl/20
    }

    if (con.left){

        player.xspeed -= scl/20
    }

    if (con.up){

        player.yspeed -= scl/20
    }

    if (con.down){

        player.yspeed += scl/20
    }

    player.x += player.xspeed
    player.y += player.yspeed

    player.xspeed *= 0.9
    player.yspeed *= 0.9

    }

    if (con.space){

        Restart()
    }

    // Player Boundaries
    if (player.x < XPAD+player.r){

        player.x = XPAD+A_W-player.r
    }else if (player.x > XPAD+A_W-player.r){
        player.x = XPAD+player.r
      
    }

    if (player.y < YPAD+player.r){
        player.y = YPAD+A_H-player.r
       
    }else if (player.y > YPAD+A_H-player.r){
        player.y = YPAD+player.r
        
    }

    // Plus One
    if (Collision(player, goal)){

        goal.captured = true
    }

    if (goal.captured){

        plusOne()
    }

    
   
    ctx.fillStyle = 'black'
    Area.draw()

    for (i=0;i<player.history.length;i++){

        var hitbox = {

            x: player.history[i][0],
            y: player.history[i][1],
            r: player.r*0.5
        }

     

        if (player.history[i][2] == 1){

            ctx.fillStyle = 'red'
         }else{
            ctx.fillStyle = 'gray'
    
        }
    
      
        if (Collision(player, hitbox) && player.history[i][2] === 1){

            player.dead = true
        }

        if (Collision)
   
        ctx.beginPath()
        ctx.arc(player.history[i][0], player.history[i][1], hitbox.r, 0, Math.PI*2)
        ctx.fill()
    }

    if (!player.dead){

        ctx.fillStyle = 'royalblue'
    }else{

        ctx.fillStyle = 'red'
    }
  
    ctx.beginPath()
    ctx.arc(player.x, player.y, player.r, 0, Math.PI*2)

    ctx.fill()

    if (!player.dead){

        ctx.fillStyle = 'gold'
    }else{

        ctx.fillStyle = 'red'
    }
    ctx.beginPath()
    ctx.arc(goal.x, goal.y, goal.r, 0, Math.PI*2)
    ctx.fill()



    if (!player.dead){

        ctx.fillStyle = 'white'
        ctx.font = `${scl/3}rem Arial`
        ctx.fillText(player.points, XPAD+40, YPAD+A_H-40)


    }
    if (player.dead){

        ctx.globalAlpha = 0.4
        ctx.fillStyle = 'white'

        if (player.points < 10){

            ctx.font = `${scl*5}rem Arial Black`
            ctx.fillText(player.points, XPAD+50, YPAD+A_H-40)
        }else{
            ctx.font = `${scl*3}rem Arial Black`
            ctx.fillText(player.points, XPAD+20, YPAD+A_H*0.75)

        }


        ctx.globalAlpha = 1
        ctx.fillStyle = 'white'
        ctx.font = `${scl/3}rem Arial`
        ctx.fillText('Press Space to Restart', XPAD+A_W/8, YPAD+A_H/2+30)

    }

    ctx.drawImage(logo,30,25,logo.width/12,logo.height/12)

   
}


window.addEventListener('keydown', con.keyListener)
window.addEventListener('keyup', con.keyListener)

setInterval(()=>{

    loop()
}, 1000/60)

setInterval(()=>{

    player.seq += 0.1
},100)

function setVariables(){

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    CENT_X = canvas.width/2
    CENT_Y = canvas.height/2
    A_W = canvas.height*0.7
    A_H = canvas.height*0.7
    XPAD = CENT_X-A_W/2
    YPAD = CENT_Y-A_H/2
}

function Collision(one,two){

    if ((two.x-one.x)**2+(two.y-one.y)**2 < (two.r+one.r)**2){

        return true
    }else{

        return false
    }
}

function plusOne(){

    goal.x = Math.random()*(A_W-goal.r*2)+XPAD+goal.r
    goal.y = Math.random()*(A_H-goal.r*2)+YPAD+goal.r

    player.points += 1

    goal.captured = false

    setTimeout(()=>{
        for (u=0;u<player.history.length;u++){

            player.history[u][2] = 1
        }

    },500)
    

    player.seq = 0

}

function Restart(){

    player.history = []
    player.points = 0
    player.x = CENT_X
    player.y = CENT_Y
    player.dead = false
    message = ''
}