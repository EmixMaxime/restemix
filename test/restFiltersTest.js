const sinon = require('sinon')
const chai   = require('chai')
const expect = chai.expect

const projection = require('../http/filters/projection')
const { RestFilters, GetRestFilters } = require('../http/restFilters')

const restFilters = RestFilters({ projection })

describe('RestFilters', () => {

  it('It should calls projection with request', () => {
    const fakeRequest = { query: {} }
    const fakeProjection = (req) => {}
    const projectionSpy = sinon.spy(fakeProjection)

    const fakeRestFilters = RestFilters({ projection: projectionSpy })
    fakeRestFilters(fakeRequest).projection()

    expect(projectionSpy.calledWith(fakeRequest)).to.be.true
  })

  it('Integration test', () => {
    const fakeRequest = {
      query: { includes: 'title,author' }
    }
    const expectedResult = { title: true, author: true }

    const result = restFilters(fakeRequest).projection().get()
    expect(result).to.be.eql(expectedResult)
  })

})