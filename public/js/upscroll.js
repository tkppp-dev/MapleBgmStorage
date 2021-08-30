window.addEventListener('load', () => {
    const upscroll = document.getElementById('upscroll-btn')
    const bottomBlank = document.getElementById('bottom-blank')
    
    upscroll.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        })
    })

    const resizeObserver = new ResizeObserver(entries => {
        for(let entry of entries){
            const rect = entry.contentRect
            if(entry.contentRect.height > 56){
                upscroll.style.bottom = 2 * rect.y + rect.height + 'px'
                bottomBlank.style.height = 2 * rect.y + rect.height + 'px'
            }
            else{
                upscroll.style.bottom = 2 * rect.y + rect.height + 'px'
                bottomBlank.style.height = 2 * rect.y + rect.height + 'px'
            }
        }
    })
    
    const bottomPlayer = document.getElementById('bottom-player')
    resizeObserver.observe(bottomPlayer)
})
