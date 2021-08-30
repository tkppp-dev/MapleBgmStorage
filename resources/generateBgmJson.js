const fs = require('fs')

const Bgm = function(){
    this.world = null
    this.continent = null
    this.town = null
    
    this.add = function(val, dep){
        val = val.trim()
        switch(dep){
            case 0:
                this.world = val
                break;
            case 1:
                this.continent = val
                break;
            case 2:
                this.town = val
                break;
        }
    }
}

const bgmInfo = {}
function readBgm(dir, bgm, dep = 0){
    const filename = fs.readdirSync(dir)

    filename.forEach((v, idx, arr) => {
        let result = v.split('.')
        let file = bgm
        if(file === undefined){
            file = new Bgm()
        }
        if(result[result.length - 1] != 'mp3'){
            let pos
            if(result.length == 1){
                pos = 0
            }
            else{
                pos = 1
            }
            
            file.add(result[pos], dep)
            readBgm(dir + '/' + v, file, dep+1)
        }
        else{
            if(result[1] == 'mp3') {
                if(!bgmInfo.hasOwnProperty(file.world)){
                    bgmInfo[file.world] = []
                }
                bgmInfo[file.world].push({
                    name : result[0],
                    category1 : file.world,
                    category2 : file.continent,
                    category3 : file.town,
                    depth : dep,
                    type : 'field'
                })
            }
            else{
                fs.unlinkSync(dir + '/' + v)
            }
        }
        
        if(arr.length - 1 === idx){
            if(dep === 3){
                file.town = null
            }else if(dep === 2){
                file.continent = null
            }
            dep -= 1
        }
    })
}

readBgm('./bgm')

for(let key in bgmInfo){
    let data = JSON.stringify(bgmInfo[key], null, 2)
    fs.writeFileSync(`${key}.json`, data)
}
