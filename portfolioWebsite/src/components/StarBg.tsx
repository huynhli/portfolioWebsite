import { useEffect, useRef } from "react"  

type Star = {
  x: number  
  y: number  
  size: number  
  dx: number  
  dy: number  
  color: string  
  opacity: number  
  lifetime: number  
  elapsed: number  
  delay: number  
}  



export default function StarBg() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)  
    const COLORS = [
        "rgb(255, 217, 0)",
        "rgb(144, 249, 255)",
        "rgb(222, 81, 30)",
        "rgb(255, 255, 255)",
        "rgb(124, 54, 11)",
        "rgb(224, 138, 0)",
        "rgb(94, 172, 255)",
    ];

    useEffect(() => {
        const canvas = canvasRef.current  
        if (!canvas) return  
        const ctx = canvas.getContext("2d")  
        if (!ctx) return  

        let width = (canvas.width = window.innerWidth)  
        let height = (canvas.height = window.innerHeight)  

        const STAR_COUNT = 10 
        const stars: Star[] = []  

        function createStar(delay = 0): Star {
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 3 + 1,
            dx: Math.random() * 2 - 1,
            dy: Math.random() * 2 - 1,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            opacity: 0,
            lifetime: 900+(Math.random()*200), // 1 second
            elapsed: 0,
            delay,
        }  
        }

        // spawn a new star gradually
        const spawnInterval = setInterval(() => {
        if (stars.length < STAR_COUNT) {
            stars.push(createStar(Math.random() * 1000))   // random delay up to 1s
        }
        }, 500)  

        let lastTime = performance.now()  

        function animate(now: number) {
            const delta = now - lastTime  
            lastTime = now  
            if (!ctx) return

            ctx.clearRect(0, 0, width, height)  

            stars.forEach((star, i) => {
                star.elapsed += delta  

                if (star.elapsed < star.delay) return   // not visible yet

                const effectiveTime = star.elapsed - star.delay  

                // fade out over lifetime
                star.opacity = 1 - effectiveTime / star.lifetime  
                if (star.opacity < 0) {
                // respawn star with new delay
                stars[i] = createStar(Math.random() * 1000)  
                return  
                }

                // update position
                star.x += star.dx  
                star.y += star.dy  

                // wrap around edges
                if (star.x > width) star.x = 0  
                if (star.x < 0) star.x = width  
                if (star.y > height) star.y = 0  
                if (star.y < 0) star.y = height  

                // draw
                ctx.fillStyle = star.color;
                ctx.globalAlpha = star.opacity;
                ctx.shadowBlur = star.size * 2;          // makes the blur proportional to star size
                ctx.shadowColor = star.color;            // glow matches the star color
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;      
            })  

            requestAnimationFrame(animate)  
        }

        requestAnimationFrame(animate)  

        window.addEventListener("resize", () => {
            width = canvas.width = window.innerWidth  
            height = canvas.height = window.innerHeight  
        })  

        return () => clearInterval(spawnInterval)  
    }, [])  

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-[-1]" />  
}
