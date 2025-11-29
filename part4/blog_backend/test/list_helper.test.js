const { test, desscribe, describe } = require('node:test')
const assert = require('node:assert')
const {dummy, totalLikes,favouriteBlog} = require('../utils/list_helper')


test('dummy returns one', () => {
    const blogs = []
    const result = dummy(blogs)
    assert.strictEqual(result, 1)   
})

describe('total likes', () => {
    test('of empty list is zero', () => {
        const blogs = []
        assert.strictEqual(totalLikes(blogs), 0)
    })
    test('when the list has only one blog',()=>{
        const listWithOneBlog = [
            {
              _id: '5a422aa71b54a676234d17f8',
              title: 'Go To Statement Considered Harmful',
              author: 'Edsger W. Dijkstra',
              url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
              likes: 5,
              __v: 0
            }
          ]
            assert.strictEqual(totalLikes(listWithOneBlog), 5)
    })
    test('When the list has multiple blogs',()=>{
        const blogs = [
            {
                "title": "Mi primer blog",
                "author": "Raul Garcia",
                "url": "https://localhost.com",
                "likes": 45,
                "id": "68ee1d4332be1f1bae44171e"
            },
            {
                "title": "Mi segundo blog",
                "author": "Raul Garcia",
                "url": "https://localhost.com",
                "likes": 5,
                "id": "68ee1d9732be1f1bae441721"
            }
        ]
        assert.strictEqual(totalLikes(blogs), 50)
    })
})
describe('Favourite blog',()=>{
    test('of empty list is null', () => {
        const blogs = []
        //deepStrictEqual for objects
        assert.deepStrictEqual (favouriteBlog(blogs), null)
    })
    test('only one blog is in the list',()=>{
        const blogs = [
            {
                "title": "Mi primer blog",
                "author": "Raul Garcia",
                "url": "https://localhost.com",
                "likes": 45,
                "id": "68ee1d4332be1f1bae44171e"
            }
        ]
        assert.deepStrictEqual (favouriteBlog(blogs), {
            "title": "Mi primer blog",
            "author": "Raul Garcia",
            "url": "https://localhost.com",
            "likes": 45,
            "id": "68ee1d4332be1f1bae44171e"
        })
    })
    test('multiple blogs in the list',()=>{
        const blogs = [
            {
                "title": "Mi primer blog",
                "author": "Raul Garcia",
                "url": "https://localhost.com",
                "likes": 45,
                "id": "68ee1d4332be1f1bae44171e"
            },
            {
                "title": "Mi segundo blog",
                "author": "Raul Garcia",
                "url": "https://localhost.com",
                "likes": 5,
                "id": "68ee1d9732be1f1bae441721"
            }
        ]
        assert.deepStrictEqual (favouriteBlog(blogs), {
            "title": "Mi primer blog",
            "author": "Raul Garcia",
            "url": "https://localhost.com",
            "likes": 45,
            "id": "68ee1d4332be1f1bae44171e"
        })
    })
})