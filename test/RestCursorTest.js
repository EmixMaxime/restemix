const sinon = require('sinon')
const chai   = require('chai')
const expect = chai.expect

const _includes = require('lodash/includes')
const { request: requestFactory } = require('fhttp')
const { RestCursor, GetRestCursor } = require('../http/restCursors')
const limit = require('../http/cursors/limit')
const sort = require('../http/cursors/sort')

const request = requestFactory()
const restCursor = RestCursor({ sort: sort({ _includes, request }), limit: limit({ request })  })

describe('RestCursor', () => {

  it('It should calls limit and sort with request', () => {
    const fakeLimit = (req) => {}
    const fakeSort = (req) => {}
    const fakeRequest = { query: {} }

    const limitSpy = sinon.spy(fakeLimit)
    const sortSpy = sinon.spy(fakeSort)

    const restCursorMock = RestCursor({ sort: sortSpy, limit: limitSpy })
    restCursorMock(fakeRequest).limit();

    expect(limitSpy.calledOnce).to.be.true
  })

  it('Integration test', () => {
    const query = {
      sort: 'title,author,date',
      desc: 'title',
      asc: 'author,date',
      limit: 5,
    }
    const fakeRequest = { query }
    const expectedCursor = { sort: {title: -1, author: 1, date: 1 }, limit: 5 }

    const result = restCursor(fakeRequest).limit().sort().get()
    expect(result).to.be.eql(expectedCursor)
  })

})
