window.addEventListener('load', () => {
    const mainAnker = document.getElementById('main-anker')
    const homeAnker = document.getElementById('home-anker')
    const searchAnker = document.getElementById('search-anker')
    const playlistAnker = document.getElementById('playlist-anker')
    
    mainAnker.href = `http://${location.host}/`
    homeAnker.href = `http://${location.host}/`
    searchAnker.href = `http://${location.host}/searchPage`
    playlistAnker.href = `http://${location.host}/playlistPage`
    
    const path = location.pathname
    if(path == '/'){
        homeAnker.classList.add('active')
    }
    else if(path == '/searchPage'){
       searchAnker.classList.add('active')
    }
    else if(path == '/playlistPage'){
        playlistAnker.classList.add('active')
    }
})
function goLoginPage(){
    location.href = `http://${location.host}/loginPage?return=${location.href}`
}
function goJoinPage(){
    location.href = `http://${location.host}/joinPage`
}
function goMyPage(){
    location.href = `http://${location.host}/myPage`
}
function logout(){
    axios.post('auth/logout')
        .then((res) => {
            if(res.data.logout){
                location.reload(true)
            }
        })
        .catch((err) => {
            console.error(err)
        })
}