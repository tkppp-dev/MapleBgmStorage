class Node {
    constructor(category) {
        if (category == null) {
            this.data = 'root'
        } else {
            this.data = {
                name: category.name,
                engName: category.engName,
                parentName: category.parentName || 'root'
            }
        }
        this.child = []
        this.childBgm = []
    }
}

class BgmNode {
    constructor(obj) {
        this.id = obj.id
        this.name = obj.name,
            this.category1 = obj.category1
        this.category2 = obj.category2
        this.category3 = obj.category3
    }

    getPath() {
        const pathMember = [
            this.category1,
            this.category2,
            this.category3,
            this.name
        ]

        return pathMember.filter((v) => {
            if (v == null) {
                return false
            } else {
                return true
            }
        }).join('/')
    }
}

class CategoryTree {
    constructor() {
        this.root = new Node()
        this.root.data = 'root'
    }

    searchTree(node, name) {
        if (node.child.length === 0) {
            return null
        } else {
            for (let v of node.child) {
                if (name === v.data.name) {
                    return v
                }
                let result = this.searchTree(v, name)
                if (result !== null && result !== undefined) {
                    return result
                }
            }
        }
    }

    add(category) {
        if (category.parentName == undefined) {
            this.root.child.push(new Node(category))
        } else {
            const result = this.searchTree(this.root, category.parentName)
            result.child.push(new Node(category))
        }
    }

    findBgmNode(bgm) {
        let parentCat
        switch (bgm.depth) {
            case 1:
                parentCat = bgm.category1
                break
            case 2:
                parentCat = bgm.category2
                break
            case 3:
                parentCat = bgm.category3
                break
        }
        const parentNode = this.searchTree(this.root, parentCat)

        let splitIdx
        const [bgmNode] = parentNode.childBgm.filter((v, i) => {
            if (v.name === bgm.name) {
                splitIdx = i
                return true
            } else {
                return false
            }
        })
        return {
            bgmNode,
            parentNode,
            splitIdx
        }
    }

    addBgm(bgm) {
        for (let v of bgm) {
            let category
            switch (v.depth) {
                case 1:
                    category = v.category1
                    break
                case 2:
                    category = v.category2
                    break
                case 3:
                    category = v.category3
                    break
            }
            let result = this.searchTree(this.root, category)
            result.childBgm.push(new BgmNode(v))
        }
    }
}

const FirstCat = require('../models/firstCategory')
const SecondCat = require('../models/secondCategory')
const ThirdCat = require('../models/thirdCategory')

module.exports = async function () {
    const tree = new CategoryTree()

    const pp = await FirstCat.findAll({
        raw: true,
        attributes: ['name', 'engName']
    })
    for (let v of pp) {
        tree.add(v)
    }

    const rawP = await SecondCat.findAll({
        nested: true,
        attributes: ['name', 'engName'],
        include: [{
            model: FirstCat,
            attributes: [
                ['name', 'parentName']
            ],
        }]
    })

    let p = rawP.map((v) => {
        let temp = v.dataValues
        return {
            name: temp.name,
            engName: temp.engName,
            parentName: temp.FirstCategory.dataValues.parentName
        }
    })
    for (let v of p) {
        tree.add(v)
    }

    const rawC = await ThirdCat.findAll({
        nested: true,
        attributes: ['name', 'engName'],
        include: [{
            model: SecondCat,
            attributes: [
                ['name', 'parentName']
            ],
        }]
    })

    let c = rawC.map((v) => {
        let temp = v.dataValues
        return {
            name: temp.name,
            engName: temp.engName,
            parentName: temp.SecondCategory.dataValues.parentName
        }
    })

    for (let v of c) {
        tree.add(v)
    }

    return tree
}