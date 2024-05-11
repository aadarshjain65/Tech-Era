import {Component} from 'react'
import TailSpin from 'react-loader-spinner'
import Header from '../Header'
import Course from '../Course'
import Failure from '../Failure'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {apiStatus: apiStatusConstants.initial, coursesList: []}

  componentDidMount() {
    this.getCourses()
  }

  getCourses = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const url = 'https://apis.ccbp.in/te/courses'
    const options = {
      method: 'GET',
    }

    const response = await fetch(url, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.courses.map(eachCourse => ({
        id: eachCourse.id,
        name: eachCourse.name,
        logoUrl: eachCourse.logo_url,
      }))

      this.setState({
        coursesList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onRetry = () => {
    this.getCourses()
  }

  renderSuccessView = () => {
    const {coursesList} = this.state

    return (
      <ul className="courses-list-container">
        {coursesList.map(eachCourse => (
          <Course key={eachCourse.id} courseItemDetails={eachCourse} />
        ))}
      </ul>
    )
  }

  renderFailureView = () => <Failure onRetry={this.onRetry} />

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <TailSpin height="20" width="20" color="#4656a1" />
    </div>
  )

  renderCoursesView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="app-container">
        <Header />
        <div className="courses-container">
          <h1 className="courses-heading">Courses</h1>
          {this.renderCoursesView()}
        </div>
      </div>
    )
  }
}

export default Home
