(function() {
    window.addEventListener("load", function() {
        Array.from(document.getElementsByClassName("bubbled")).forEach(x=>addBubbles(x));
    });

    /**
     * 
     * @param {Element} x 
     */
    function addBubbles(x) {
        var canvas = document.createElement("canvas");

        canvas.classList.add("bubble-canvas");

        canvas.width = x.clientWidth;
        canvas.height = x.clientHeight;
        
        var ctx = canvas.getContext("2d");

        var seed = Math.random();

        var bubbleLife = {};

        var offHeight = x.offsetTop;

        function refresh(time) {
            var w = canvas.width, h = canvas.height;
            ctx.clearRect(0, 0, w, h);

            var scr = (window.scrollY - offHeight);

            for(var i = 0; i < w; i += 75) {
                for(var j = 0; j < h; j += 75) {

                    var random = mulberry32((i | j) ^ bubbleLife[i + ',' + j] ^ seed);

                    var depth = random() + 0.5, x = random(), y = random(), scrollAmnt = (random() - 0.4) * 1.25;
                    
                    ctx.fillStyle = rColour(random());

                    var bubbleSize = 10 * depth;
                    bubbleSize *= Math.sin(random() * Math.PI * 2 + (time / 4000));
                    if(bubbleSize < 0) {
                        bubbleLife[i + ',' + j] = bubbleLife[i + ',' + j] || 0;
                        bubbleLife[i + ',' + j]++;

                        bubbleSize = 0;
                    }

                    hexagon(ctx, bubbleSize, i + Math.floor(x * 65) + 10, j + Math.floor(y * 65 + 10 + scr * scrollAmnt))
                    ctx.fill();
                }
            }
        }

        requestAnimationFrame(function anim(time) {
            requestAnimationFrame(anim);
            refresh(time);
        });

        if(x.children.length > 0) {
            x.insertBefore(canvas, x.firstChild);
        } else {
            x.appendChild(canvas);
        }
    }

    function mulberry32(a) {
        return function() {
          var t = a += 0x6D2B79F5;
          t = Math.imul(t ^ t >>> 15, t | 1);
          t ^= t + Math.imul(t ^ t >>> 7, t | 61);
          return ((t ^ t >>> 14) >>> 0) / 4294967296;
        }
    }
    
    function rColour(i) {
        const colours = ["#D99D0D", "#52B44B", "#33406C"];
        return colours[Math.floor(i * colours.length)]
    }
    
    function hexagon(ctx, size, x, y) {
        ctx.beginPath();
        
        for(var i = 0; i < 6; i++) {
            var dX = x + (Math.cos(i/6 * Math.PI * 2) * size);
            var dY = y + (Math.sin(i/6 * Math.PI * 2) * size);
            
            if(i == 0) ctx.moveTo(dX, dY);
            else ctx.lineTo(dX, dY);
        }
        
        ctx.closePath();
        
        
        //ctx.fillRect(x, y, size, size);
    }
})();