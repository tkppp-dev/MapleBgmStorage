let isFirst = true

window.addEventListener('load', function () {
    const searchBtn = document.getElementById('search-btn')
    const searchBar = document.getElementById('search-bar')

    searchBar.addEventListener('keyup', () => {
        if (event.keyCode == 13) {
            searchBtn.click()
        }
    })

    searchBtn.addEventListener('click', async () => {
        const res = await axios.get('/search', {
            params: {
                input: encodeURIComponent(searchBar.value)
            }
        })

        const bgmSearchBody = document.getElementById('bgm-search-body')
        const playlistSearchBody = document.getElementById('playlist-search-body')

        if (res.data.bgmResult.length > 0) {
            bgmSearchBody.innerHTML = getBgmResultNode(res.data.bgmResult)
        } else {
            bgmSearchBody.innerHTML = `<p class="px-2">"${searchBar.value}" 검색 결과가 없습니다.</p>`
        }

        if (res.data.playlistResult.length > 0) {
            playlistSearchBody.innerHTML = getPlaylistResultNode(res.data.playlistResult)
        } else {
            playlistSearchBody.innerHTML = `<p class="px-2">"${searchBar.value}" 검색 결과가 없습니다.</p>`
        }

        if (isFirst) {
            const bgmSearchResult = document.getElementById('bgm-search-result')
            const playlistSearchResult = document.getElementById('playlist-search-result')

            bgmSearchResult.classList.remove('d-none')
            playlistSearchResult.classList.remove('d-none')
            isFirst = false
        }
        setListLike(res.data.listLikeArr)
        createModal()
    })
})

function getBgmResultNode(bgmList) {
    let innerHtml = ''
    for (let bgm of bgmList) {
        innerHtml += `<div class="bgm-item row border-bottom mx-1">
                                <div class="col py-1" onclick="playBgm(${bgm.id})" role="button">
                                    ${bgm.name}
                                </div>
                                <div role="button" data-bs-toggle="modal" data-bs-target="#listSelectModal"
                                    class="bgmId-${bgm.id} add-playlist col-auto">
                                    <img src="./images/add-playlist.png" style="width: 20px; height: 20px;">
                                </div>
                            </div>`
    }
    return innerHtml
}

async function changeLike(listId) {
    const el = event.target
    const list = document.getElementsByClassName(`list-id-${listId}`)
    const idx = el.classList.length - 1
    if (el.classList[idx] === 'like') {
        const res = await axios.delete('/playlist/like', {
            params: {
                listId
            }
        })
        if (res.data.success) {
            for (let v of list) {
                v.src = './images/unlike-star.png'
                v.classList.remove('like')
                v.classList.add('unlike')
            }
        }
    } else if (el.classList[idx] === 'unlike') {
        const res = await axios.post('/playlist/like', {
            listId
        })
        if (!res.data.isLogin) {
            alert('로그인이 필요한 서비스입니다')
        } else if (res.data.success) {
            for (let v of list) {
                v.src = './images/like-star.png'
                v.classList.remove('unlike')
                v.classList.add('like')
            }
        } else {
            alert(res.data.message)
        }
    }
}

async function setListLike(listLikeArr) {
    const likeBtnArr = document.getElementsByClassName(`like-btn`)

    for (let i = 0; i < likeBtnArr.length; i++) {
        if (listLikeArr.length > 0) {
            if (!listLikeArr[i].isLike) {
                likeBtnArr[i].src = './images/like-star.png'
                likeBtnArr[i].classList.add('like')
            } else {
                likeBtnArr[i].classList.add('unlike')
            }
        } else {
            likeBtnArr[i].classList.add('unlike')
        }
    }
}

function getPlaylistResultNode(listData) {
    let innerHtml = ''
    for (let i = 0; i < listData.length; i++) {
        innerHtml += `<div>
                            <div class="playlist-title my-1 border-bottom px-1 pb-1">
                                <div class="row">
                                    <div class="col" data-bs-toggle="collapse" href="#searchList-${i}"
                                        role="button">
                                        <span style="font-size: 16px;">${listData[i].name}</span>
                                        <img class="list-btn" src="./images/expand-more.png">
                                    </div>
                                    <div class="row me-1 px-0 col-auto">
                                        <div class="col-auto px-1">
                                            <img class="list-id-${listData[i].id} like-btn list-btn"
                                                role="button" onclick="changeLike(${listData[i].id})"
                                                src="./images/unlike-star.png">
                                        </div>
                                        <div class="col-auto px-1" role="button" onclick="playBgm(null, ${listData[i].id})">
                                            <img class="list-btn" src="./images/play-playlist.png">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="searchList-${i}" class="collapse">`
        for (let item of listData[i].PlayListItems) {
            innerHtml += `
                            <div class="row border-bottom py-1 mx-1">
                                <div class="col row play-list-item" onclick="playBgm(${item.Bgm.id}, ${listData[i].id})"
                                    role="button">
                                    <div class="col-lg-6 col-md-12 playlist-item-component" style="font-size: 15px;">
                                        ${ item.Bgm.name }
                                    </div>
                                    <div class="col-lg-6 col-md-12 playlist-item-component playlist-item-category">
                                        ${ item.Bgm.category1 } > ${ item.Bgm.category2}
                                        ${ item.Bgm.category3 != undefined ? '> '+ item.Bgm.category3 : '' }
                                    </div>
                                </div>
                                <div class="row col-auto">
                                    <div class="add-playlist col-auto px-1" role="button" data-bs-toggle="modal"
                                        data-bs-target="#listSelectModal">
                                        <img class="list-btn" src="./images/add-playlist.png">
                                    </div>
                                </div>
                            </div>`
        }
        innerHtml += '</div></div>'
    }
    return innerHtml
}