const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const CENT_X = canvas.width/2
const CENT_Y = canvas.height/2

var numClicks = 0

function ParticleCollision(particle, block){

    if (particle.x > block.x-particle.r && particle.x < block.x+block.w+particle.r &&
        particle.y > block.y-particle.r && particle.y < block.y+block.h+particle.r){

        return true

    }else{

        return false
    }
}


function Particle(x,y){

    this.x = x
    this.y = y
    this.r = 10
    
    this.xspeed = Math.random()>0.5? 0.3+Math.random()*0.5 : -0.3-Math.random()*0.5
    this.yspeed = Math.random()>0.5? 0.3+Math.random()*0.5 : -0.3-Math.random()*0.5

    this.xspeedInit = this.xspeed
    this.yspeedInit = this.yspeed

    this.history = []

    //this.color = Colors[Math.floor(Math.random()*Colors.length)]

    this.color = 'red'

    setInterval(()=>{

        this.history.push([this.x, this.y])
    }, 100)

    setTimeout(()=>{

        setInterval(()=>{

            this.history.shift()
        }, 100)
    },700)
    
}

function Block(x,y,w,h){

    this.x = x
    this.y = y
    this.w = w
    this.h = h

    this.hit = false
}

var Colors = [

    'royalblue',
    'red',
    'green',
    'cyan',
    'orange',
    'yellow',
    'purple'

]

var Particles = []
var Blocks = []

for (f=0;f<15;f++){

    var w = new Block(Math.random()*(canvas.width-100)+50,Math.random()*(canvas.height-100)+50,50,50)

    Blocks.push(w)
}
var Goal = {

    x: 0,
    y: 0,
    r: 20
}

// Mouse Events
var M_X, M_Y, N_X, N_Y

window.addEventListener('mousemove', e =>{

    M_X = e.clientX
    M_Y = e.clientY
})

window.addEventListener('click', e =>{

    N_X = e.clientX
    N_Y = e.clientY

    numClicks += 1

    for(t=0;t<15;t++){

        var p = new Particle(N_X, N_Y)

        Particles.push(p)
    }
  
})


const loop =()=>{


    canvas.width = window.innerWidth
    canvas.height = window.innerHeight


    for (r=0;r<Particles.length;r++){

        var particle = Particles[r]

        particle.x += particle.xspeed
        particle.y += particle.yspeed
    
        particle.xspeed *= 0.9
        particle.yspeed *= 0.9


        if (particle.xspeed > 0){

            particle.xspeed += Math.abs(particle.xspeedInit)
        }else{
            particle.xspeed -= Math.abs(particle.xspeedInit)
        }
    
        if (particle.yspeed >0){
    
            particle.yspeed += Math.abs(particle.yspeedInit)
        }else{
            particle.yspeed -= Math.abs(particle.yspeedInit)
        }
    
        // Boundaries
        if (particle.x< particle.r ||
            particle.x > canvas.width-particle.r){
    
            particle.xspeed *= -1-(Math.random()*0.6-0.3)
        }
    
        if (particle.y < particle.r ||
            particle.y > canvas.height-particle.r){
    
            particle.yspeed *= -1-(Math.random()*0.6-0.3)
        }
    

        // Trails
        for (i=0;i<particle.history.length;i++){


            var order = particle.history.length-i
            ctx.fillStyle = particle.color
            ctx.globalAlpha = 1/order+.3
            ctx.beginPath()
            ctx.arc(particle.history[i][0], particle.history[i][1], particle.r/3, 0, Math.PI*2)
            ctx.fill()
            ctx.globalAlpha = 1
        
        }

        for (n=0;n<Blocks.length;n++){

            var block = Blocks[n]

            if (ParticleCollision(particle, block)){

                if (particle.y < block.y || particle.y > block.y+block.h){

                    particle.yspeed *= -1
                }else{
                    particle.xspeed *= -1

                }

                block.hit = true
              
                
            }
        }
    
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI*2)
        ctx.fill()
        
    }

    

  
/*
    if (particle.x < M_X){

        particle.xspeed += 1
    }else{
        particle.xspeed -= 1
    }

    if (particle.y < M_Y){

        particle.yspeed += 1
    }else{
        particle.yspeed -= 1
    }
*/

 
    for (c=0;c<Blocks.length;c++){

        var block = Blocks[c]

        if (block.hit){

            ctx.fillStyle = 'red'
        }else{
            ctx.fillStyle = 'black'
        }
        
        ctx.fillRect(block.x, block.y, block.w, block.h)
    }

 
  
    ctx.fillStyle = 'black'
    ctx.beginPath()
    ctx.arc(M_X, M_Y, 10, 0, Math.PI*2)
    ctx.fill()

    ctx.fillStyle = 'black'
    ctx.font = '30px Arial Black'
    ctx.fillText(numClicks,20,40)



    

}

setInterval(()=>{

    loop()
},1000/60)

setInterval(()=>{

    if (Particles[0]){

        Particles.splice(0,1)
    }

},200)