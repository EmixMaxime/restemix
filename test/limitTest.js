const chai   = require('chai')
const expect = chai.expect
const limitFactory = require('../http/cursors/limit')
const { request: requestFactory } = require('fhttp')

const limit = limitFactory({ request: requestFactory() })

describe('limit', () => {

  it('It should returns limit object', () => {
    const limitQuery = { limit: 5, sort: -1 }
    const fakeRequest = { query: limitQuery }

    const cursor = limit(fakeRequest)

    delete limitQuery.sort
    expect(cursor).to.be.eql(limitQuery)
  })

})
