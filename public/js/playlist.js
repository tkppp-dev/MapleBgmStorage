window.addEventListener('load', async () => {
    const popularBtn = document.getElementById('list-popular')
    const recentBtn = document.getElementById('list-recent')
    const popularBody = document.getElementById('list-popular-body')
    const recentBody = document.getElementById('list-recent-body')
    const deleteListBtn = document.getElementById('delete-playlist')

    popularBtn.addEventListener('click', () => {
        if (nowOpenList == 'recent') {
            popularBtn.classList.remove('unactive-list')
            recentBtn.classList.add('unactive-list')
            popularBody.classList.remove('d-none')
            recentBody.classList.add('d-none')
            nowOpenList = 'popular'
        }
    })
    recentBtn.addEventListener('click', () => {
        if (nowOpenList == 'popular') {
            recentBtn.classList.remove('unactive-list')
            popularBtn.classList.add('unactive-list')
            recentBody.classList.remove('d-none')
            popularBody.classList.add('d-none')
            nowOpenList = 'recent'
        }
    })

    await setListLike(0, 'popular')
    await setListLike(0, 'recent')
})

let nowOpenList = 'popular'
let popularListOffset = 1
let recentListOffset = 1

async function refreshMyList(listId, mylistId) {
    try {
        const res = await axios.get('/playlist/mylist', {
            params: {
                listId
            }
        })

        if (res.data.success) {
            const refreshNode = document.getElementById(`myList-${mylistId}`)
            let body = ''
            for (let item of res.data.listBgmArr) {
                body += `<div class="row border-bottom py-1 mx-1">
                        <div class="col row play-list-item" onclick="playBgm('${item.Bgm.id}','${item.list_id}')"
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
                            <div class="bgmId-${item.Bgm.id} add-playlist col-auto px-1" role="button"
                                data-bs-toggle="modal" data-bs-target="#listSelectModal">
                                <img class="list-btn" src="./images/add-playlist.png">
                            </div>
                            <div class="col-auto px-1" onclick="deleteListItem('${item.list_id}','${item.id}', '${mylistId}')"
                                role="button">
                                <img class="list-btn" src="./images/delete-btn.png">
                            </div>
                        </div>
                    </div>`
            }
            refreshNode.innerHTML = body
        }
    } catch (err) {
        console.error(err)
    }
}

async function setListLike(offset, type) {
    const likeBtn = document.getElementsByClassName(`like-btn-${type}`)

    const res = await axios.get('playlist/like', {
        params: {
            offset,
            type
        }
    })
    if (res.data.isLogin) {
        for (let i = offset * 10; i < likeBtn.length; i++) {
            if (res.data.likeList[i - offset * 10].isLike) {
                likeBtn[i].src = './images/like-star.png'
                likeBtn[i].classList.add('like')
            } else {
                likeBtn[i].classList.add('unlike')
            }
        }
    } else {
        for (let i = offset * 10; i < likeBtn.length; i++) {
            likeBtn[i].classList.add('unlike')
        }
    }
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

async function deleteList(listId) {
    const agree = confirm('해당 재생목록을 삭제하시겠습니까?')
    if (agree) {
        const res = await axios.delete('/playlist', {
            params: {
                id: listId
            }
        })
        if (res.data.success) {
            alert(res.data.message)
            location.reload()
        } else {
            alert(res.data.message)
        }
    }
}

async function deleteListItem(listId, itemId, loopIdx) {
    const agree = confirm('해당 곡을 재생목록에서 삭제하시겠습니까?')
    if (agree) {
        const res = await axios.delete('/playlist/item', {
            params: {
                listId: listId,
                itemId: itemId,
            }
        })
        if (res.data.success) {
            alert(res.data.message)
            refreshMyList(listId, loopIdx)
        } else {
            alert(res.data.message)
        }
    }
}

async function addNextList() {
    const offset = nowOpenList == 'popular' ? popularListOffset : recentListOffset
    const listType = nowOpenList == 'popular' ? 'popular' : 'recent'

    const res = await axios.get('/playlist/nextList', {
        params: {
            offset,
            listType
        }
    })
    if (res.data.success) {
        const html = makeNextListHtml(res.data.list, listType, offset)
        const listNode = document.getElementById(`list-${listType}-body`)
        let temp = listNode.innerHTML + html
        listNode.innerHTML = temp
        setListLike(offset, listType)
        if (listType == 'popular') {
            popularListOffset += 1
        } else {
            recentListOffset += 1
        }
    } else {
        alert(res.data.message)
    }
}

function makeNextListHtml(listData, listType, offset) {
    let innerHtml = ''

    for (let i = 0; i < listData.length; i++) {
        innerHtml += `<div>
                    <div class="playlist-title my-1 border-bottom px-1 pb-1">
                        <div class="row">
                            <div class="col" data-bs-toggle="collapse" href="#${listType}List-${i + offset*10 + 1}"
                                role="button">
                                ${listType == 'popular' ? `<span class="mx-1">${i + offset*10 + 1}</span>` : ''}
                                <span style="font-size: 16px;">${listData[i].name}</span>
                                <img class="list-btn" src="./images/expand-more.png">
                            </div>
                            <div class="row me-1 px-0 col-auto">
                                <div class="col-auto px-1">
                                    <img class="list-id-${listData[i].id} like-btn-${listType} list-btn"
                                        role="button" onclick="changeLike('${listData[i].id}')"
                                        src="./images/unlike-star.png">
                                </div>
                                <div class="col-auto px-1" role="button" onclick="playBgm(null,'${listData[i].id}')">
                                    <img class="list-btn" src="./images/play-playlist.png">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="${listType}List-${i + offset*10}" class="collapse">`
        for (let item of listData[i].PlayListItems) {
            innerHtml += `
                    <div class="row border-bottom py-1 mx-1">
                        <div class="col row play-list-item" onclick="playBgm('${item.Bgm.id}','${listData[i].id}')"
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