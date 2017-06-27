const chai   = require('chai')
const expect = chai.expect
const sortFactory = require('../http/cursors/sort')
const _includes = require('lodash/includes')
const { request: requestFactory } = require('fhttp')

const BadRequestError = require('../http/BadRequestError')
const sort = sortFactory({request: requestFactory(), _includes})

describe('sort', () => {

  it('It should returns sort object (with desc and asc query)', () => {
    const sortQuery = {
      sort: 'title,author,date',
      desc: 'title',
      asc: 'author,date',
    }
    const expectedCursor = { sort: {title: -1, author: 1, date: 1 } }
    const fakeRequest = { query: sortQuery }

    const cursor = sort(fakeRequest)
    expect(cursor).to.be.eql(expectedCursor)
  })

  it('It should returns sort object (with desc query)', () => {
    const sortQuery = {
      sort: 'title,author,date',
      desc: 'title,author,date',
    }
    const expectedCursor = { sort: { title: -1, author: -1, date: -1 } }

    const fakeRequest = { query: sortQuery }
    const cursor = sort(fakeRequest)

    expect(cursor).to.be.eql(expectedCursor)
  })

  it('It should returns an empty Object without sort query', () => {
    const fakeRequest = { query: {}}
    const cursor = sort(fakeRequest)
    expect(cursor).to.be.eql({})
  })

  it('It should throws an BadRequestError with same query fields asc and desc', () => {
    const sortQuery = {
      sort: 'title,author',
      desc: 'title',
      asc: 'author,title',
    }

    const fakeRequest = { query: sortQuery }

    expect(() =>
      sort(fakeRequest))
      .to.throw(BadRequestError)
  })

  it('It should throws an BadRequestError with query asc without into sort', () => {
    const sortQuery = {
      sort: 'title',
      desc: 'title',
      asc: 'author',
    }

    const fakeRequest = { query: sortQuery }

    expect(() =>
      sort(fakeRequest))
      .to.throw(BadRequestError)

  })
})