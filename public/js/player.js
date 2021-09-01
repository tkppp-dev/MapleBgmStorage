const bgm = new Audio()
let volume = 0.5
let currentListItem
let isBgmLoad = false
let isPlaying = false
let isLoop = true
let isMute = false
let prev, current, next

bgm.addEventListener('canplay', () => {
    bgm.play()
})

bgm.addEventListener('ended', () => {
    if (next.length != 0) {
        playBgmOnPlaylist(next[0].id)
    } else if (next.length == 0 && prev.length != 0) {
        playBgmOnPlaylist(prev[0].id)
    } else {
        playBgmOnPlaylist(current.id)
    }
})

window.addEventListener('load', () => {
    setPlayerPosition()
    addLoopBtnEventHandler()
    addShufleBtnEventHandler()
    addNextBtnEventHandeler()
    addPrevBtnEventHandler()
    addPlayBtnEventHandler()
    addPauseBtnEventHandler()
    addVolumeBtnEventHandler()
    addVolumeRangeEventHandler()
})

window.addEventListener('scroll', () => {
    setPlayerPosition()
})

window.addEventListener('resize', () => {
    setPlayerPosition()
})

function leftShiftPlaylist() {

    if (prev.length != 0 || next.length != 0) {
        next.unshift(current)
        current = prev.pop()
    }
    return current.id
}

function rightShiftPlaylist() {
    if (prev.length != 0 || next.length != 0) {
        prev.push(current)
        current = next.shift()
    }
    return current.id
}

function setPlayer(res) {
    bgm.src = 'resources/bgm/' + res.data.src

    const bgmTitle = document.getElementsByClassName('bgm-title')
    for (let v of bgmTitle) {
        v.innerHTML = current.name
    }

    const bgmImage = document.getElementById('bgm-thumbnail')
    bgmImage.src = res.data.base64Image
}

function setPlaylist() {
    let playList = ''
    prev.forEach((el) => {
        playList += `<div class=" p-2 border-bottom" role="button" onclick="playBgmOnPlaylist(${el.id})">${el.name}</div>`
    })
    playList += `<div id="current-playing-item" class="current-play-list-item p-2 border-bottom">${current.name}</div>`
    next.forEach((el) => {
        playList += `<div class="p-2 border-bottom" role="button" onclick="playBgmOnPlaylist(${el.id})">${el.name}</div>`
    })

    const currentPlayList = document.getElementById('current-play-list')
    currentPlayList.innerHTML = playList
    setPlayListPosition(currentPlayList)
}

async function playBgmOnPlaylist(id) {
    let isFaster = false

    for (let v of prev) {
        if (v.id == id) {
            isFaster = true
            break
        }
    }
    if (isFaster) {
        while (leftShiftPlaylist() != id) {

        }
    } else {
        while (rightShiftPlaylist() != id) {

        }
    }

    const res = await axios.get('/player', {
        params: {
            id,
            type: 'onPlaylist'
        }
    })
    setPlayer(res)
    setPlaylist()
}

async function playBgm(id, listId) {
    try {
        const page = location.pathname.slice(1)
        const axiosParam = {
            params: {
                id
            }
        }
        if (id === null) {
            axiosParam.params.type = 'playlist'
            axiosParam.params.listId = listId
        } else if (page == 'playlistPage') {
            axiosParam.params.type = 'playlist+id'
            axiosParam.params.listId = listId
        } else if (page == 'searchPage') {
            axiosParam.params.type = 'search'
        } else {
            axiosParam.params.type = 'standard'
        }

        const res = await axios.get('/player', axiosParam)

        prev = res.data.playlist.prev
        current = res.data.playlist.current
        next = res.data.playlist.next

        setPlayer(res)
        setPlaylist()

        if (isBgmLoad == false || isPlaying == false) {
            const play = document.getElementsByClassName('play-btn')
            const pause = document.getElementsByClassName('pause-btn')
            Array.prototype.forEach.call(play, (el, i) => {
                el.style.display = 'none'
                pause[i].style.display = 'inline'
            })
            isBgmLoad = true
        }
    } catch (err) {
        console.log(err)
    }
}

function setPlayerPosition() {
    const navHeight = document.getElementById('nav').offsetHeight
    const player = document.getElementById('player')
    const currentList = document.getElementById('current-play-list')
    const blank = document.getElementById('blank-player')
    const currentListLabel = document.getElementById('current-list-label').getBoundingClientRect()

    currentList.style.height = (innerHeight - currentListLabel.bottom) + 'px'
    if (scrollY > navHeight) {
        player.style.position = 'fixed'
        player.style.left = 0
        player.style.top = 0

        blank.style.width = '276px'
    } else {
        player.style.position = 'relative'
        blank.style.width = '0'
    }
}

function setPlayListPosition(currentPlayList) {
    const currentPlayItem = document.getElementById('current-playing-item')
    const playListRect = currentPlayList.getBoundingClientRect()
    const playItemRect = currentPlayItem.getBoundingClientRect()

    const bottomOffset = playItemRect.bottom - playListRect.bottom
    const topOffset = playItemRect.top - playListRect.top

    currentPlayList.scrollTop += bottomOffset > 0 ? bottomOffset : 0
    currentPlayList.scrollTop += topOffset < 0 ? topOffset : 0
}

function addNextBtnEventHandeler() {
    const nextBtn = document.getElementsByClassName('next-btn')

    Array.prototype.forEach.call(nextBtn, el => {
        el.addEventListener('click', () => {
            if (isBgmLoad) {
                const prevLen = prev.length
                const nextLen = next.length
                if (!(prevLen == 0 && nextLen == 0)) {
                    if (nextLen > 0) {
                        playBgmOnPlaylist(next[0].id)
                    } else {
                        playBgmOnPlaylist(prev[0].id)
                    }
                }
                if(!isPlaying){
                    playBgmBtn()
                }
            }
        })
    })
}

function addPrevBtnEventHandler() {
    const prevBtn = document.getElementsByClassName('prev-btn')

    Array.prototype.forEach.call(prevBtn, el => {
        el.addEventListener('click', () => {
            if (isBgmLoad) {
                const prevLen = prev.length
                const nextLen = next.length
                if (!(prevLen == 0 && nextLen == 0)) {
                    if (prevLen == 0) {
                        playBgmOnPlaylist(next[nextLen - 1].id)
                    } else {
                        playBgmOnPlaylist(prev[prevLen - 1].id)
                    }
                }
                if(!isPlaying){
                    playBgmBtn()
                }
            }
        })
    })
}

function addLoopBtnEventHandler() {
    const loopBtn = document.getElementsByClassName('loop-btn')

    Array.prototype.forEach.call(loopBtn, el => {
        el.addEventListener('click', () => {
            if (isLoop) {
                bgm.loop = true
                isLoop = false
                for (let i = 0; i < 2; i++) {
                    loopBtn[i].src = './images/control-panel/control-panel-loopOne.png'
                }
            } else {
                bgm.loop = false
                isLoop = true
                for (let i = 0; i < 2; i++) {
                    loopBtn[i].src = './images/control-panel/control-panel-loopList.png'
                }
            }
        })
    })
}

function addPlayBtnEventHandler() {
    const playBtn = document.getElementsByClassName('play-btn')

    Array.prototype.forEach.call(playBtn, (el, i) => {
        el.addEventListener('click', () => {
            if (isBgmLoad) {
                playBgmBtn()
                bgm.play()
                isPlaying = true
            }
        })
    })
}

function playBgmBtn() {
    if (isBgmLoad) {
        const playBtn = document.getElementsByClassName('play-btn')
        const pauseBtn = document.getElementsByClassName('pause-btn')
        for (let i = 0; i < 2; i++) {
            playBtn[i].style.display = 'none'
            pauseBtn[i].style.display = 'inline'
        }
    }
}

function addPauseBtnEventHandler() {
    const pauseBtn = document.getElementsByClassName('pause-btn')

    Array.prototype.forEach.call(pauseBtn, (el, i, arr) => {
        el.addEventListener('click', () => {
            const playBtn = document.getElementsByClassName('play-btn')
            for (let i = 0; i < 2; i++) {
                pauseBtn[i].style.display = 'none'
                playBtn[i].style.display = 'inline'
            }

            bgm.pause()
            isPlaying = false
        })
    })
}

function addShufleBtnEventHandler() {
    const shuffleBtn = document.getElementsByClassName('shuffle-btn')

    for (let v of shuffleBtn) {
        v.addEventListener('click', () => {
            const temp = prev.concat(next)
            temp.sort(() => Math.random() - 0.5)

            const splitIdx = Math.floor(Math.random() * (temp.length))
            prev = temp.slice(0, splitIdx)
            next = temp.slice(splitIdx)

            setPlaylist()
        })
    }
}

function addVolumeBtnEventHandler() {
    const volumeBtn = document.getElementsByClassName('volume-btn')
    const volumeRange = document.getElementsByClassName('volume-range')

    for (let v of volumeBtn) {
        v.addEventListener('click', () => {
            if (!isMute) {
                for (let el of volumeBtn) {
                    el.src = "./images/control-panel/control-panel-mute.png"
                }
                for (let el of volumeRange) {
                    el.value = 0
                }
                bgm.volume = 0
                isMute = true
            } else {
                for (let el of volumeBtn) {
                    el.src = "./images/control-panel/control-panel-volume.png"
                }
                for (let el of volumeRange) {
                    el.value = volume
                }
                bgm.volume = volume
                isMute = false
            }
        })
    }
}

function addVolumeRangeEventHandler() {
    const volumeRange = document.getElementsByClassName('volume-range')
    const volumeBtn = document.getElementsByClassName('volume-btn')

    for (let v of volumeRange) {
        v.addEventListener('input', () => {
            if (isMute) {
                isMute = false
                for (let el of volumeBtn) {
                    el.src = './images/control-panel/control-panel-volume.png'
                }
            }
            volume = v.value
            for (let el of volumeRange) {
                el.value = volume
            }
            bgm.volume = volume
        })
    }
}